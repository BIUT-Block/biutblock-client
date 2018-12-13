<template>
  <el-container>
    <el-row>
      <el-col :span="24"> 
        <section class="nodeCnt">
          <section class="nodeCntH">

            <p class="nodeTit">Node information</p>

            <p class="" style="width:77px;margin-top:28px;display:flex;flex-direction:column;color: #939CB2;">
              <span class="nodeTxt" style="margin-bottom:5px;color: #C8D1DA;">IP address：</span>
                <span style="line-height:1.5">{{ipAddress}}</span>
            </p>

            <p class="" style="width:144px;margin:28px 104px 0 94px;display:flex;flex-direction:column;color: #939CB2;">
              <span class="nodeTxt" style="margin-bottom:5px;color: #C8D1DA;">Current system time：</span>
               <span style="line-height:1.5">{{systemTime.substring(0,34)}}</span>
            </p>

            <p class="" style="width:144px;margin-top:28px;display:flex;flex-direction:column;color: #939CB2;">
              <span class="nodeTxt" style="margin-bottom:5px;color: #C8D1DA;">local time：</span>
               <span style="line-height:1.5">{{localTime.substring(0,34)}}</span>
            </p>
          </section>

          <section class="nodeListCnt">
            <section class="nodeListCntP">
              <span class="nodeSwitch">
                <el-switch
                  v-model="progressVal"
                  active-color="#C8D1DA"
                  inactive-color="#00D6B2"
                  :disabled="disabledBtn"
                > 
                  <!-- 默认不可点击，进度条加载完成之后可点击 -->
                </el-switch>
                 <span style="color:#C8D1DA;margin-left:5px;">Mining</span>
              </span>
              <p class="updateTime">Last update time</p>
            </section>
            <p class="updateTime2">{{updateTime}}</p>

            <p style="margin-top: 57px;width:480px" v-show="!timeCntShow">
              <el-progress :percentage="progressPercentage"></el-progress>
              <section style="display: flex;justify-content: space-between;color: #657292;margin: 11px 40px 0px 0px">
                 <span>{{progress}} GB / {{progressAll}} GB</span> 
                 <span>{{consumptionTimt}}</span> 
              </section>
            </p>

            <!-- 点击挖矿 -->
            <input type="text" v-model="timeCnt" v-show="timeCntShow">

            <button class="publicBtn publicBtnAcitve" :class="startBtnActive" style="margin-top: 80px;" @click="startSyncing">
              {{startBtn}}
            </button>
          </section>
        </section>
        
        <el-dialog
          title="prompt"
          :visible.sync="centerDialogVisible"
          width="430px"
          :closeOnClickModal = false
          top="30vh"
          center>
          <p style="text-align: center;font-size:16px;margin:62px 0 93px;">Insufficient balance, unable to mine</p>
          <span slot="footer" class="dialog-footer">
            <button class="publicBtn publicBtnAcitve" @click="centerDialogVisible = false">Recharge immediately</button>
          </span>
        </el-dialog>

      </el-col>
    </el-row>
  </el-container>

</template>

