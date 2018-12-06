<template>
  <el-container>
    <el-row>
      <el-col :span="24"> 
        <section class="nodeCnt">
          <section class="nodeCntH">

            <p class="nodeTit">Node information</p>

            <p class="" style="width:77px;margin-top:28px;display:flex;flex-direction:column;">
              <span class="nodeTxt" style="margin-bottom:5px;">IP address：</span>
                {{ipAddress}}
            </p>

            <p class="" style="width:144px;margin:28px 104px 0 94px;display:flex;flex-direction:column;">
              <span class="nodeTxt" style="margin-bottom:5px;">Current system time：</span>
               {{systemTime}}
            </p>

            <p class="" style="width:144px;margin-top:28px;display:flex;flex-direction:column;">
              <span class="nodeTxt" style="margin-bottom:5px;">local time：</span>
               {{localTime}}
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

            <p style="width: 480px;margin-top: 57px;" v-show="!timeCntShow">
              <el-progress :percentage="progressPercentage"></el-progress>
              <section style="display: flex;justify-content: space-between;color: #657292;margin: 11px 40px 0px 0px">
                 <span>{{progressAll}} G / {{progress}} G</span> 
                 <span>{{consumptionTimt}}</span> 
              </section>
            </p>

            <!-- 点击挖矿 -->
            <input type="text" v-model="timeCnt" v-show="timeCntShow">

            <button class="publicBtn publicBtnAcitve" :class="startBtnActive" style="margin-top: 48px;" @click="startSyncing">
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
      ipAddress: '35.158.171.46',
      systemTime: '2018/11/07 18:00 UTC+8 ',
      localTime: '2018/11/07 09:00 UTC+8', 
      updateTime: '',
      timeCntShow: true,
      centerDialogVisible: false,
      progressVal: true,
      disabledBtn: true, // 切换显示 switch 开关
      progressAll: '50.2',
      progress:'0',
      progressPercentage: 0,
      consumptionTimt: '00:30:23',
      timeCnt: "1 year 7 days 12 hours 0 minutes No update",
      startBtn: 'Start syncing',
      startBtnActive: '',
    }
  },
  created () {
    this.$JsonRPCClient.client.request('sec_getNodeInfo', [{timeServer: '0.de.pool.ntp.org'}], (err, response) => {
      if(response) {
        this.ipAddress = response.result.ipv4
        this.systemItem = new Date(response.result.time * 1000).toString()
        this.localTime = new Date().toString()
      } 
    })
  },
  methods: {
    startSyncing () { 
      this.timeCntShow = false
      this.startBtn = 'synchronizing...'
      this.$JsonRPCClient.switchToLocalHost()
      this.$JsonRPCClient.client.request('sec_getTokenChainSize', [], (err, response) => {
        if (err) {
          return
        }
        // if (response && response.result.status === '1') {
        if (response) {
          this.progressAll = Number(response.result.value) / 1000000000
        }
      })
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
          
          let progressInterval = setInterval( () => {
            this.progress = Number(this.progress) + Number(this.progressAll) / 5
            if (Number(this.progressAll) - this.progress > 0.001) {
              this.progressPercentage = (this.progress / Number(this.progressAll)) * 100
            } else {
              this.progressPercentage = 100
              this.progress = this.progressAll
              this.updateTime = new Date().toString()
              this.disabledBtn = false
              clearInterval(progressInterval)
            }
          }, 1000)
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
            alert('Can not start mining')
            this.progressVal = true
            return
          }
          // if (response && response.result.status === '1') {
          if (response) {
            alert('Begin Mining successfull')
          } else {
            this.progressVal = true
            alert('Can not start mining')
          }
        })
      } else {
        this.$JsonRPCClient.client.request('sec_setPOW', ['0'], (err, response) => {
          if (err) {
            alert('Can not stop mining')
            this.progressVal = false
            return
          }
          // if (response && response.result.status === '1') {
          if (response) {
            alert('Stop Mining successfull')
          } else {
            this.progressVal = false
            alert('Can not stop mining')
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.ipt {width:336px;height:36px;margin: 43px 0 57px;outline: none;border-radius: 18px;
  border:1px solid #8C91A9;color:#263253;text-align: center;}

.nodeCnt {width: 806px;height: 532px;border-radius: 2px;background: #FAFAFA;padding: 24px 32px;
display: flex;flex-direction: column;}

.nodeCntH {height: 94px;display: flex;border-bottom:1px solid #C8D1DA;color:#C8D1DA;background: #fff;}

.nodeNoActiveImg {vertical-align: middle;margin-right: 15px;}

.startBtnActive {background: rgba(0,214,178,.3);border-color:rgba(0,214,178,.3);}

.nodeListCnt {display: flex;justify-content: center;padding-top: 60px;background: #fff;
  flex-direction: column;align-items: center;flex: 1;}
.nodeListCntP {width: 806px;position: relative;}

.nodeSwitch {color:#657292;position: absolute;top:0;left:30px;}
.updateTime {text-align:center;color:#C8D1DA;}
.updateTime2 {margin-top: 15px;font-size:14px;color:#939CB2;}

.nodeTit {text-align: center;font-size: 16px;margin:28px 94px 0 24px;color:#657292;}


input[type="text"]{width:412px;height:36px;text-align:center;border-radius:18px;border:1px solid #C8D1DA;
  text-align:center;outline:none;color:#657292;margin-top: 57px;}

section >>> .el-input__inner {border-radius: 18px;}
section >>> .el-progress-bar__inner {background: #00D6B2;}
section >>> .el-dialog__header {padding: 16px 0 14px;border-bottom:1px solid #C8D1DA;}
section >>> .el-dialog--center {height: 288px;}
</style>