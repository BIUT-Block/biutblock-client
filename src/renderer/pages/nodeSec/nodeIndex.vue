<template>
  <el-container @click.native="closeWalletlsList">
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
              <section>
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
            <p class="updateTime">Last update time</p>
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

            <button class="publicBtn publicBtnAcitve" :class="startBtnActive" :disabled="alreadySelectWallet" style="margin-top: 80px;" @click="startSyncing">
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

        <el-dialog
          title="prompt"
          :visible.sync="showDialog"
          width="430px"
          :closeOnClickModal = false
          top="30vh"
          center>
          <p style="text-align: center;font-size:16px;margin:62px 0 93px;">Please choose the wallet you need to mine.</p>
          <span slot="footer" class="dialog-footer">
            <button class="publicBtn publicBtnAcitve" @click="showDialog=false">Determine</button>
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
      showDialog: false,//是否选择钱包的弹窗
      walletListActive:'',//钱包选中样式
      walletsArr: this.$route.query.walletsArr,
      walletName: 'Please choose a wallet',//钱包name
      selectedWallet: this.$store.state.Counter.selectedWallet === ''? '' : this.$store.state.Counter.selectedWallet ,
      startSyncBtn: true,
      centerDialogVisible: false,
      progressVal: this.$store.state.Counter.mining,
      consumptionTimt: '00:00:05',
      timeCnt: "You still not sync the data",
      startBtn: 'Start syncing',
      startBtnActive: '',
      alreadySelectWallet: true
    }
  },
  created () {
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
      //如果没有选择钱包先弹窗提示选钱包
      if (this.walletValue == 'Please choose a wallet') {
        this.showDialog = true
        return
      }
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
          
          if (response) {
            this.$store.commit('setMining', true)
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
      },
      immediate: false
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

.startBtnActive {background: rgba(0,214,178,.3)!important;border-color:rgba(0,214,178,.3)!important;}

.nodeListCnt {display: flex;flex-direction: column;flex: 1;align-items: center;margin-top: 20px;position: relative;}

.nodeListCntP {display: flex;position: absolute;left: 25px;}

.selectWalletTit {font-size:12px;font-family:Arial;line-height:12px;color:rgba(147,156,178,1);
  width:154px;height:32px;border-radius:2px;background:rgba(242,244,246,1);padding:0 8px;margin-right: 12px;
  display:flex;align-items:center;justify-content: space-between;}
.selectWalletList {max-height:160px;width:168px;border:1px solid rgba(200,209,218,.5);overflow: hidden;
overflow-y: auto;}
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