<script>
export default {
  name: '',
  data () {
    return {
      ipAddress: '',
      systemTime: '',
      localTime: '', 
      updateTime: '2017/11/01 09:00 UTC+8',
      timeCntShow: true,
      centerDialogVisible: false,
      progressVal: true,
      disabledBtn: true, // 切换显示 switch 开关
      progressAll: '0.00',
      progress:'0',
      progressPercentage: 0,
      consumptionTimt: '00:00:05',
      timeCnt: "You still not sync the data",
      startBtn: 'Start syncing',
      startBtnActive: '',
      siteStatus: {
        walletUpdateTime: '',
        mining: false,
        startBtnActive: true
      }
    }
  },
  created () {
    if (window.localStorage.getItem('siteStatus')) {
      this.siteStatus = JSON.parse(window.localStorage.getItem('siteStatus'))
      this.updateTime = this.siteStatus.walletUpdateTime
      this.disabledBtn = this.siteStatus.mining
      this.startBtnActive = this.siteStatus.startBtnActive
    }
    this.$JsonRPCClient.client.request('sec_getNodeInfo', [{timeServer: '0.de.pool.ntp.org'}], (err, response) => {
      if(response) {
        this.ipAddress = response.result.ipv4
        this.systemTime = new Date(response.result.time * 1000).toString()
        this.localTime = new Date().toString()
      } 
    })
  },
  methods: {
    startSyncing () { 
      this.timeCntShow = false
      this.startBtn = 'synchronizing...'
      // this.$JsonRPCClient.switchToLocalHost()
      this.$JsonRPCClient.client.request('sec_getTokenChainSize', [], (err, response) => {
        if (err) {
          return
        }
        // if (response && response.result.status === '1') {
        if (response.result.status === '1') {
          this.progressAll = (Number(response.result.value) / (1024*1024*1024)).toFixed(2)
        }
      })
      this.$JsonRPCClient.switchToLocalHost()
      this.$JsonRPCClient.client.request('sec_startNetworkEvent', [], (err, response) => {
        console.log(err)
        console.log(response)
        if (err) {
          return
        }
        // if (response && response.result.status === '1') {
        if (response) {
          
          this.startBtnActive = 'startBtnActive'
          this.startBtn = 'Start syncing'
          
          let progressInterval = setInterval( function() {
            this.progress = Number(this.progress) + Number(this.progressAll) / 5
            let tempStr = this.consumptionTimt
            this.consumptionTimt = tempStr.slice(0, tempStr.length-1) + (Number(tempStr.slice(tempStr.length-1))-1).toString()

            if (Number(this.progressAll) - this.progress > 0.001) {
              this.progressPercentage = (this.progress / Number(this.progressAll)) * 100
            } else {
              this.progressPercentage = 100
              this.progress = this.progressAll
              this.updateTime = new Date().toString()
              this.disabledBtn = false
              this.siteStatus.walletUpdateTime = this.updateTime
              window.localStorage.setItem('siteStatus', JSON.stringify(this.siteStatus))
              clearInterval(progressInterval)
            }
          }.bind(this), 1000)
        }
      })
      //this.centerDialogVisible = true
    }
  },
  watch: {
    progressVal: function(){
      console.log(this.progressVal)
      if (!this.progressVal) {
        this.$JsonRPCClient.client.request('sec_setPOW', ['1'], (err, response) => {
          if (err) {
            this.$alert('Can not start mining', 'prompt', {
                confirmButtonText: 'Confirm',
            });
            this.progressVal = true
            return
          }
          // if (response && response.result.status === '1') {
          if (response) {
            this.siteStatus.mining = false
            this.$alert('Begin Mining successfull', 'prompt', {
                confirmButtonText: 'Confirm',
            });
          } else {
            this.progressVal = true
            this.$alert('Can not start mining', 'prompt', {
                confirmButtonText: 'Confirm',
            });
          }
        })
      } else {
        this.$JsonRPCClient.client.request('sec_setPOW', ['0'], (err, response) => {
          if (err) {
            this.$alert('Can not stop mining', 'prompt', {
                confirmButtonText: 'Confirm',
            });
            this.progressVal = false
            return
          }
          // if (response && response.result.status === '1') {
          if (response) {
            this.siteStatus.mining = true
            this.$alert('Stop Mining successfull', 'prompt', {
                confirmButtonText: 'Confirm',
            });
          } else {
            this.progressVal = false
            this.$alert('Can not stop mining', 'prompt', {
                confirmButtonText: 'Confirm',
            });
          }
        })
      }
      window.localStorage.setItem('siteStatus', JSON.stringify(this.siteStatus))
    }
  }
}
</script>

<style scoped>
.ipt {width:336px;height:36px;margin: 43px 0 56px;outline: none;border-radius: 18px;
  border:1px solid #8C91A9;color:#263253;text-align: center;}

.nodeCnt {width: 826px;height: 532px;border-radius: 2px;background: #fff;
display: flex;flex-direction: column;margin: 24px 32px;box-shadow:0px 0px 15px rgba(0,91,76,0.05);}

.nodeCntH {height: 94px;display: flex;border-bottom: 1px solid rgba(200,209,218,0.5);color:#C8D1DA;background: #fff;}

.nodeNoActiveImg {vertical-align: middle;margin-right: 15px;}

.startBtnActive {background: rgba(0,214,178,.3);border-color:rgba(0,214,178,.3);}

.nodeListCnt {display: flex;flex-direction: column;flex: 1;align-items: center;margin-top: 60px;}
.nodeListCntP {width: 806px;position: relative;}

.nodeSwitch {color:#657292;position: absolute;top:0;left:20px;}
.updateTime {text-align:center;color:#C8D1DA;}
.updateTime2 {margin-top: 15px;font-size:14px;color:#939CB2;}

.nodeTit {text-align: center;font-size: 16px;margin:28px 94px 0 24px;color:#657292;}


input[type="text"]{width:412px;height:36px;text-align:center;border-radius:18px;border:1px solid #C8D1DA;
  text-align:center;outline:none;color:#657292;margin-top: 56px;}

section >>> .el-input__inner {border-radius: 18px;}
section >>> .el-progress-bar__inner {background: #00D6B2;}
section >>> .el-dialog__header {padding: 16px 0 14px;border-bottom:1px solid rgba(200,209,218,0.5);}
section >>> .el-dialog--center {height: 288px;}
</style>