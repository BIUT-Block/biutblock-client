<template>
  <el-container @click.native="closeWalletlsList">
    <el-row>
      <el-col :span="24"> 
        <section class="nodeCnt">
          <section class="nodeCntH">

            <p class="nodeTit">Node information</p>
            <p class="nodeTitle1">
              <span class="nodeTxt nodeTxtM">IP address：</span>
                <span class='nodeTxtL'>{{ipAddress}}</span>
            </p>

            <p class="nodeTitle2">
              <span class="nodeTxt nodeTxtM">Current system time：</span>
               <span class='nodeTxtL'>{{systemTime.substring(0,34)}}</span>
            </p>

            <p class="nodeTitle3">
              <span class="nodeTxt nodeTxtM">local time：</span>
               <span class='nodeTxtL'>{{localTime.substring(0,34)}}</span>
            </p>
          </section>

          <section class="nodeListCnt">
            <section class="nodeListCntP">
              <section>
                
                <!--  :class="disabledList == true?'disabledList':''" 设置不能点击要设置 disabledList 值 -->  
                <section class="selectWalletTit" @click="checkWallet" id="selectWalletList">
                  <span>{{walletName}}</span>
                  <img src="../../assets/image/walletList.png" width="14px" height="14px" alt="">
                </section>
                <transition name="fade">
                  <ul class="selectWalletList" v-show="listIndex">
                    <li v-for="item in walletsArr" :key="item.walletAddress" @click="checkWalletName(item)">{{item.walletName}}</li>
                  </ul>
                </transition>
              </section>
              <section class="nodeSwitch">
                  <el-switch
                    v-model="progressVal"
                    active-color="#C8D1DA"
                    inactive-color="#00D6B2"
                    :disabled="disabledBtn"
                  > 
                    <!-- 默认不可点击，进度条加载完成之后可点击 -->
                  </el-switch>
                  <span style="color:#C8D1DA;margin-left:5px;">Mining</span>
              </section>
            </section>

            <!-- 内容公共展示的部分 -->
            <p class="updateTime">Last update time</p>
            <p class="updateTime2">{{updateTime}}</p>
           
            <section class="digContent" v-show="digContent">
              <!-- 点击挖矿 -->
              <section  v-show="timeCntShow">
                <input type="text" readonly v-model="timeCnt">
              </section>
              
              <!-- 开始挖矿的百分比加载 -->
              <section >
                <p class="digContentH" v-show="!timeCntShow">
                  <el-progress :percentage="progressPercentage"></el-progress>
                  <section class="loadingCnt">
                    <span>{{progress}} GB / {{progressAll}} GB</span> 
                    <span>{{consumptionTimt}}</span> 
                  </section>
                </p>
              </section>
              
              <button class="publicBtn publicBtnAcitve" :disabled="alreadySelectWallet" style="margin-top: 80px;" @click="startSyncing">
                {{startBtn}}
              </button>
            </section>
            
            <!-- 挖矿中的 gif动态图 -->
            <section class="digImg" v-show="digImg">
              <img src="../../assets/image/node.gif" alt="" width="541px" height="116px">
            </section>

          </section>
        </section>
        
        <el-dialog
          title="prompt"
          :visible.sync="centerDialogVisible"
          width="430px"
          :closeOnClickModal = false
          top="30vh"
          center>
          <p style="text-align: center;font-size:16px;margin:62px 0 93px;">
            {{digContainer}}
          </p>
          <span slot="footer" class="dialog-footer">
            <button class="publicBtn publicBtnAcitve" @click="centerDialogVisible = false">Confirm</button>
          </span>
        </el-dialog>
        
      </el-col>
    </el-row>
  </el-container>

</template>

