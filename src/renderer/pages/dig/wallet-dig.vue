<template>
  <main class="wallet-dig-container">
    <section class="dig-container">
      <!-- 挖矿头部 -->
      <section class="dig-header">
        <section class="dig-header-check">
          <h3>Mining Family</h3>
          <section class="exclamation-list">
            <span>Mining Wallet</span>
            <img src="../../assets/images/exclamationImg.png" alt="" @mousemove="tipsShow=true" @mouseout="tipsShow=false" />
          </section>

          <section class="button-list">
            <ul>
              <li ref="walletListImg">
                0x{{ selectedWalletAddress.replace(/(.{6}).+(.{8})/,'$1...$2') }}
              </li>
            </ul>
            <wallet-button type="button" 
                :text="digButton"
                :disabled="!checkedWallet"
                :class="[miningIn ? 'miningIn' : '', checkedWallet ? 'passCorrect' : '']"
                @click.native="beginDigMask"/>
          </section>
          <h4 class="available-text">Available：<span>{{ availableMoney.toLocaleString('en-US') }} BIUT</span></h4>
          <h4 class="guarantee-text">Guarantee：<span>{{ freezeMoney.toLocaleString('en-US') }} BIUT</span></h4>
          
          <transition name="fade">
            <section class="dig-tips" v-show="tipsShow">
              <p class="dig-tips-txt">
                Note：Inviting mining, the wallet amount must be  more than 10,000 BIUT balances.
              </p>
            </section>
          </transition>

        </section>

        <section class="dig-header-list">
          <ul>
            <li v-for="text in processTexts">·&nbsp;&nbsp;&nbsp;&nbsp;{{text}}</li>
          </ul>
        </section>
      </section>

      <wallet-margin />
      <!-- 挖矿内容 -->
      <section class="dig-body">
        <!-- tab列表 -->
        <section class="tab-list">
          <ul>
            <li @click="tabPage(1)" :class="pageIdx == 1 ? 'checkColor' : ''">Mining Profit</li>
            <li @click="tabPage(2)" :class="pageIdx == 2 ? 'checkColor' : ''">Lock Record</li>
            <li @click="tabPage(3)" :class="pageIdx == 3 ? 'checkColor' : ''">Mining Pool</li>
          </ul>
          <section>
            <p>
              My invitation code：
              <span id="invitationCode">{{ invitationCode }}</span>
            </p>
            <img src="../../assets/images/copy.png" alt=""  
              @click="copyCode"  
              data-clipboard-target="#invitationCode" 
              class="copyButton"/>
          </section>
        </section>

        <!-- 挖矿收益 -->
        <section class="dig-earnings" v-show="pageIdx == 1">
          <!-- 挖矿内容-头部 -->
          <dig-title  
            :number="digNumber"
            :digTitleShow="true"
            :selectedWallet="selectedWallet" 
            :selectedPrivateKey="selectedPrivateKey" 
            :wallets="this.$route.query.wallets" 
            :income="digIncome"/>
          <!-- 挖矿内容-列表 -->
          <section class="dig-earnings-list">
            <dig-list :digLists="moreList"/>
          </section>
        </section>
        
        <!-- 锁仓记录 -->
        <section class="Lock-record" v-show="pageIdx == 2">
          <lock-record :itemList = "recordLists"/>
        </section>

        <!-- 矿池 -->
        <section class="ore-pool" v-show="pageIdx == 3">
          <ore-pool 
            :pages="orePoolPage"
            :availableMoney="availableMoney"
            :freezeMoney="freezeMoney"
            :walletAddress="selectedWallet.walletAddress" />
        </section>

      </section>
      <wallet-margin/>
      <!-- 挖矿底部 -->
      <section class="dig-footer">
        <dig-footer 
          :walletAddress="minedByAddress" 
          :totalBlockHeight="chainHeight" 
          :timeDiff="timeDiff" 
          :totalMining="networkMining" />
      </section>
    </section>

    <dig-mask  
      v-show="maskShow"
      :pages="makePages"
      :networkErrorText="networkErrorText"
      :selectedWalletAddress="selectedWalletAddress"
      :availableMoney="availableMoney"
      :freezeMoney="freezeMoney"
      @continue="onContinue" 
      @exit="onAppExit" 
      @close="maskShow = false" />

    <wallet-translucent :text="translucentText" v-show="translucentShow"/>   
  </main>
