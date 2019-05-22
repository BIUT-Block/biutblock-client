<template>
  <main @click="closeWalletList">
    <section class="dig-container">
      <!-- 挖矿头部 -->
      <section class="dig-header">
        <section class="dig-header-check">
          <h3>Mining</h3>
          <p>Wallet Account</p>
          <section class="button-list">
            <ul>
              <li @click="downCheckWallet" :disabled="checkedWallet" :class="noCursor ? 'noCursor' : ''" ref="walletListImg">
                <span>{{selectedWalletName}}</span>
                <img src="../../assets/images/moreDown.png" alt="">
              </li>
              <li v-show="checkWallet">
                <ul>
                  <li v-for="(wallet, index) in wallets"  @click="checkDigWallet(wallet)">{{ wallet.walletName }}</li>
                </ul>
              </li>
            </ul>
            <wallet-button type="button" 
                :text="digButton"
                :disabled="disabledButton"
                :class="[miningIn ? 'miningIn' : '', 
                  checkedWallet ? 'passCorrect' : '', 
                  disabledButton ? 'noCursor' : '']"
                @click.native="beginDigMask"/>
          </section>
          <h4>Balance：<span>{{ digBalance.toLocaleString('en-US') }} BIUT</span></h4>
          <section class="dig-tips">
            <label>Description:</label> After the node is mined, the BIUT Token is automatically acquired. 
            The higher the balance, the greater probability to get BIU.
          </section>
        </section>
        <section class="dig-header-list">
          <ul>
            <li v-for="text in processTexts">·&nbsp;&nbsp;&nbsp;&nbsp;{{text}}</li>
          </ul>
        </section>
      </section>
      <wallet-margin/>
      <!-- 挖矿内容 -->
      <section class="dig-body">
         <!-- 挖矿内容-头部 -->
        <dig-title  :number="digNumber"
                    :digTitleShow="true"
                    :selectedWallet="selectedWallet" 
                    :selectedPrivateKey="selectedPrivateKey" 
                    :wallets="this.$route.query.wallets" :income="digIncome"/>
        <!-- 挖矿内容-列表 -->
        <section>
          <dig-list :digLists="moreList"/>
        </section>
      </section>
      <wallet-margin/>
      <!-- 挖矿底部 -->
      <section class="dig-footer">
        <dig-footer :walletAddress="minedByAddress" :totalBlockHeight="chainHeight" :timeDiff="timeDiff" :totalMining="networkMining"/>
      </section>
    </section>
    <!-- 遮罩层 -->
    <section class="mask" v-show="maskShow">
      <section class="mask-container dig-mask">
        <img
          src="../../assets/images/closeMask.png"
          alt=""
          class="closeImg"
          title="close"
          @click="maskShow = false"
        />
        <section class="dig-mask-body">
          <p>{{maskText}}</p>
          <button type="button"  @click="_confirm()">Confirm</button>
        </section>
      </section>
    </section>

    <section class="mask" v-show="mineStatusError">
      <section class="mask-container dig-mask">
        <img
          src="../../assets/images/closeMask.png"
          alt=""
          class="closeImg"
          title="close"
          @click="mineStatusError = false"
        />
        <section class="dig-mask-body">
          <p>{{mineStatusText}}</p>
          <button type="button"  @click="onCloseMessage()">Confirm</button>
        </section>
      </section>
    </section>

            
  </main>
</template>

