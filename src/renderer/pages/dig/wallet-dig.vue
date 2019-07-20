<template>
  <main @click="closeWalletList">
    <section class="dig-container">
      <!-- 挖矿头部 -->
      <section class="dig-header">
        <section class="dig-header-check">
          <h3>Mining</h3>
          <section class="button-list">
            <ul>
              <li @click="downCheckWallet" :disabled="checkedWallet" :class="noCursor ? 'noCursor' : ''" ref="walletListImg">
                <span>{{selectedWalletName}}</span>
                <!-- <img src="../../assets/images/moreDown.png" alt=""> -->
              </li>
              <!-- <li v-show="checkWallet">
                <ul>
                  <li v-for="(wallet, index) in wallets"  @click="checkDigWallet(wallet)">
                    <span :class="wallet.walletAddress == selectedWalletAddress ? 'checkColor' : ''">{{ wallet.walletName }}</span>
                    <img src="../../assets/images/amountChecked.png" v-show="wallet.walletAddress == selectedWalletAddress" alt="">
                  </li>
                </ul>
              </li> -->
            </ul>
            <wallet-button type="button" 
                :text="digButton"
                :disabled="disabledButton"
                :class="[miningIn ? 'miningIn' : '', 
                  checkedWallet ? 'passCorrect' : '', 
                  disabledButton ? 'noCursor' : '']"
                @click.native="beginDigMask"/>
          </section>
          <h4>可用余额：<span>{{ digBalance.toLocaleString('en-US') }} BIUT</span></h4>
          <section class="dig-tips">
            <label>Description:</label>首次开启挖矿时，钱包金额需有10个以上的BIUT余额
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
        <ul>
          <li @click="tabPage(1)" :class="pageIdx == 1 ? 'checkColor' : ''">挖矿收益</li>
          <li @click="tabPage(2)" :class="pageIdx == 2 ? 'checkColor' : ''">锁仓记录</li>
          <li @click="tabPage(3)" :class="pageIdx == 3 ? 'checkColor' : ''">矿池</li>
        </ul>

        <!-- 挖矿收益 -->
        <section class="dig-earnings" v-show="pageIdx == 1">
          <!-- 挖矿内容-头部 -->
          <dig-title  
            :number="digNumber"
            :digTitleShow="true"
            :selectedWallet="selectedWallet" 
            :selectedPrivateKey="selectedPrivateKey" 
            :wallets="this.$route.query.wallets" :income="digIncome"/>
          <!-- 挖矿内容-列表 -->
          <section>
            <dig-list :digLists="moreList"/>
          </section>
        </section>
        
        <!-- 锁仓记录 -->
        <section class="Lock-record" v-show="pageIdx == 2">
          <lock-record :itemList = "recordLists"/>
        </section>

        <!-- 矿池 -->
        <section class="ore-pool" v-show="pageIdx == 3">

          <!-- 条件不足、条件满足 --> 
          <section class="ore-pool-conditions" v-show="orePoolPage == 1">
            <p>当前钱包BIUT数量：</p>
            <p>已冻结：{{ orePoolLock }} / {{ orePoolAllMoney }} </p>
            <p>可用：{{ orePooAvailable }} BIUT</p>
            <p>锁仓的数量越多，挖到BIU的机会会越大哦！点击“挖矿”按钮，锁仓更多数量吧！</p>
            <button 
              type="button" 
              :class="orePoolTrue ? 'orePoolTrue' : ''"
              :disabled="!orePoolTrue" 
              @click="openPool">
                {{ orePoolTxt }}
            </button>
          </section>
        
          <!-- 申请中 -->
          <section class="ore-pool-apply" v-show="orePoolPage == 2">
            <p>当前钱包BIUT数量：</p>
            <p>已冻结：{{ orePoolLock }} / {{ orePoolAllMoney }} </p>
            <p>可用：{{ orePooAvailable }} BIUT</p>
            <p>锁仓的数量越多，挖到BIU的机会会越大哦！点击“挖矿”按钮，锁仓更多数量吧！</p>
            <p>已申请开通矿池，请等待系统审核哦</p>
            <p>名称：{{ orePoolName }}</p>
          </section>  

          <!-- 申请失败 -->
          <section class="ore-pool-error"  v-show="orePoolPage == 3">
            <p>当前钱包BIUT数量：{{ orePoolApplyMoney }} / {{ orePoolAllMoney }}</p>
            <button type="button" @click="openPool">开启我的矿池</button>
            <p>申请记录</p>
            <ul>
              <li>
                <span>申请金额</span>
                <span>时间</span>
                <span>状态</span>
              </li>
              <li>
                <span>{{ orePoolApplyMoney }}</span>
                <span>{{ orePoolApplyTime }}</span>
                <span>失败</span>
              </li>
            </ul>
          </section>

          <!-- 申请成功 -->
          <section class="ore-pool-success"  v-show="orePoolPage == 4">
            <p>当前钱包BIUT数量：已冻结：{{ orePoolApplyMoney }} / {{ orePoolAllMoney }}</p>
            <p>名称：{{ orePoolName }}</p>
            <p>矿池开通时间：{{ orePoolApplyTime }}</p>
            <ul>
              <li>
                <span>我的矿池资产</span>
                <span>{{ orePoolAssets }}</span>
              </li>
              <li>
                <span>矿池节点数量</span>
                <span>{{ orePoolNode }}</span>
              </li>
              <li>
                <span>矿池总收益</span>
                <span>{{ orePoolAllEarnings }}</span>
              </li>
              <li>
                <span>我的收益</span>
                <span>{{ orePoolMyEarnings }}</span>
              </li>
            </ul>
          </section>

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

        <!-- 首次开启挖矿 -->
        <section class="mask-body" v-show = 'makePages == 0'>
          <!-- <p>{{maskText}}</p> -->
          <p>挖矿金额会被锁仓一年，锁仓的数量越多，挖到BIU的机会会越大哦！</p>
          <section class="mask-body-list">
            <span>选择挖矿金额</span>
            <input type="text" placeholder="请输入挖矿金额" v-model="firstBeginIpt" />
          </section>
          <p>可用：{{ digBalance.toLocaleString('en-US') }}  BIUT <span>All</span></p>
          <button type="button"  @click="_confirm()">Confirm</button>
          <p>BIUT余额10000以上可开启分享挖矿，获得更高收益哦！</p>
        </section>

        <!-- 不是首次开启挖矿 -->
        <section class="mask-body" v-show = 'makePages == 1'>
          <p>你即将用“挖矿钱包 {{ selectedWalletAddress }}  开启挖矿</p>
          <section>
            <span>当前钱包已冻结：{{ digLockMoney }} BIUT</span>
            <span>可用：{{ digAvailableMoney }} BIUT</span>
          </section>
          <section class="mask-body-list">
            <span>请输入选择挖矿金额</span>
            <section>
              <input type="text" placeholder="请输入选择挖矿金额" v-model="lockMoneyIpt"/>
            </section>
          </section>
          <button type="button"  @click="_confirm()">Confirm</button>
          <p>BIUT余额10000以上可开启分享挖矿，获得更高收益哦！</p>
        </section>

        <!-- 邀请挖矿弹窗 -->
        <section class="mask-body" v-show = 'makePages == 2'>
          <p>恭喜你获得邀请挖矿的机会，完成以下操作即可开启邀请挖矿，享受更高挖矿收益</p>
          <section class="mask-body-list">
            <span>请输入选择挖矿金额</span>
            <section>
              <input type="text" placeholder="请输入选择挖矿金额" v-model="invitationMoneyIpt"/>
            </section>
          </section>
          <section class="mask-body-list">
            <span>填写邀请码</span>
            <section>
              <input type="text" placeholder="请输入邀请码" v-model="invitationIpt"/>
            </section>
          </section>
          <button type="button"  @click="_confirm()">Confirm</button>
          <p>BIUT余额10000以上可开启分享挖矿，获得更高收益哦！</p>
        </section>

      </section>
    </section>

    <!-- <section class="mask" v-show="mineStatusError">
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
    </section> -->

    <!-- 中途断网情况下，错误弹窗提示 -->
    <section class="mask" v-show="networkError">
      <section class="mask-container dig-mask">
        <img
          src="../../assets/images/closeMask.png"
          alt=""
          class="closeImg"
          title="close"
          @click="networkError = false"
        />
        <section class="mask-body">
          <p>{{networkErrorText}}</p>
          <button type="button" class="continue" @click="onContinue()">Continue</button>
          <button type="button" class="exit"  @click="onAppExit()">Exit</button>
        </section>
      </section>
    </section>

    <section class="dig-mask-tips" v-show = "translucentShow">
      {{ translucentText }}
    </section>      
  </main>