<script>
import {EventBus} from '../../lib/EventBus.js'
export default {
  name: '',
  data () {
    return {
      ipAddress: '',
      systemTime: '',
      localTime: '', 
      timeCntShow: true,
      listIndex:false,//点击选择钱包
      walletName: 'Please choose a wallet',//钱包name
      walletListActive:'',//钱包选中样式
      walletsArr: this.$route.query.walletsArr,
      walletName: 'Please choose a wallet',//钱包name
      selectedWallet: this.$store.state.Counter.selectedWallet === ''? '' : this.$store.state.Counter.selectedWallet ,
      startSyncBtn: true,
      centerDialogVisible: false,//挖矿提示弹窗
      digContainer:'',//挖矿弹窗内容
      progressVal: this.$store.state.Counter.mining,
      consumptionTimt: '00:00:05',
      timeCnt: "You still not sync the data",
      startBtn: 'Start syncing',
      startBtnActive: '',
      alreadySelectWallet: true,

      digContent: true, //主要内容页面
      digImg: false, // 挖矿动图默认不展示

    }
  },
  created () {
    //关闭状态下 是true  打开状态下是 false this.progressVal
    if (this.progressVal == true) {
      this.digContent = true
      this.digImg = false
      this.timeCntShow = true
    } else {
      this.digImg = true
      this.digContent = false
    }

    EventBus.$emit('changeSetVisibil', {
        isVisible: false,
        from: 'nodeinfo'
    })

    if (this.$store.state.Counter.progressAll !== 0) {
      this.timeCntShow = false   
      this.startBtnActive = 'startBtnActive'
    } else if (this.selectedWallet === '') {
      this.startBtnActive = 'startBtnActive'
    }

    if(this.$store.state.Counter.selectedWallet !== '') {
      let wallet = this.walletsArr.filter( (item) => item.walletAddress === this.$store.state.Counter.selectedWallet)
      this.walletName = wallet[0].walletName
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
    //切换钱包选择
    checkWallet() {
      this.listIndex = !this.listIndex
    },
    //选择钱包
    checkWalletName(item){
      this.selectedWallet = item.walletAddress
      this.walletName = item.walletName
      this.walletListActive = 'walletListActive'
      this.listIndex = false
      this.startBtnActive = ''
      this.alreadySelectWallet = false
      if(!this.$store.state.Counter.mining && this.$store.state.Counter.selectedWallet !== item.walletAddress ) {
        this.$store.commit('setSelectedWallet', item.walletAddress)
        let selectedWalletObj = this.walletsArr.filter((wallet) => wallet.walletAddress === item.walletAddress)
        this.$JsonRPCClient.client.request('sec_setAddress', [this.selectedWallet], (err, response) => {
          if(err) {
            return
          }
        })
        this.$JsonRPCClient.client.request('sec_setPOW', ['0'], (err, response) => {
          if (err) {
            this.$alert('Can not stop mining', 'prompt', {
                confirmButtonText: 'Confirm',
            });
            return
          }
        })
        this.$JsonRPCClient.client.request('sec_setPOW', ['1'], (err, response) => {
              if (err) {
                return
              }   
              if (response) {
                this.$alert(`You are now using ${selectedWalletObj[0].walletName} wallet to mine.`, 'prompt', {
                  confirmButtonText: 'Confirm',
              });
            }
          })
      }
    },
    //关闭列表
    closeWalletlsList(event) {
      let detailsList = document.getElementById('selectWalletList')
      if (!detailsList.contains(event.target) && this.listIndex) {
        this.listIndex = false;
      }
    },
    startSyncing () {
      EventBus.$emit('changeSetVisibil', {
        isVisible: false,
        from: 'nodeinfo'
      })
      this.timeCntShow = false
      this.startBtn = 'synchronizing...'
      this.$store.commit('setSelectedWallet', this.selectedWallet)
      // this.$JsonRPCClient.switchToLocalHost()
      this.$JsonRPCClient.client.request('sec_getTokenChainSize', [], (err, response) => {
        if (err) {
          return
        }
        
        if (response.result.status === '1') {
          this.$store.commit('updateProgressAll', response.result.value)
        }
      })
      this.$JsonRPCClient.switchToLocalHost()
      this.$JsonRPCClient.client.request('sec_setAddress', [this.selectedWallet], (err, response) => {
        if (err) {
          return
        }
      })
      this.$JsonRPCClient.client.request('sec_startNetworkEvent', [], (err, response) => {
        console.log(err)
        console.log(response)
        if (err) {
          return
        }
        if (response) {
          
          this.startBtnActive = 'startBtnActive'
          this.startBtn = 'Start syncing'
          
          let progressInterval = setInterval( function() {
            this.$store.commit('updateProgress')
            let tempStr = this.consumptionTimt
            this.consumptionTimt = tempStr.slice(0, tempStr.length-1) + (Number(tempStr.slice(tempStr.length-1))-1).toString()

            if (Number(this.progressAll) - this.progress > 0.001) {
              this.$store.commit('updateProgressCount')
            } else {
              this.$store.commit('setProgressFinish')
              this.$store.commit('setSelectedWallet', this.selectedWallet)
              this.startBtn = 'Syncing complete'
              clearInterval(progressInterval)
            }
          }.bind(this), 1000)
        }
      })
      //this.centerDialogVisible = true
    }
  },
  computed: {
    progressPercentage() {
      return this.$store.state.Counter.progressCount
    },
    progress() {
      return this.$store.state.Counter.progress
    },
    progressAll() {
      return this.$store.state.Counter.progressAll
    },
    updateTime() {
      return this.$store.state.Counter.updateTime
    },
    disabledBtn() {
      return this.$store.state.Counter.disableMiningBtn
    }

  },
  watch: {
    progressVal: {
      handler() {
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
          if (response) {
            this.$store.commit('setMining', false)
            // this.$alert('Begin Mining successfull', 'prompt', {
            //     confirmButtonText: 'Confirm',
            // });
            this.centerDialogVisible = true //挖矿弹窗
            this.digContainer = 'Begin Mining successfull' //弹窗内容
            this.digContent = false //开始挖矿就把内容页隐藏
            this.digImg = true //展示动画页
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
          
          if (response) {
            this.$store.commit('setMining', true)
            // this.$alert('Stop Mining successfull', 'prompt', {
            //     confirmButtonText: 'Confirm',
            // });
            this.centerDialogVisible = true //挖矿弹窗
            this.digContainer = 'Stop Mining successfull' //弹窗内容
            this.digContent = true //停止挖矿就把内容页显示
            this.digImg = false //关闭动画页
            this.timeCntShow = true //展示最初的页面
          } else {
            this.progressVal = false
            this.$alert('Can not stop mining', 'prompt', {
                confirmButtonText: 'Confirm',
            });
          }
        })
      }
      },
      immediate: false
    }
  }
}
</script>