</template>

<script>
import digFooter from './components/wallet-dig-footer'
import digTitle from './components/wallet-dig-title'
import walletButton from '../../components/wallet-button'
import digList from './components/wallet-dig-list'
import walletTranslucent from '../../components/wallet-translucent'

import lockRecord from './components/lock-record'
import orePool from './components/ore-pool'

import digMask from './components/wallet-dig-mask'


import walletMargin from '../../components/wallet-margin'

import Clipboard from 'clipboard'
import WalletsHandler from '../../lib/WalletsHandler'
import { setInterval, clearInterval } from 'timers'
import { ipcRenderer } from 'electron'
import { constants } from 'fs';
import WalletHandler from '../../lib/WalletsHandler';
const moment = require('moment-timezone')
export default {
  name: 'walletDig',
  components: {
    digFooter,
    walletButton,
    digTitle,
    digList,
    walletMargin,
    lockRecord,
    orePool,
    walletTranslucent,
    digMask
  },
  props: {},
  data () {
    return {
      digButton: "Open mining",
      digNumber: 0,
      digIncome: '0',
      //checkWallet: false,
      checkedWallet: false,
      wallets: [],
      selectedPrivateKey: '',
      selectedWallet: '',
      selectedWalletName: '',
      selectedWalletAddress: '',
      miningIn: false, //挖矿中改变按钮样式
      //noCursor: false, //默认可以选择钱包
      //disabledButton: false,//默认不可点击
      //digStatus: true, //挖矿日子列表默认显示，开始挖矿的时候关闭
      isSynced: false,
      chainHeight: '0',
      minedByAddress: '',
      timeDiff: new Date().getTime().toString(),
      networkMining: '0',
      updateListJob: '',
      getBlockHeightJob: '',
      getSyncStatusJob: '',
      getTimeLockJob: '',
      checkNodeJob: '',
      processTexts: ['Enter the mining page, and wait for mining.'],
      moreList: [],
      tipsShow: false,
      
      maskShow: false,
      maskText: '',
      
      mineStatusText: 'Please stop mining before changing wallet',
      // mineStatusError: false,
      bAlreadyShowed: false,
      
      translucentShow: false,
      navigatorPost: false,// 监听网络请求
      translucentText: 'Only if the range of mine digging mortgage is changed to BIUT mortgage of 10-100000 can the mining function be started.',
      networkErrorText: 'No connection to network. Continue or exit?',
      networkCheckJob: '',

      makePages: 0,//默认是首次开启挖矿 0 - 首次挖矿 1 - 不是首次挖矿  2 - 断网
      digBalance: 0, //挖矿余额
      availableMoney: 0, //biut的可用金额
      freezeMoney: 0, //biut冻结金额
      invitationCode: 12345678,//我的邀请码
      pageIdx: 1, //初始页面展示挖矿收益
      itemList: [
        {
          id: '1',
          lockTime: '2019-07-19 23:28   +8',
          lockMoney: '10',
          unlockTime: '2019-07-19 23:28   +8'
        }
      ],//锁仓记录
      orePoolPage: 1, //矿池页面切换显示  1 - 不满足条件、满足条件显示 2 - 申请中 3 - 申请失败 4 - 申请成功
    }
  },
  computed: {
    recordLists () {
      return this.itemList
    }
  },
  created () {
    let wallets = this.$route.query.wallets
    this.selectedPrivateKey = this.$route.query.selectedPrivateKey
    for (let key in wallets) {
      if (wallets.hasOwnProperty(key)) {
        this.wallets.push(wallets[key])
      }
    }
    this.selectedWallet = wallets[this.selectedPrivateKey]
    this.initMiningStatus()

    this._getLatestBlockInfo((balance) => {
      if (balance < 10) {
        this.stopMining()
        this.digButton = "Open mining"
        this.maskShow = false
        this.checkedWallet = false
        //this.noCursor = false
        this.miningIn = false
      }
    })
    this._getTotalReward()

    this.getBlockHeightJob = setInterval(()=>{
      this._getLatestBlockInfo((balance) => {
      })
      this._getTotalReward()
    }, 3 * 60 * 1000)
  },
  mounted () {
    
  },
  destroyed () {
    window.sessionStorage.setItem('processTexts', JSON.stringify(this.processTexts))
    clearInterval(this.getBlockHeightJob)
    if (this.updateListJob !== '') {
      clearInterval(this.updateListJob)
    }
  },
  methods: {
    //复制邀请码
    copyCode() {
      var clipboard = new Clipboard('.copyButton')
      this.translucentShow = true
      clipboard.on('success', e => {
        clipboard.destroy()
        this.translucentText = 'Copy success'
        setTimeout(() => {
          this.translucentShow = false
        }, 3000)
      })
      clipboard.on('error', e => {
        this.translucentText = 'Copy  fail'
        setTimeout(() => {
          this.translucentShow = false
        }, 3)
        clipboard.destroy()
      })
    },

    // tab切换
    tabPage (idx) {
      this.pageIdx = idx
    },

    initMiningStatus () {
      let miningStatus = window.sessionStorage.getItem('miningStatus')
      let processTexts = window.sessionStorage.getItem('processTexts')
      if (miningStatus) {
        miningStatus = JSON.parse(miningStatus)
        if (miningStatus.miningIn) {
          this.selectedWallet = miningStatus.wallet
          this.selectedWalletName = miningStatus.wallet.walletName
          this.selectedWalletAddress =  miningStatus.wallet.walletAddress
          this.miningIn = miningStatus.miningIn
          this._setButton()
          this.isSynced = miningStatus.isSynced
        } else {
          this.selectedWalletName = this.selectedWallet.walletName
          this.selectedWalletAddress = this.selectedWallet.walletAddress
        }
      } else {
        //this.selectedWallet = this.wallets[0]
        this.selectedWalletName = this.selectedWallet.walletName
        this.selectedWalletAddress = this.selectedWallet.walletAddress
      }
      if (processTexts) {
        this.processTexts = JSON.parse(processTexts)
      }
      if (this.miningIn) {
        //this.noCursor = true
      }
      this._startUpdateHistoryJob()
    },

    //点击其他的地方关闭钱包选择
    // closeWalletList (event) {
    //   let menuList = this.$refs.walletListImg
    //   if (menuList && !menuList.contains(event.target) && this.checkWallet) {
    //     this.checkWallet = false;
    //   }
    // },

    //选择挖矿钱包
    // downCheckWallet () {
    //   if (this.digButton == "Open mining" && this.checkWallet) {
    //     this.checkWallet = !this.checkWallet
    //   } else if (this.digButton == "Open mining") {
    //     this.checkWallet = true
    //   } else {
    //     this.checkWallet = false
    //   }
    // },

    _setButton () {
      if (this.miningIn) {
        this.digButton = "Stop Mining"
        this.checkedWallet = false
      } else {
        this.digButton = "Open mining"
        this.checkedWallet = true
      }
    },

    //选择钱包
    // checkDigWallet (wallet) {
    //   let miningStatus = window.sessionStorage.getItem('miningStatus')
    //   if (miningStatus) {
    //     miningStatus = JSON.parse(miningStatus)
    //     if (miningStatus.miningIn && wallet.walletAddress !== miningStatus.wallet.walletAddress) {
    //       this.mineStatusError = true
    //       return
    //     }
    //   }
    //   window.sessionStorage.setItem("selectedPrivateKey", wallet.privateKey)
    //   this.selectedWallet = wallet
    //   this.selectedWalletName = wallet.walletName
    //   this.selectedWalletAddress = wallet.walletAddress
    //   this.selectedPrivateKey = wallet.privateKey
    //   this._startUpdateHistoryJob()
    //   this.checkWallet = false
    //   this.checkedWallet = true
    //   this.disabledButton = false
    // },

    // onCloseMessage () {
    //   this.mineStatusError = false
    // },

    onContinue () {
      this.maskShow = false
      this.makePages = 0
      this.translucentShow = true
      this.translucentText = 'Reconnecting'
      setTimeout(() => {
        this.translucentShow = false
      }, 3000)
    },

    onAppExit () {
      ipcRenderer.send('close')
    },

    _restartAllJobs () {
      this._startUpdateHistoryJob()
      this._startUpdateLastBlockInfoJob()
      
    },

    _startUpdateHistoryJob () {
      clearInterval(this.updateListJob)
      this._getWalletMiningHistory()
      this._getTimeLockHistory()
      this._getWalletBalance(this.selectedWallet.walletAddress)
      this.updateListJob = setInterval(() => {
        this._getWalletMiningHistory()
        this._getTimeLockHistory()
        this._getWalletBalance(this.selectedWallet.walletAddress)
      }, 3 * 60 * 1000)
    },
    _startUpdateLastBlockInfoJob () {
      clearInterval(this.getBlockHeightJob)
      this._getWalletMiningHistory()
      this._getTotalReward()
      this._getLatestBlockInfo((balance) => {
      })
      this.updateListJob = setInterval(() => {
        this._getWalletMiningHistory()
      }, 3 * 60 * 1000)
      this.getBlockHeightJob = setInterval(() => {
        this._getTotalReward()
        this._getLatestBlockInfo((balance) => {
        })
      }, 3 * 60 * 1000)
    },

    _getWalletBalance (walletAddress) {
      this.$JsonRPCClient.getWalletBalanceOfBothChains(walletAddress, (balanceSEC) => {
        if (this.selectedWallet.contractAddress && this.selectedWallet.contractAddress.length !== 0) {
          this.$JsonRPCClient.getTimeLock(walletAddress, contractAddress, (history) => {
            this.freezeMoney = 0
            for (let i = 0; i < history.length; i++) {
              this.freezeMoney = this.freezeMoney + history.amount
            }
            this.freezeMoney = this._checkValueFormat(this.freezeMoney)
            balanceSEC = this._checkValueFormat(balanceSEC)
            this.availableMoney = Number(balanceSEC - this.freezeMoney)
            this.freezeMoney = Number(this.freezeMoney)
          })
        } else if (this.selectedWallet.contractAddress && this.selectedWallet.contractAddress.length === 0) {
          this.availableMoney = Number(this._checkValueFormat(balanceSEC))
          this.freezeMoney = 0
        }
      }, (balanceSEN) => {
        
      })
    },

    /** intern methode to handle the value format */
    _checkValueFormat (value) {
      let splitValue = value.split("e-")
      if (splitValue.length > 1) {
        return Number(value).toFixed(Number(splitValue[1])).toString()
      } else {
        return value
      }
    },

    _startCheckPeersJob () {
      this.$JsonRPCClient.checkRlpConnections((response) => {
        if (response.result.message === 0) {
          this.maskShow = true
          this.makePages = 2
          this.networkErrorText = 'No connected peer. You can exit the application and check your network'
        }
      })
    },

    _startCheckNetworkJob () {
      if (!WalletsHandler.checkNetworkStatus()) {
        this.maskShow = true
        this.makePages = 2
        this.networkErrorText = 'No network connection. You can exit the application and check your network'
      }
    },

    _getTimeLockHistory () {
      this.$JsonRPCClient.getTimeLock(this.selectedWallet.walletAddress, this.selectedWallet.contractAddress, (history) => {
          this.itemList = history
      })
    },
    
    _getWalletMiningHistory () {
      this.$JsonRPCClient.getWalletTransactionsSEN(this.selectedWallet.walletAddress, (history) => {  
        let miningHistory = history.filter((hist) => {
          return hist.listAddress === 'Mined' && hist.listState === 'Mining' && hist.listInputData.indexOf('Mining reward') > -1
        })
        this.moreList = []
        this.digIncome = "0"
        this.digNumber = 0
        miningHistory.forEach((element, index) => {
          let moneyValue = element.listMoney.length > 10 && element.listMoney.indexOf('.') > 0 ? this.getPointNum (element.listMoney, 8) : element.listMoney
          this.digIncome = (Number(this.digIncome) + Number(moneyValue)).toString()
          this.digNumber = this.digNumber + 1
          this.moreList.push({
            id: index,
            age: element.listTime,
            reward: `${moneyValue} BIU`,
            blocknumber: element.blockNumber,
            blockhash: element.blockHash
          })
        })
      })
    },

    _getLatestBlockInfo (fnCheckMining) {
      this.$JsonRPCClient.getWalletBalance(this.selectedWallet.walletAddress, 'SEC', (balance) => {
        this.digBalance = balance
        fnCheckMining(balance)
      })
      this.$JsonRPCClient.getHeightAndLastBlock((height, block) => {  
        this.chainHeight = height.toString()
      //  this.networkMining = (Number(this.chainHeight)*2).toString()
        if (block.length > 0) {
          this.minedByAddress = block[0].Beneficiary
          this.timeDiff = Math.abs(new Date().getTime() - Number(block[0].TimeStamp)).toString()
          if (this.selectedWallet.walletAddress === this.minedByAddress && !this.bAlreadyShowed) {
            if (this.processTexts.length > 6) { // should not be showed if the page is initial
              let formattedTime = WalletsHandler.formatDate(moment(block[0].TimeStamp).format('YYYY/MM/DD HH:mm:ss'), new Date().getTimezoneOffset())
              this.processTexts.push(`Congratulations on the success of mining at ${formattedTime}`)
              this.processTexts.push('Continue mining...')
              this.bAlreadyShowed = true // to avoid duplicate showed text in job
            } else {
              this.bAlreadyShowed = false
            }
          }
        }
      })
    },

    _getTotalReward () {
      this.$JsonRPCClient.getWalletTotalReward((reward) => {
        if (String(reward).indexOf('.') > -1 && String(reward).length > 0) {
          this.networkMining = reward.toFixed(8)
        } else {
          this.networkMining = reward.toString()
        }
      })
    },

    //开启挖矿弹窗显示
    beginDigMask () {

      /**
       * 判断是否是第一次挖矿
       * 
       * makePages: 0,//默认是首次开启挖矿 0 - 首次挖矿 1 - 不是首次挖矿  2 - 断网
       */
      let balance = this.digBalance
      this.maskShow = true
    },

    //开启挖矿
    // beginDig () {
    //   let balance = this.digBalance
    //   if (this.digButton === "Open mining") {
    //     this.maskText = `Mining will start soon, confirm using the ${this.selectedWalletName} binding?`
    //     this.maskShow = true
    //   } else {
    //     this.digButton = "Stop Mining"
    //     this.maskText = "Confirm to Stop Mining?"
    //     this.maskShow = true  
    //   }
    // },

    // _confirm () {
    //   alert("开启挖矿")
    //   this.maskShow = false
    //   // if (this.digButton === "Open mining") {
    //   //   if (!WalletsHandler.checkNetworkStatus()) {
    //   //     this.processTexts.push('No network connection.')
    //   //     return
    //   //   }
    //   //   this.digButton = "Stop Mining"
    //   //   this.moreList = []
    //   //   this.startMining()
    //   //   this.maskShow = false
    //   //   this.checkedWallet = false
    //   //   this.noCursor = true
    //   // } else {
    //   //   this.digButton = "Open mining"
    //   //   this.stopMining()
    //   //   this.maskShow = false
    //   //   this.checkedWallet = true
    //   //   this.noCursor = false
    //   // }
    // },

    saveMingingStatus () {
      let status = {
        wallet: this.selectedWallet,
        miningIn: this.miningIn,
        isSynced: this.isSynced
      }
      window.sessionStorage.setItem('miningStatus', JSON.stringify(status))
    },

    startMining () {
      setInterval(this._startCheckNetworkJob, 1 * 60 * 1000)
      this.$JsonRPCClient.switchToLocalHost()
      this.processTexts.push(`You are using 0x${this.selectedWallet.walletAddress} for minging.`)
      if (!this.isSynced) {
        this.processTexts.push(`Open mining (connecting nodes...).`)
        this.processTexts.push(`Node connection successful, synchronizing node...`)
        this.$JsonRPCClient.clientSEN.request('sec_startNetworkEvent', [], (err, response) => {
          console.log(err)
          if (response) {       
            // stop all updating job
            clearInterval(this.getBlockHeightJob)
            if (this.updateListJob !== '') {
              clearInterval(this.updateListJob)
            }
            //begin to get sync status
            setTimeout(() => {
              let _statusSameTimes = 0 
              this.getSyncStatusJob = setInterval(() => {
                this.$JsonRPCClient.getSyncStatus((responseSEC) => {
                  let lastSyncStatus = window.sessionStorage.getItem('lastSyncStatus')
                  let currentSyncStatus = responseSEC.result.message.isSyncing
                  if (!currentSyncStatus && lastSyncStatus === currentSyncStatus.toString()) {
                    _statusSameTimes = _statusSameTimes + 1
                    // 两次检查同步状态相同。
                    if (_statusSameTimes === 2) {
                      this.processTexts.push(`Local networking success ${WalletsHandler.formatDate(moment(new Date().getTime()).format('YYYY/MM/DD HH:mm:ss'), new Date().getTimezoneOffset())}`)
                      this.processTexts.push(`Complete syncing blocks`)
                      this.isSynced = true
                      this.$JsonRPCClient.switchToLocalHost()
                      this.saveMingingStatus()
                      this._restartAllJobs()
                      clearInterval(this.getSyncStatusJob)
                      this.checkNodeJob = setInterval(this._startCheckPeersJob, 2* 60 * 1000)
                    }
                  } else {
                    _statusSameTimes = 0
                    window.sessionStorage.setItem('lastSyncStatus', currentSyncStatus)
                  }
                })
              }, 30*1000)
            }, 10*60*1000)
            this._beginMiningWithWallet()
          }
        })
        return
      }
      this._beginMiningWithWallet()
    },

    stopMining () {
      clearInterval(this.getBlockHeightJob)
      clearInterval(this.updateListJob)
      this.$JsonRPCClient.switchToLocalHost()
      this.$JsonRPCClient.clientSEN.request('sec_setPOW', ['0'], (err, response) => {
        if (err) return
        this.miningIn = false
        this.processTexts.push(`0x${this.selectedWallet.walletAddress} stop mining`)
        this.saveMingingStatus()
      })
      
      this.$JsonRPCClient.switchToExternalServer()
      this._startUpdateLastBlockInfoJob()
    },

    _beginMiningWithWallet () {
      this.$JsonRPCClient.clientSEN.request('sec_setAddress', [this.selectedWallet.walletAddress], (err, response) => {
        console.log(err)
        if (err) return
      })
      this.$JsonRPCClient.clientSEN.request('sec_setPOW', ['1'], (err, response) => {
        console.log(err)
        if (err) {
          this.miningIn = false
          return
        }
        this.processTexts.push(`The sync node is completed and is being mined...`)
        this.miningIn = true
        this.saveMingingStatus()
      })
      this.$JsonRPCClient.switchToExternalServer()
      this._startUpdateLastBlockInfoJob()
    }
  },
  watch: {
    
  },
}
</script>

