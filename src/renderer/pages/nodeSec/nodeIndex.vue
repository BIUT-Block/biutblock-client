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
                  :disabled="disabledBtn"> 
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
      updateTime: '2017/11/01 09:00 UTC+8',
      timeCntShow: true,
      centerDialogVisible: false,
      progressVal: true,
      disabledBtn: true, // 切换显示 switch 开关
      progressAll: '50.2',
      progress:'25.1',
      progressPercentage: 50,
      consumptionTimt: '00:30:23',
      timeCnt: "1 year 7 days 12 hours 0 minutes No update",
      startBtn: 'Start syncing',
      startBtnActive: '',
    }
  },
  created () {
    this.$JsonRPCClient.client.request('sec_getNodeInfo', [{timeServer: 'DE'}], (err, response) => {
      this.ipAddress = response.result.ipv4
      this.systemItem = new Date(response.result.time * 1000).toString()
      this.localTime = new Date().toString()
    })
  },
  methods: {
    startSyncing () { 

      //同步节点
      this.timeCntShow = false
      


      //节点同步完成
      this.startBtn = 'synchronizing...'
      this.startBtnActive = 'startBtnActive'

      //挖矿余额不足的时候弹窗
      //this.centerDialogVisible = true
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