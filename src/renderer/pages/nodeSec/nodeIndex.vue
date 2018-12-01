<template>
  <el-container>
    <el-row>
      <el-col :span="24"> 
        <section class="nodeCnt">
          <section class="nodeCntH">
            <p class="mt30 nodeTit">Node information</p>
            <p class="mt30">
              <span class="nodeTxt">IP address：</span>
                {{ipAddress}}
            </p>
            <p class="mt10">
              <span class="nodeTxt">Current system time：</span>
               {{systemTime}}
            </p>
            <p class="mt10">
              <span class="nodeTxt">local time：</span>
               {{localTime}}
            </p>
          </section>

          <section class="nodeListCnt">
            <section class="nodeListCntP">
              <span class="nodeSwitch">
                <el-switch
                  v-model="value2"
                  active-color="#C8D1DA"
                  inactive-color="#00D6B2"
                  :disabled="disabled"> 
                  <!-- 默认不可点击，进度条加载完成之后可点击 -->
                </el-switch>
                 
              </span>
              <p class="updateTime">Last update time</p>
            </section>
            <p class="updateTime2">{{updateTime}}</p>
            <p style="width: 480px;margin: 57px 0 73px;">
              <el-progress :percentage="progressPercentage"></el-progress>
              <section style="display: flex;justify-content: space-between;color: #657292;margin: 11px 40px 0px 0px">
                 <span>{{progressAll}} G / {{progress}} G</span> 
                 <span>{{consumptionTimt}}</span> 
              </section>
            </p>
            

            
            <button class="publicBtn publicBtnAcitve" @click="centerDialogVisible = true">Start syncing</button>
          </section>
        </section>
        
        <el-dialog
          title=""
          :visible.sync="centerDialogVisible"
          width="430px"
          :show-close=false
          :closeOnClickModal = false
          center>
          <p style="text-align: center;">Insufficient balance, unable to mine</p>
          <span slot="footer" class="dialog-footer">
            <button class="publicBtn publicBtnAcitve" @click="centerDialogVisible = false">determine</button>
            <button class="publicBtn publicBtnAcitve" @click="centerDialogVisible = false">cancel</button>
          </span>
        </el-dialog>

      </el-col>
    </el-row>
  </el-container>

</template>

<script>
import nodeNoActive from '../../assets/image/nodeNoActive.png'
import nodeActive from '../../assets/image/nodeActive.png'
import nodeBeginAction from '../../assets/image/nodeBeginAction.png'
export default {
  name: '',
  data () {
    return {
      ipAddress: '35.158.171.46',
      systemTime: '2018/11/07 18:00 UTC+8 ',
      localTime: '2018/11/07 09:00 UTC+8', 
      updateTime: '2017/11/01 09:00 UTC+8',
      centerDialogVisible: false,
      switchUrl: nodeNoActive,
      value1: true,
      value2: true,
      disabled: "disabled",
      progressAll: '50.2',
      progress:'25.1',
      progressPercentage: 50,
      consumptionTimt: '00:30:23'
    }
  },
  created () {
    this.$JsonRPCClient.client.request('sec_getNodeInfo', [{timeServer: '200.19.74.21'}], (err, response) => {
      if (err) {
        console.log(err)
      }
      console.log(response)
      this.ipAddress = response.result.ipv4
      this.systemTime = new Date(response.result.time*1000)
      this.localTime = new Date()
    })
  },
  methods: {

  }
}
</script>

<style scoped>
.ipt {width:336px;height:36px;margin: 43px 0 57px;outline: none;border-radius: 18px;
  border:1px solid #8C91A9;color:#263253;text-align: center;}

.nodeCnt {width: 806px;height: 532px;border-radius: 2px;background: #FAFAFA;padding: 24px 32px;
display: flex;flex-direction: column;}

.nodeCntH {height: 210px;display: flex;flex-direction: column;justify-content: center;
  background: url('../../assets/image/nodeBg.png') no-repeat;background-size: cover;color: #fff;}

.nodeNoActiveImg {vertical-align: middle;margin-right: 15px;}

.nodeListCnt {display: flex;justify-content: center;padding-top: 60px;background: #fff;
  flex-direction: column;align-items: center;flex: 1;}
.nodeListCntP {width: 806px;position: relative;}

.nodeSwitch {color:#657292;position: absolute;top:0;left:30px;}
.updateTime {text-align:center;color:#657292;}
.updateTime2 {margin-top: 15px;font-size:14px;color:#657292;}

.nodeTit {color: #F3F8F7;text-align: center;}
.nodeTxt {color: #C8D1DA;width: 120px;text-align:right;display: inline-block;margin-left:285px;}

section >>> .el-input__inner {border-radius: 18px;}

section >>> .el-progress-bar__inner {background: #00D6B2;}

</style>