<style scoped>
  .wallet-dig-container {padding: 24px 24px 0;background: #F4F5F5;height: calc(100vh - 25px);display: flex;
    align-content: stretch;display:-webkit-flex;}
  .dig-container {display: flex;flex-direction: column;box-shadow:0px 0px 3px rgba(0,0,0,0.16);
    border-radius:4px 4px 0 0;flex: 1;background: #fff;}
  .dig-header {border-top-left-radius: 4px;
    border-top-right-radius: 4px;padding: 20px 32px 16px;display: flex;align-items: center;
    justify-content: space-between;}
  .dig-header .dig-header-check {width: 308px;position: relative;}
  .dig-header .dig-header-check button {width: 98px;height: 32px;font-size: 13px;font-family: Lato-Regular;}
  .dig-header .dig-header-check h3 {margin: 0;font-size:18px;font-family: Montserrat-SemiBold;font-weight:600;
    color:#252f33;padding-top: 22px;}
  .available-text,.guarantee-text {margin: 0;color:#576066;font-weight: normal;}
  .available-text span,.guarantee-text span {font-family: Lato-Medium;}
  .available-text {color: #29D893;padding-top: 10px;}
  .guarantee-text {padding-top: 6px;}

  .exclamation-list {display: flex;align-items: center;padding: 22px 0 12px;font-family: Lato-Medium;color: #99A1A6;}
  .exclamation-list img {margin-left: 10px;cursor: pointer;}

  .dig-header .dig-header-check h4 span {font-family: Lato-Medium;}
  .dig-header .dig-header-check p {font-family: Montserrat-Light;color: #839299;margin-top: 22px;}
  .dig-header .dig-header-check ul {height: 32px;line-height: 32px;width: 169px;background:#f7f7f7;border-radius:4px;}
  .dig-header .dig-header-check ul li {display: block;text-align: center;color: #252F33;font-size: 13px;font-family: Lato-Bold;}
  
  
  .dig-header .dig-header-check .button-list {display: flex;align-items: center;justify-content: space-between;
    padding-right: 22px;}
  .dig-tips {width: 248px;height: 112px;background: url('../../assets/images/tipsDig.png') center no-repeat;background-size: cover;
    position: absolute;top: 80px;left: 60px;}
  .dig-tips .dig-tips-txt {width: 186px;padding: 21px 31px 0;margin: 0!important;color:#D8E1E6!important;font-size: 12px!important;
    line-height: 1.5;font-family: Lato-Regular!important;}
  
  .dig-header .dig-header-list {flex: 1;height: 132px;background:#f7f7f7;border-radius: 4px;
    overflow: auto;color: #252F33;padding: 16px 14px;}
  .dig-header .dig-header-list ul {list-style: disc;}
  .dig-header .dig-header-list ul li {padding-top: 5px;line-height: 1.5;}
  .dig-header .dig-header-list ul li:first-child {padding-top: 0;}
  
 
  .dig-body {flex: 1;display: flex;flex-direction: column;}
  .dig-body ul {display: flex;align-items: center;padding: 0 32px;}
  .dig-body ul li {cursor: pointer;color: #99A1A6;font-size: 14px;margin-left: 32px;height: 56px;box-sizing: border-box;
    line-height: 56px;}
  .dig-body ul li:first-child {margin-left: 0;}

  .Lock-record,.ore-pool,.dig-earnings {flex: 1;box-sizing: border-box;padding: 20px 32px 0;}

  .dig-earnings-list {height: calc(100% - 20px);}


  .dig-footer {padding: 0 22px 0 32px;color: #839299;height: 45px;
    border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;}

  .miningIn {background:linear-gradient(90deg,#ee1c39 0%,#d91949 100%)!important;}

  .checkColor {color: #29D893!important;border-bottom:2px solid #29d893;}

  .tab-list {border-bottom:1px solid #e6e6e6;box-sizing: border-box;height: 56px;}
  .tab-list,.tab-list section {display: flex;align-items: center;justify-content: space-between;}
  .tab-list section {padding-right: 32px;}
  .tab-list section p {font-size: 14px;color: #99A1A6;}
  .tab-list section p span {color: #252F33;font-family: Lato-Medium;}
  .tab-list section img {cursor: pointer;margin-left: 10px;}

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>