<script>
import digFooter from './components/wallet-dig-footer'
import digTitle from './components/wallet-dig-title'
import walletButton from '../../components/wallet-button'
import digList from './components/wallet-dig-list'
import walletMargin from '../../components/wallet-margin'
import WalletsHandler from '../../lib/WalletsHandler'
import { setInterval, clearTimeout, clearInterval, setTimeout } from 'timers'
const moment = require('moment-timezone')
export default {
  name: 'walletDig',
  components: {
    digFooter,
    walletButton,
    digTitle,
    digList,
    walletMargin
  },
  props: {},
  data () {
    return {
      digButton: "Start Mining",
      digNumber: 0,
      digIncome: '0',
      checkWallet: false,
      checkedWallet: true,
      wallets: [],
      selectedPrivateKey: '',
      selectedWallet: '',
      selectedWalletName: '',
      miningIn: false, //挖矿中改变按钮样式
      noCursor: false, //默认可以选择钱包
      disabledButton: false,//默认不可点击
      digStatus: true, //挖矿日子列表默认显示，开始挖矿的时候关闭
      isSynced: false,
      chainHeight: '0',
      minedByAddress: '',
      timeDiff: new Date().getTime().toString(),
      networkMining: '0',
      updateListJob: '',
      getBlockHeightJob: '',
      processTexts: ['Enter the mining page, and wait for mining.'],
      moreList: [],
      
      maskShow: false,
      maskText: '',
      mineStatusText: 'Please stop mining before changing wallet',
      mineStatusError: false,
      bAlreadyShowed: false,
      digBalance: 0 //挖矿余额
    }
  },
  computed: {

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

    this._getLatestBlockInfo()
    this._getTotalReward()

    this.getBlockHeightJob = setInterval(()=>{
      this._getLatestBlockInfo()
      this._getTotalReward()
    }, 2500)
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
    initMiningStatus () {
      let miningStatus = window.sessionStorage.getItem('miningStatus')
      let processTexts = window.sessionStorage.getItem('processTexts')
      if (miningStatus) {
        miningStatus = JSON.parse(miningStatus)
        if (miningStatus.miningIn) {
          this.selectedWallet = miningStatus.wallet
          this.selectedWalletName = miningStatus.wallet.walletName
          this.miningIn = miningStatus.miningIn
          this._setButton()
          this.isSynced = miningStatus.isSynced
        } else {
          this.selectedWalletName = this.selectedWallet.walletName
        }
      } else {
        //this.selectedWallet = this.wallets[0]
        this.selectedWalletName = this.selectedWallet.walletName
      }
      if (processTexts) {
        this.processTexts = JSON.parse(processTexts)
      }
      if (this.miningIn) {
        this.noCursor = true
      }
      this._startUpdateHistoryJob()
    },

    //点击其他的地方关闭钱包选择
    closeWalletList (event) {
      let menuList = this.$refs.walletListImg
      if (menuList && !menuList.contains(event.target) && this.checkWallet) {
        this.checkWallet = false;
      }
    },

    //选择挖矿钱包
    downCheckWallet () {
      if (this.digButton == "Start Mining" && this.checkWallet) {
        this.checkWallet = !this.checkWallet
      } else if (this.digButton == "Start Mining") {
        this.checkWallet = true
      } else {
        this.checkWallet = false
      }
    },

    _setButton () {
      if (this.miningIn) {
        this.digButton = "Stop Mining"
        this.checkedWallet = false
      } else {
        this.digButton = "Start Mining"
        this.checkedWallet = true
      }
    },

    //选择钱包
    checkDigWallet (wallet) {
      let miningStatus = window.sessionStorage.getItem('miningStatus')
      if (miningStatus) {
        miningStatus = JSON.parse(miningStatus)
        if (miningStatus.miningIn && wallet.walletAddress !== miningStatus.wallet.walletAddress) {
          this.mineStatusError = true
          return
        }
      }
      window.sessionStorage.setItem("selectedPrivateKey", wallet.privateKey)
      this.selectedWallet = wallet
      this.selectedWalletName = wallet.walletName
      this.selectedPrivateKey = wallet.privateKey
      this._startUpdateHistoryJob()
      this.checkWallet = false
      this.checkedWallet = true
      this.disabledButton = false
    },

    onCloseMessage () {
      this.mineStatusError = false
    },

    _startUpdateHistoryJob () {
      clearInterval(this.updateListJob)
      this._getWalletMiningHistory()
      this.updateListJob = setInterval(this._getWalletMiningHistory, 5000)
    },
    
    _getWalletMiningHistory () {
      this.$JsonRPCClient.getWalletTransactionsSEN(this.selectedWallet.walletAddress, (history) => {  
        let miningHistory = history.filter((hist) => {
          return hist.listAddress === 'Mined' && hist.listState === 'Mining'
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

    _getLatestBlockInfo () {
      this.$JsonRPCClient.getWalletBalance(this.selectedWallet.walletAddress, (balance) => {
        this.digBalance = balance
      })
      this.$JsonRPCClient.getHeightAndLastBlock((height, block) => {  
        this.chainHeight = height.toString()
      //  this.networkMining = (Number(this.chainHeight)*2).toString()
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
      this.maskShow = true
      if (this.digButton == "Start Mining") {
        this.maskText =`Mining will start soon, confirm using the ${this.selectedWalletName} binding?`
      } else {
        this.maskText = "Confirm to Stop Mining?"
      }
    },

    //开启挖矿
    beginDig () {
      if (this.digButton === "Start Mining") {    
        this.maskText = `Mining will start soon, confirm using the ${this.selectedWalletName} binding?`
        this.maskShow = true    
      } else {        
        this.digButton = "Stop Mining"
        this.maskText = "Confirm to Stop Mining?"
        this.maskShow = true
      }
    },

    _confirm () {
      if (this.digButton === "Start Mining") {
        if (!WalletsHandler.checkNetworkStatus()) {
          this.processTexts.push('No network connection.')
          return
        }
        this.digButton = "Stop Mining"
        this.moreList = []
        this.startMining()
        this.maskShow = false
        this.checkedWallet = false
        this.noCursor = true
      } else {
        this.digButton = "Start Mining"
        this.stopMining()
        this.maskShow = false
        this.checkedWallet = true
        this.noCursor = false
      }
    },

    saveMingingStatus () {
      let status = {
        wallet: this.selectedWallet,
        miningIn: this.miningIn,
        isSynced: this.isSynced
      }
      window.sessionStorage.setItem('miningStatus', JSON.stringify(status))
    },

    startMining () {
      clearInterval(this.getBlockHeightJob)
      this.$JsonRPCClient.switchToLocalHost()
      this.processTexts.push(`You are using 0x${this.selectedWallet.walletAddress} for minging.`)
      if (!this.isSynced) {
        this.processTexts.push(`Start mining (connecting nodes...).`)
        this.processTexts.push(`Node connection successful, synchronizing node...`)
        this.$JsonRPCClient.clientSEN.request('sec_startNetworkEvent', [], (err, response) => {
          console.log(err)
          if (response) {
            this.processTexts.push(`Local networking success ${WalletsHandler.formatDate(moment(new Date().getTime()).format('YYYY/MM/DD HH:mm:ss'), new Date().getTimezoneOffset())}`)
            this.processTexts.push(`Complete syncing blocks`)
            this.isSynced = true
            setTimeout(()=>{
              this._beginMiningWithWallet()
            }, 6000) 
          }
        })
        return
      }
      this._beginMiningWithWallet()
    },

    stopMining () {
      clearInterval(this.getBlockHeightJob)
      this.$JsonRPCClient.switchToLocalHost()
      this.$JsonRPCClient.clientSEN.request('sec_setPOW', ['0'], (err, response) => {
        if (err) return
        this.miningIn = false
        this.processTexts.push(`0x${this.selectedWallet.walletAddress} stop mining`)
        this.saveMingingStatus()
      })
      clearInterval(this.updateListJob)
      this.$JsonRPCClient.switchToExternalServer()
      this.getBlockHeightJob = setInterval(()=>{
        this._getLatestBlockInfo()
        this._getTotalReward()
      }, 2500)
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
      this.getBlockHeightJob = setInterval(()=>{
        this._getLatestBlockInfo()
        this._getTotalReward()
      }, 2500)
      //this._getWalletMiningHistory()
      //this.updateListJob = setInterval(this._getWalletMiningHistory, 5000)
    }
  },
}
</script>

<style scoped>
  main {padding: 24px;background: #F4F5F5;height: calc(100vh - 48px);display: flex;
    align-content: stretch;display:-webkit-flex;}
  .dig-container {display: flex;flex-direction: column;box-shadow:0px 0px 3px rgba(0,0,0,0.16);
  border-radius:4px;flex: 1;background: #fff;}
  .dig-header {border-top-left-radius: 4px;
    border-top-right-radius: 4px;padding: 0 22px 8px 32px;display: flex;align-items: center;
    justify-content: space-between;}
  .dig-header .dig-header-check {width: 308px;}
  .dig-header .dig-header-check button {width: 98px;height: 32px;}
  .dig-header .dig-header-check h3 {margin: 0;font-size:18px;font-family: Montserrat-SemiBold;font-weight:600;
    color:rgba(37,47,51,1);padding-top: 22px;}
  .dig-header .dig-header-check h4 {margin: 0;padding: 6px 0 13px;color:#576066;font-size: 12px;font-weight: normal;}
  .dig-header .dig-header-check h4 span {font-family: Lato-Medium;}
  .dig-header .dig-header-check p {font-family: Montserrat-Light;color: #839299;margin-top: 22px;}
  .dig-header .dig-header-check ul {height: 33px;line-height: 33px;width: 162px;color:#252F33;
    background:rgba(247,247,247,1);font-size: 14px;border-radius:4px;padding: 0 10px;}
  .dig-header .dig-header-check ul img {width: 16px;height: 16px;}
  .dig-header .dig-header-check ul li:first-child {display: flex;justify-content: space-between;
    align-items: center;}
  .dig-header .dig-header-check ul li:first-child:hover {cursor: pointer;}
  .dig-header .dig-header-check ul li {position: relative;}
  .dig-header .dig-header-check ul li ul {height: 160px;position: absolute;top: 0;left: -10px;z-index: 8;width: 182px;
    overflow: auto;background: #fff;box-shadow:0px 0px 6px rgba(0,0,0,0.16);border-radius: 4px;padding: 0;}


  .dig-header .dig-header-check ul li ul li {height: 40px;padding-left:16px;}
  .dig-header .dig-header-check ul li ul li:first-child {border-top-left-radius: 4px;border-top-right-radius: 4px;}
  .dig-header .dig-header-check ul li ul li:last-child {border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;}
  .dig-header .dig-header-check ul li ul li:hover {cursor: pointer;background:rgba(237,242,241,1);}
  
  .dig-header .dig-header-check .button-list {display: flex;align-items: center;justify-content: space-between;
    padding-right: 18px;margin-top: 8px;}
  .dig-header .dig-header-check .dig-tips {width: 290px;word-wrap:break-word;line-height: 1.5;color:#576066;}
  .dig-header .dig-header-check .dig-tips label {font-family: Lato-Bold;}
  
  .dig-header .dig-header-list {flex: 1;height: 132px;background:rgba(247,247,247,1);border-radius: 4px;
    overflow: auto;color: #252F33;padding: 16px 14px;}
  .dig-header .dig-header-list ul {list-style: disc;}
  .dig-header .dig-header-list ul li {padding-top: 5px;line-height: 1.5;}
  .dig-header .dig-header-list ul li:first-child {padding-top: 0;}
  

  .dig-header .dig-header-check ul li ul::-webkit-scrollbar { width: 2px; height: 2px;}
  .dig-header .dig-header-check ul li ul::-webkit-scrollbar-thumb { -webkit-box-shadow: inset 0 0 1px #00D6B2;background: #00D6B2;border-radius: 1px;}
  .dig-header .dig-header-check ul li ul::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 1px #EDF5F4;border-radius: 0; background: #EDF5F4;}
  
  .dig-body {padding: 22px 22px 0 32px;flex: 1;}
  
  .dig-footer {padding: 0 22px 0 32px;color: #839299;height: 45px;
    border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;}

  .miningIn {background:linear-gradient(90deg,rgba(238,28,57,1) 0%,rgba(217,25,73,1) 100%)!important;}
  .dig-mask {position: relative;font-size: 14px;font-weight: 400;color: #576066;}
  .closeImg {width: 16px;height: 16px;position: absolute;top: 12px;right: 20px;}
  .dig-mask-body {padding: 44px 20px 16px 24px;text-align: right;}
  .dig-mask-body p {text-align: left;margin-bottom: 58px;}
  .dig-mask-body button {color: #fff;width:97px;background:linear-gradient(90deg,rgba(41,216,147,1) 0%,rgba(12,197,183,1) 100%);
    height:32px;border: 0;border-radius: 4px;}
  
  .noCursor {cursor: no-drop;}
</style>