</template>

<script>
import digFooter from './components/wallet-dig-footer'
import digTitle from './components/wallet-dig-title'
import walletButton from '../../components/wallet-button'
import digList from './components/wallet-dig-list'

import lockRecord from './components/lock-record'

import walletMargin from '../../components/wallet-margin'
import WalletsHandler from '../../lib/WalletsHandler'
import { setInterval, clearTimeout, clearInterval, setTimeout } from 'timers'
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
    lockRecord
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
      selectedWalletAddress: '',
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
      getSyncStatusJob: '',
      checkNodeJob: '',
      processTexts: ['Enter the mining page, and wait for mining.'],
      moreList: [],
      
      maskShow: false,
      maskText: '',
      mineStatusText: 'Please stop mining before changing wallet',
      // mineStatusError: false,
      bAlreadyShowed: false,
      digBalance: 0, //挖矿余额
      translucentShow: false,
      navigatorPost: false,// 监听网络请求
      translucentText: 'Only if the range of mine digging mortgage is changed to BIUT mortgage of 10-100000 can the mining function be started.',
      networkError: false,
      networkErrorText: 'No connection to network. Continue or exit?',
      networkCheckJob: '',


      pageIdx: 1, //初始页面展示挖矿收益
      itemList: [
        {
          id: '1',
          lockTime: '2019-07-19 23:28   +8',
          lockMoney: '10',
          unlockTime: '2019-07-19 23:28   +8'
        }
      ],//锁仓记录

      makePages: 0,//默认是首次开启挖矿 0 - 首次挖矿 1  - 不是首次挖矿  2 - 邀请挖矿
      firstBeginIpt: '',//第一次开启挖矿的input
      lockMoneyIpt: '',//不是第一次挖矿的input
      invitationMoneyIpt: '',//邀请挖矿金额的input
      invitationIpt: '',//邀请挖矿的邀请码input
      digLockMoney: 100, //挖矿冻结金额
      digAvailableMoney: 10,//挖矿可用

      orePoolLock: 0,//矿池已经冻结金额
      orePoolAllMoney: 1000,//矿池所有金额
      orePooAvailable: 10,//矿池可用金额
      orePoolTrue: false, //挖矿是否可开启 默认 false
      orePoolTxt: '无法开启矿池', //矿池是否可开启的文本内容  如果满足条件 orePoolTrue = true  orePoolTxt = '开启矿池'
      orePoolName: '矿池名称',//矿池名称
      orePoolApplyMoney: 800,//矿池已经申请金额
      orePoolApplyTime: '2019-07-17 18:29',//矿池申请时间
      orePoolPage: 4,//矿池页面切换显示  1 - 不满足条件、满足条件显示 2 - 申请中 3 - 申请失败 4 - 申请成功
      orePoolAssets: 0,//我的矿池资产
      orePoolNode: 0,//矿池节点数量
      orePoolAllEarnings: 0,//矿池总收益
      orePoolMyEarnings: 0,//我的收益
    }
  },
  computed: {
    recordLists () {
      return Array(5).fill(this.itemList[0])
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
        this.digButton = "Start Mining"
        this.maskShow = false
        this.checkedWallet = true
        this.noCursor = false
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

    //开启矿池
    openPool () {
      alert("点击了开启矿池")
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
      this.networkError = false
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
      this.updateListJob = setInterval(() => {
        this._getWalletMiningHistory()
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

    _startCheckPeersJob () {
      this.$JsonRPCClient.checkRlpConnections((response) => {
        if (response.result.message === 0) {
          this.networkError = true
          this.networkErrorText = 'No connected peer. You can exit the application and check your network'
        }
      })
    },

    _startCheckNetworkJob () {
      if (!WalletsHandler.checkNetworkStatus()) {
        this.networkError = true
        this.networkErrorText = 'No network connection. You can exit the application and check your network'
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
      this.$JsonRPCClient.getWalletBalance(this.selectedWallet.walletAddress, (balance) => {
        this.digBalance = balance
        fnCheckMining(balance)
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
      let balance = this.digBalance
      if (balance < 10 && this.digButton == "Start Mining") {
        this.translucentShow = true
        setTimeout(() => {
          this.translucentShow = false
        }, 3000)
      } else {
        this.maskShow = true
        //判断是否是首次开启挖矿


        // if (this.digButton == "Start Mining") {
        //   this.maskText =`Mining will start soon, confirm using the ${this.selectedWalletName} binding?`
        // } else {
        //   this.maskText = "Confirm to Stop Mining?"
        // }
      }
    },

    //开启挖矿
    beginDig () {
      let balance = this.digBalance
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
      alert("开启挖矿")
      this.maskShow = false
      // if (this.digButton === "Start Mining") {
      //   if (!WalletsHandler.checkNetworkStatus()) {
      //     this.processTexts.push('No network connection.')
      //     return
      //   }
      //   this.digButton = "Stop Mining"
      //   this.moreList = []
      //   this.startMining()
      //   this.maskShow = false
      //   this.checkedWallet = false
      //   this.noCursor = true
      // } else {
      //   this.digButton = "Start Mining"
      //   this.stopMining()
      //   this.maskShow = false
      //   this.checkedWallet = true
      //   this.noCursor = false
      // }
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
        this.processTexts.push(`Start mining (connecting nodes...).`)
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
  main {padding: 24px 24px 0;background: #F4F5F5;height: calc(100vh - 25px);display: flex;
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


  .dig-header .dig-header-check ul li ul li {height: 40px;padding: 0 16px;display: flex;align-items: center;justify-content: space-between;}
  .dig-header .dig-header-check ul li ul li:first-child {border-top-left-radius: 4px;border-top-right-radius: 4px;}
  .dig-header .dig-header-check ul li ul li:last-child {border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;}
  .dig-header .dig-header-check ul li ul li:hover {cursor: pointer;background:rgba(237,242,241,1);}
  
  .dig-header .dig-header-check .button-list {display: flex;align-items: center;justify-content: space-between;
    padding-right: 18px;margin-top: 8px;}
  .dig-header .dig-header-check .dig-tips {width: 290px;word-wrap:break-word;color:#576066;}
  .dig-header .dig-header-check .dig-tips label {font-family: Lato-Bold;}
  
  .dig-header .dig-header-list {flex: 1;height: 132px;background:rgba(247,247,247,1);border-radius: 4px;
    overflow: auto;color: #252F33;padding: 16px 14px;}
  .dig-header .dig-header-list ul {list-style: disc;}
  .dig-header .dig-header-list ul li {padding-top: 5px;line-height: 1.5;}
  .dig-header .dig-header-list ul li:first-child {padding-top: 0;}
  
   .dig-mask-tips {position: fixed;top: 50%;left: 50%;margin: -32px 0 0 -200px;width: 400px;
    padding: 24px;background:rgba(66,83,91,.92);color: #F7FBFA;font-size: 14px;
    border-radius: 4px;}

  .dig-header .dig-header-check ul li ul::-webkit-scrollbar { width: 2px; height: 2px;}
  .dig-header .dig-header-check ul li ul::-webkit-scrollbar-thumb { -webkit-box-shadow: inset 0 0 1px #00D6B2;background: #00D6B2;border-radius: 1px;}
  .dig-header .dig-header-check ul li ul::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 1px #EDF5F4;border-radius: 0; background: #EDF5F4;}
  
  .dig-body {padding: 22px 22px 0 32px;flex: 1;display: flex;flex-direction: column;}
  .dig-body ul {display: flex;height: 40px;}
  .dig-body ul li {width: 100px;cursor: pointer;}

  .Lock-record,.ore-pool,.dig-earnings {border: 1px solid red;flex: 1;box-sizing: border-box;}

  .ore-pool-conditions p {padding: 10px 20px;}
  .ore-pool-conditions button {margin: 20px;}

  .ore-pool-apply p {padding: 10px 20px;}

  .ore-pool-error p {padding: 10px 20px;}
  .ore-pool-error button {margin: 20px;}
  .ore-pool-error ul {display: flex;flex-direction: column;padding: 0 20px;}
  .ore-pool-error ul li {display: flex;align-items: center;justify-content: space-between;width: 60%;height: 40px;}
  .ore-pool-error ul li span:first-child {width: 20%}  
  .ore-pool-error ul li span:nth-child(2) {width: 30%}  
  .ore-pool-error ul li span:last-child {width: 10%}  

  .ore-pool-success p {padding: 10px 20px;}
  .ore-pool-success ul {display: flex;padding: 0 20px;height: auto;}
  .ore-pool-success ul li {display: flex;flex-direction: column;flex: 1;align-items: center;}
  .ore-pool-success ul li span:last-child {border-radius: 50%;display: flex;width: 100px;margin-top: 30px;
    border: 1px solid red;height: 100px;align-items: center;justify-content: center;}

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

  
  .checkColor {color: #29D893;}
  .dig-mask-body .exit {background:linear-gradient(90deg,rgba(238,28,57,1) 0%,rgba(217,25,73,1) 100%);}
  .dig-mask-body .continue {background:linear-gradient(90deg,rgba(41,216,147,1) 0%,rgba(41,216,147,1) 100%);}


  .mask-body {padding: 44px 20px 16px 24px;}
  .mask-body p {padding-top: 20px;}
  .mask-body .mask-body-list {display: flex;padding: 20px 0;}


  .orePoolTrue {background:linear-gradient(90deg,rgba(41,216,147,1) 0%,rgba(12,197,183,1) 100%);}
</style>