<style scoped>
.nodeTitle1 {width:77px;margin-top:28px;display:flex;flex-direction:column;color: #939CB2;}
.nodeTitle2 {width:144px;margin:28px 104px 0 94px;display:flex;flex-direction:column;color: #939CB2;}
.nodeTitle3 {width:144px;margin-top:28px;display:flex;flex-direction:column;color: #939CB2;}
.nodeTxtM {margin-bottom:5px;color: #C8D1DA;}
.nodeTxtL {line-height:1.5}
.digImg {padding-top:125px;}
.digContent {text-align:center;}
.digContentH {margin-top: 57px;width:480px}
.loadingCnt {display: flex;justify-content: space-between;color: #657292;margin: 11px 40px 0px 0px;}
.disabledList {pointer-events: none;}
.nodeCnt {width: 826px;height: 532px;border-radius: 2px;background: #fff;
display: flex;flex-direction: column;margin: 24px 32px;box-shadow:0px 0px 15px rgba(0,91,76,0.05);}

.nodeCntH {height: 94px;display: flex;border-bottom: 1px solid rgba(200,209,218,0.5);color:#C8D1DA;background: #fff;}

.nodeNoActiveImg {vertical-align: middle;margin-right: 15px;}

.startBtnActive {background: rgba(0,214,178,.3)!important;border-color:rgba(0,214,178,.3)!important;}

.nodeListCnt {display: flex;flex-direction: column;flex: 1;align-items: center;margin-top: 20px;position: relative;}

.nodeListCntP {display: flex;position: absolute;left: 25px;}

.selectWalletTit {font-size:12px;font-family:Arial;line-height:12px;color:rgba(147,156,178,1);
  width:154px;height:32px;border-top-left-radius:2px;background:rgba(242,244,246,1);padding:0 8px;
  margin-right: 12px;;border-top-right-radius:2px;
  display:flex;align-items:center;justify-content: space-between;}
.selectWalletList {max-height:160px;width:170px;overflow: hidden;
overflow-y: auto;background:rgba(255,255,255,1);z-index: 999;position: absolute;top: 32px;
box-shadow:0px 1px 6px rgba(0,0,0,0.16);}
.selectWalletList li {height: 32px;line-height: 32px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;
  width:154px;padding:0 8px;color: #8C91A9;}
.selectWalletList li:hover,.walletListActive {background:#E3E7EC;color: #657292;}

.selectWalletList::-webkit-scrollbar { width: 6px; height: 2px;}
.selectWalletList::-webkit-scrollbar-thumb { background: #00D6B2!important;border-radius: 10px;}
.selectWalletList::-webkit-scrollbar-track {border-radius: 0;}

.fade-enter-active, .fade-leave-active {transition: opacity .5s;}
.fade-enter, .fade-leave-to{opacity: 0;}

.nodeSwitch {color:#657292;}
.updateTime {text-align:center;color:#C8D1DA;margin-top: 40px;}
.updateTime2 {margin-top: 15px;font-size:14px;color:#939CB2;}

.nodeTit {text-align: center;font-size: 16px;margin:28px 94px 0 24px;color:#657292;}


input[type="text"]{width:412px;height:36px;text-align:center;border-radius:18px;border:1px solid #C8D1DA;
  text-align:center;outline:none;color:#657292;margin-top: 56px;}

section >>> .el-input__inner {border-radius: 18px;}
section >>> .el-progress-bar__inner {background: #00D6B2;}
section >>> .el-dialog__header {height: 47px;line-height: 47px;padding: 0;border-bottom:1px solid rgba(200,209,218,0.5);}
section >>> .el-dialog--center {height: 288px;}
section >>> .el-dialog__headerbtn {top: 15px!important;right: 16px!important;}
</style>