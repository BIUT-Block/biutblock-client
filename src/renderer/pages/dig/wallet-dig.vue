<template>
  <main class="wallet-dig-container">
    <section class="dig-enter" v-show="digPage">
      <h2>{{ $t('homeDig.hdEnteryTit') }}</h2>

      <section class="mining-wallet">
        <p class="mining-tit">{{ $t('homeDig.hdEnteryTxt1') }}</p>
        <p class="mining-address">0x{{ selectedWalletAddress }}</p>
        <p class="flex-between">
          <span>{{ $t('homeWallet.hwBiutTxt1') }}：</span>
          <span>{{ availableMoney | currency("") }}</span>
        </p>
        <p class="flex-between">
          <span>{{ $t('homeWallet.hwBiutTxt2') }}：</span>
          <span>{{ freezeMoney | currency("") }}</span>
        </p>
        <p class="mining-txt">{{ $t('homeDig.hdEnteryTxt2') }} <span style="color: #EE1C39;">*</span></p>
        <section class="flex-between mining-list">
          <input type="text" placeholder="10,000.00" maxlength="19"  v-model="mortgageAmount" onpaste="return false"/>
          <span>BIUT</span>
        </section>
        
        <p class="mining-tips">{{ $t('homeDig.hdEnteryTxt3') }}</p>
        <button type="button" 
          :disabled="!mortgageActive"
          :class="mortgageActive ? 'passCorrect' : ''"
          @click="onMortgage">
            {{ $t('publicBtn.mortgageBtn1') }}
          </button>
      </section>
   
    </section>  

    <section class="dig-container" v-show="!digPage">
      <!-- 挖矿头部 -->
      <section class="dig-header">
        <section class="dig-header-check">
          <h3>{{ $t('homeDig.hdEnteryTit') }}</h3>
          <section class="minging-list">
            <span>
              {{ miningWallet }}
            </span>
            0x{{ selectedWalletAddress.replace(/(.{6}).+(.{8})/,'$1...$2') }}
          </section>

          <h4 class="available-text">{{ $t('homeWallet.hwBiutTxt1') }}：<span>{{ availableMoney.toLocaleString('en-US') }} BIUT</span></h4>
          <h4 class="guarantee-text">{{ $t('homeWallet.hwBiutTxt2') }}：<span>{{ freezeMoney.toLocaleString('en-US') }} BIUT</span></h4>
          <section class="dig-button-list">
            <button type="button" :class="[openPool ? 'sotpPool' : '', openActive ? 'passCorrect' : '']" :disabled="!openActive" @click="beginDigMask(1)">{{ $t(digButton) }}</button>
            <button type="button" :class="appendAcitve ? 'appendAcitve' : ''" :disabled="!appendAcitve" @click="beginDigMask(2)">{{ $t('publicBtn.mortgageBtn2') }}</button>
          </section>

        </section>

        <section class="dig-header-list">
          <ul>
            <li v-for="text in processTexts">·&nbsp;&nbsp;&nbsp;&nbsp;{{ $t(text) }}</li>
          </ul>
        </section>
      </section>

      <wallet-margin />
      <!-- 挖矿内容 -->
      <section class="dig-body">
        <!-- tab列表 -->
        <section class="tab-list">
          <ul>
            <li @click="tabPage(1)" :class="pageIdx == 1 ? 'checkColor' : ''">{{ $t('homeDig.hdNavProfit') }}</li>
            <li @click="tabPage(2)" :class="pageIdx == 2 ? 'checkColor' : ''">{{ $t('homeDig.hdNavRecord') }}</li>
            <li @click="tabPage(3)" :class="pageIdx == 3 ? 'checkColor' : ''">{{ $t('homeDig.hdNavPool') }}</li>
          </ul>
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
            :freezeMoney="freezeMoney.toString()"
            :walletAddress="selectedWallet.walletAddress"
            :privateKey="selectedWallet.privateKey"
            :poolAssets="poolAssets"
            :poolNode="poolNode"
            :poolMyEarnings="poolMyEarnings"
            :poolAllEarnings="poolAllEarnings"
            :poolApplyMoney="poolApplyMoney"
            :poolApplyTime="poolApplyTime"
            :poolName="poolName"
            @addContract="onAddContract" />
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
      :freezeMoney="freezeMoney.toString()"
      :poolName="poolName"
      @continue="onContinue" 
      @exit="onAppExit" 
      @close="maskShow = false"
      @beginMining="onBeginMining"
      @addMoreMortgage="onAddMoreMortgage" />

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
const dataCenterHandler = require('../../lib/DataCenterHandler')
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
      digPage: false,// 第一次进入的时候  后面进入成 false
      loading: true, //进入的时候弹窗加载
      mortgageAmount: '',//输入开启挖矿冻结金额
      digButton: "publicBtn.openBtn",
      digNumber: 0,
      digIncome: '0',
      wallets: [],
      selectedPrivateKey: '',
      selectedWallet: '',
      selectedWalletName: '',
      selectedWalletAddress: '',
      contractAddress: '',
      miningIn: false, //挖矿中改变按钮样式
      //noCursor: false, //默认可以选择钱包
      //disabledButton: false,//默认不可点击
      //digStatus: true, //挖矿日子列表默认显示，开始挖矿的时候关闭

      openPool: false,//挖矿按钮的状态改变

      miningWallet: 'Mining Wallet', //挖矿钱包名称
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
      processTexts: ['homeDig.hdHeadListTxt'],
      moreList: [],
      tipsShow: false,
      
      maskShow: false,
      maskText: '',
      
      //mineStatusText: 'Please stop mining before changing wallet',
      // mineStatusError: false,
      bAlreadyShowed: false,
      
      translucentShow: false,
      navigatorPost: false,// 监听网络请求
      //translucentText: 'Only if the range of mine digging mortgage is changed to BIUT mortgage of 10-100000 can the mining function be started.',
      translucentText: '',
      networkErrorText: 'homeDigMask.hdMaskNetworkTit',
      networkCheckJob: '',

      makePages: 0,//默认是首次开启挖矿 0 - 开启挖矿 2 - 断网  3 - 追加更多
      digBalance: 0, //挖矿余额
      availableMoney: "0", //biut的可用金额
      freezeMoney: "0", //biut冻结金额
      hasContract: false,
      invitationCode: 12345678,//我的邀请码
      pageIdx: 1, //初始页面展示挖矿收益
      poolNode: 0,
      poolAssets: 0,
      poolAllEarnings: 0,
      poolMyEarnings: 0,
      poolApplyTime: '',
      poolApplyMoney: 0,
      poolName: '',
      itemList: [],//锁仓记录
      orePoolPage: 1, //矿池页面切换显示  1 - 不满足条件、满足条件显示 2 - 申请中 3 - 申请失败 4 - 申请成功
      codeShow: true //邀请码是否显示 
    }
  },
  computed: {
    recordLists () {
      return this.itemList
    },

    //是否可点击追加按钮
    appendAcitve () {
      return this.availableMoney > 0 ? true : false
    },

    //是否可点击开启挖矿按钮
    openActive () {
      return this.freezeMoney > 0 && navigator.onLine  ? true : false
    },

    //是否可点击开启挖矿
    mortgageActive () {
     if (this.mortgageAmount.length > 10 && this.mortgageAmount.indexOf(".") < 0) {
        //只能输入10位整数
        this.mortgageAmount = String(this.mortgageAmount).substring(0,10)
      } else if (this.mortgageAmount.indexOf(".") == 0) {
        this.mortgageAmount = String(this.mortgageAmount).substring(0,9)
      } else {
        this.mortgageAmount =  this.mortgageAmount.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
        this.mortgageAmount =  this.mortgageAmount.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        this.mortgageAmount =  this.mortgageAmount.replace(".","$#$").replace(/\./g,"").replace("$#$","."); 
        this.mortgageAmount =  this.mortgageAmount.replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d\d\d).*$/,'$1$2.$3');//只能输入两个小数  
      }
      return this.mortgageAmount >= 10000
        && this.availableMoney >= 10000
        && Number(this.mortgageAmount) <= Number(this.availableMoney) ? true : false
    }
  },
  created () {
    let wallets = this.$route.query.wallets
    this.selectedPrivateKey = this.$route.query.firstKey
    this.selectedWalletAddress = wallets[this.selectedPrivateKey].walletAddress
    for (let key in wallets) {
      if (wallets.hasOwnProperty(key)) {
        this.wallets.push(wallets[key])
      }
    }
    this.selectedWallet = wallets[this.selectedPrivateKey]
    if (this.selectedWallet.role === 'Miner') {
      this.contractAddress =  wallets[this.selectedPrivateKey].mortgagePoolAddress
      this.poolName = this.selectedWallet.walletName
      if (this.selectedWallet.mortgageValue === '0' ) {
        this.digPage = true
      } else {
        this.digPage = false
        this.orePoolPage = 1
      }
    } else {
      this.contractAddress =  wallets[this.selectedPrivateKey].ownPoolAddress
      this.orePoolPage = 2
      this._getTimeLockHistory()
    }

    this.initMiningStatus()

    this._getLatestBlockInfo((balance) => {
      if (balance < 10) {
        this.stopMining()
        this.digButton = "publicBtn.openBtn"
        this.maskShow = false
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



    _setButton () {
      if (this.miningIn) {
        this.digButton = "publicBtn.stopBtn"
        this.openPool = true
      } else {
        this.digButton = "publicBtn.openBtn"
        this.openPool = false
      }
    },

    onContinue () {
      this.maskShow = false
      this.makePages = 0
      this.translucentShow = true
      this.translucentText = 'homeDigMask.hdMaskNetworkReconnecting'
      setTimeout(() => {
        this.translucentShow = false
      }, 3000)
    },

    onAppExit () {
      ipcRenderer.send('close')
    },

    onAddContract (privateKey, contract) {
      let wallet = this.selectedWallet
      wallet.ownPoolAddress = contract
      wallet.role = 'Owner'
      wallet.mortgageValue = (Number(wallet.mortgageValue) + 5000000).toString()
      this.orePoolPage = 2
      dataCenterHandler.updatePoolAddress({
        address: this.selectedWalletAddress,
        ownPoolAddress: contract,
        mortgageValue: wallet.mortgageValue,
        role: 'Owner'
      }, (doc) => {
        console.log('update pool address success')
      })
      WalletsHandler.updateWalletFile(wallet, () => {
        console.log('update wallet file')
      })
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

    _getWalletBalance(walletAddress) {
      let poolAddress = []
      this.freezeMoney = 0
      this.$JsonRPCClient.getWalletBalanceOfBothChains(walletAddress, (balanceSEC) => {
//        this.walletBalance = balanceSEC.toString()
        let freezeMoney = 0
        let walletBalance = 0
        let availableMoney = balanceSEC
        if (this.selectedWallet.mortgagePoolAddress.length > 0 ) {   
          this.selectedWallet.mortgagePoolAddress.forEach((pool) => {
            poolAddress.push(this.$JsonRPCClient.getContractInfoSync(pool))
          })
        }
        if (this.selectedWallet.ownPoolAddress.length > 0) {
          for (let ownpool of this.selectedWallet.ownPoolAddress) {
            poolAddress.push(this.$JsonRPCClient.getContractInfoSync(ownpool))
          }
        }

        Promise.all(poolAddress).then((contractInfos) => {
          for (let contract of contractInfos) {
            let timeLock = contract.timeLock || {}
            if (this.selectedWallet.walletAddress in timeLock && this.selectedWallet.walletAddress in timeLock[this.selectedWallet.walletAddress]) {
              let benifitAddress = timeLock[this.selectedWallet.walletAddress][this.selectedWallet.walletAddress]
              for (let i = 0; i < benifitAddress.length; i++) {
                freezeMoney = freezeMoney + Number(benifitAddress[i].lockAmount)
              }
            } 
          }
          walletBalance = freezeMoney + availableMoney
          this.freezeMoney = this._checkValueFormat(freezeMoney.toString()).toString()
          this.walletBalance = this._checkValueFormat(walletBalance.toString()).toString()
          this.availableMoney = this._checkValueFormat(availableMoney.toString()).toString()
        })
      }, (balanceSEN) => {
        this.walletBalanceSEN = this._checkValueFormat(balanceSEN.toString()).toString()
      })
    },

    /** intern methode to handle the value format */
    _checkValueFormat (value) {
      let splitValue = value.split("e-")
      if (splitValue.length > 1) {
        return Number(value).toFixed(Number(splitValue[1])).toString()
      } else {
        return Number(value)
      }
    },

    _startCheckPeersJob () {
      this.$JsonRPCClient.checkRlpConnections((response) => {
        if (response.result.message === 0) {
          this.maskShow = true
          this.makePages = 2
          this.networkErrorText = 'homeDigMask.hdMaskNetworkTxt1'
        }
      })
    },

    _startCheckNetworkJob () {
      if (!WalletsHandler.checkNetworkStatus()) {
        this.maskShow = true
        this.makePages = 2
        this.networkErrorText = 'homeDigMask.hdMaskNetworkTxt2'
      }
    },

    _getTimeLockHistory () {
      let benifs = []
      let poolAddress = []
      if (this.selectedWallet.mortgagePoolAddress.length > 0 ) {   
        this.selectedWallet.mortgagePoolAddress.forEach((pool) => {
          poolAddress.push(this.$JsonRPCClient.getContractInfoSync(pool))
        })
      }
      if (this.selectedWallet.ownPoolAddress.length > 0) {
        this.selectedWallet.ownPoolAddress.forEach((pool) => {
          poolAddress.push(this.$JsonRPCClient.getContractInfoSync(pool))
        })
      }
      Promise.all(poolAddress).then((contractInfos) => {
        for (let contract of contractInfos) {
          let timeLock = contract.timeLock || {}
          if (this.selectedWallet.walletAddress in timeLock && this.selectedWallet.walletAddress in timeLock[this.selectedWallet.walletAddress]) {
            benifs.push(timeLock[this.selectedWallet.walletAddress][this.selectedWallet.walletAddress])
          } 
        }
        if (benifs.length > 0) {
          this.digPage = false
        } else {
          this.digPage = true
        }
      })
      this.$JsonRPCClient.getContractInfoSync(this.selectedWallet.ownPoolAddress[0]).then((contractInfo) => {
        if (contractInfo.timeLock) {
          this.poolApplyMoney = contractInfo.totalSupply
          this.poolApplyTime = WalletsHandler.formatDate(moment(contractInfo.time).format('YYYY/MM/DD HH:mm:ss'), new Date().getTimezoneOffset())
          let tokenName = contractInfo.tokenName
          this.poolName = tokenName.split('-')[2]
          if (contractInfo.status === 'success') {
            this.orePoolPage = 4
            this._calcMiningPool(benifs)
            this._insertLockHistory(benifs)
          } else {
            this.orePoolPage = 2
          }
        }
      })
    },

    _insertLockHistory (benifs) {
      this.itemList = []
 //     let benifs = timeLock[this.selectedWallet.walletAddress][this.selectedWallet.walletAddress]
      for (let benifit of benifs) {
        this.itemList.push({
          id: '1',
          lockTime: WalletsHandler.formatDate(moment(benifit.lockTime).format('YYYY/MM/DD HH:mm:ss'), new Date().getTimezoneOffset()),
          lockMoney: benifit.lockAmount,
          unlockTime: WalletsHandler.formatDate(moment(benifit.unlockTime).format('YYYY/MM/DD HH:mm:ss'), new Date().getTimezoneOffset())
        })   
      }
    },

    _calcMiningPool (benifs) {
      this.poolNode = benifs.length
      this.poolAssets = 0
 //     let benifs = timeLock[this.selectedWallet.walletAddress][this.selectedWallet.walletAddress]
      for (let benifit of benifs) {
        this.poolAssets = this.poolAssets + Number(benifit.lockAmount)
      }
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
          this.poolAllEarnings = this.digIncome
          this.poolMyEarnings = this.digIncome
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

    onMortgage () {
      let privateKey = this.selectedPrivateKey
      this._addMoreMortgage(this.mortgageAmount)
    },

    _addMoreMortgage (mortgage) {
      let transferTimeLock = {
        timestamp: new Date().getTime(),
        walletAddress: this.selectedWalletAddress,
        sendToAddress: this.selectedWallet.mortgagePoolAddress[0],
        amount: mortgage,
        gasLimit: '0',
        gasPrice: '0',
        txFee: '0',
        chainName: 'SEC'
      }
      this.$JsonRPCClient.sendContractTransaction(this.selectedWalletAddress, this.selectedPrivateKey, 
        365 * 24 * 3600 * 1000, transferTimeLock,
        (response) => {
          this._getTimeLockHistory()
          this._getWalletBalance(this.selectedWalletAddress)
          this.selectedWallet.mortgageValue = (Number(this.selectedWallet.mortgageValue) + Number(this.mortgageAmount)).toString()
          dataCenterHandler.updateWallet({
            address: this.selectedWalletAddress,
            mortgageValue: this.selectedWallet.mortgageValue
          }, (body) => {
            console.log('update wallet mortgage value')
          })
          WalletsHandler.updateWalletFile(this.selectedWallet, () => {
            console.log('update wallet file')
          })
          this.digPage = false
      })
    },

    //开启挖矿弹窗显示
    beginDigMask (idx) {
      /**
       * 
       * idx  1 开启挖矿  2 追加更多 
       * 
       * makePages 0 - 开启挖矿  2 - 断网 3 - 追加更多
       */
      if (idx === 1) {
        //开启挖矿改变状态
        console.log(this.digButton)
        if (this.digButton === 'publicBtn.stopBtn') {
          this.digButton = 'publicBtn.openBtn'
          this.openPool = false
          this.stopMining()
        } else {
          this.maskShow = true
          if (window.onoffline) {
            this.makePages = 2
          } else {
            this.makePages = 0
          }
        }
      } else if (idx === 2) {
        this.makePages = 3
        this.maskShow = true
      } else {
        his.makePages = 2
        this.maskShow = true
      }
    },

    onBeginMining () {
      this.startMining()
      this.openPool = true
      this.$nextTick(()=> {
        this.digButton = 'publicBtn.stopBtn'
      })
    },

    onAddMoreMortgage (mortgage) {
      this._addMoreMortgage(mortgage)
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
    border-top-right-radius: 4px;padding: 20px 32px 16px;display: flex;justify-content: space-between;}
  .dig-header .dig-header-check {width: 308px;position: relative;}
  .dig-header .dig-header-check h3 {margin: 0;font-size:18px;font-family: Montserrat-SemiBold;font-weight:600;
    color:#252f33;padding-bottom: 26px;}
  .minging-list {padding-bottom: 10px;color: #252F33;font-size: 14px;border-bottom: 1px solid #E6E6E6;box-sizing: border-box;
    width: 246px;font-family: Lato-Bold;}
  .minging-list span {color: #99A1A6;margin-right: 12px;font-family: Source-Regular;}
  .available-text,.guarantee-text {margin: 0;color:#576066;font-weight: normal;}
  .available-text span,.guarantee-text span {font-family: Lato-Medium;}
  .available-text {color: #29D893;padding-top: 10px;}
  .guarantee-text {padding-top: 6px;}

  .dig-enter {padding: 106px 112px 0 0;background: url('../../assets/images/digBg.png') center no-repeat, #fff;background-size: cover;
    display: flex;justify-content: space-between;box-shadow: 0px 0px 3px rgba(0,0,0,0.16);
    border-radius: 4px 4px 0 0;flex: 1;}

  .dig-enter h2 {margin: 140px 0 0 150px;width: 90px;height: 20px;padding-bottom: 10px;font-family: Source-Bold;
    border-bottom: 7px solid #29D893;font-size: 20px;color: #252F33;}
  
  .mining-wallet {width: 290px;color: #6D7880;font-size: 12px;}
  .mining-wallet .mining-tit {padding-bottom: 8px;font-family: Lato-Regular;}
  .en .mining-wallet .mining-tit {font-family: Source-Regular;}
  .mining-wallet .mining-txt {padding-top: 36px;color: #6D7880;font-size: 14px;font-family: Lato-Medium;}
  .en .mining-wallet .mining-txt {font-family: Source-Medium;}

  .mining-wallet .mining-address {color: #252F33;font-size: 14px;line-height: 1.6;word-wrap: break-word;}
  .mining-wallet .mining-tips {line-height: 1.5;word-wrap: break-word;padding-top: 16px;color: #99A1A6;}
  .mining-wallet .flex-between {padding-bottom: 10px;border-bottom: 1px solid #E6E6E6;padding-top: 12px;font-family: Lato-Regular;}
  .mining-wallet .mining-list {padding: 0;height: 34px;}

  .dig-enter input {border: 0;flex: 1;}
  .dig-enter button {width:291px;border: 0;color: #fff;font-size: 14px;margin-top: 44px;font-family: Lato-Regular;
    height:48px;background:linear-gradient(90deg,rgba(194,194,194,1) 0%,rgba(165,165,165,1) 100%);border-radius:4px;}

  .dig-button-list {display: flex;padding-top: 14px;}
  .dig-button-list button {width:120px;height:32px;background:#D8D8D8;border-radius:4px;
    border: 0;color: #fff;font-size: 13px;}
  .dig-button-list button:last-child {margin-left: 16px;}

 .appendAcitve {background:linear-gradient(90deg,rgba(66,145,255,1) 0%,rgba(11,127,230,1) 100%)!important;}

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
  .en .dig-body ul li {font-family: Source-Medium;}
  .dig-body ul li:first-child {margin-left: 0;}

  .Lock-record,.ore-pool,.dig-earnings {flex: 1;box-sizing: border-box;padding: 20px 32px 0;}

  .dig-earnings-list {height: calc(100% - 20px);}


  .dig-footer {padding: 0 22px 0 32px;color: #839299;height: 45px;
    border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;}

  .sotpPool {background:linear-gradient(90deg,#ee1c39 0%,#d91949 100%)!important;}

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