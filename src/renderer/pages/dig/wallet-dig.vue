<template>
  <main>
    <section class="dig-container">
      <!-- 挖矿头部 -->
      <section class="dig-header">
        <section class="dig-header-check">
          <h3>Mining</h3>
          <p>Wallet Account</p>
          <ul>
            <li @click="downCheckWallet" :disabled="checkedWallet">
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
              :class="[miningIn?'miningIn':'', checkedWallet?'passCorrect':'']"
              @click.native="beginDig"/>
        </section>
        <section class="dig-header-list">
          ss
        </section>
      </section>
      <wallet-margin/>
      <!-- 挖矿内容 -->
      <section class="dig-body">
         <!-- 挖矿内容-头部 -->
        <dig-title :digTitleShow="true" :number="chainHeight" :income="digIncome"/>
        <!-- 挖矿内容-列表 -->
        <section>
          <dig-list :digLists="moreList"/>
        </section>
      </section>
      <wallet-margin/>
      <!-- 挖矿底部 -->
      <section class="dig-footer">
        <dig-footer :walletAddress="selectedWallet.walletAddress" :totalBlockHeight="chainHeight" :totalMining="networkMining"/>
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
          <button type="button"  @click="maskShow = false">Confirm</button>
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
import { setInterval, clearTimeout, clearInterval, setTimeout } from 'timers';
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
      digNumber: '1000',
      digIncome: '100',
      checkWallet: false,
      checkedWallet: true,
      wallets: [],
      selectedPrivateKey: '',
      selectedWallet: '',
      selectedWalletName: '',
      miningIn: false, //挖矿中改变按钮样式
      isSynced: false,
      chainHeight: '0',
      networkMining: '0',
      updateListJob: '',
      getBlockHeightJob: '',
      moreList: [
        // {
        //   id: '01',
        //   age: '3 days 4 hours 15 secs ago',
        //   reward: '+2.00 SEC',
        //   blicks: '155565',
        //   block: '0x75f04e06b80b4b249a878000714e038fcc746ac54f'
        // },
        // {
        //   id: '02',
        //   age: '3 days 4 hours 15 secs ago',
        //   reward: '+2.00 SEC',
        //   blicks: '155565',
        //   block: '0x75f04e06b80b4b249a878000714e038fcc746ac54f'
        // },
        // {
        //   id: '03',
        //   age: '3 days 4 hours 15 secs ago',
        //   reward: '+2.00 SEC',
        //   blicks: '155565',
        //   block: '0x75f04e06b80b4b249a878000714e038fcc746ac54f'
        // },
        // {
        //   id: '04',
        //   age: '3 days 4 hours 15 secs ago',
        //   reward: '+2.00 SEC',
        //   blicks: '155565',
        //   block: '0x75f04e06b80b4b249a878000714e038fcc746ac54f'
        // },
        // {
        //   id: '05',
        //   age: '3 days 4 hours 15 secs ago',
        //   reward: '+2.00 SEC',
        //   blicks: '155565',
        //   block: '0x75f04e06b80b4b249a878000714e038fcc746ac54f'
        // },
        // {
        //   id: '06',
        //   age: '3 days 4 hours 15 secs ago',
        //   reward: '+2.00 SEC',
        //   blicks: '155565',
        //   block: '0x75f04e06b80b4b249a878000714e038fcc746ac54f'
        // },
        // {
        //   id: '06',
        //   age: '3 days 4 hours 15 secs ago',
        //   reward: '+2.00 SEC',
        //   blicks: '155565',
        //   block: '0x75f04e06b80b4b249a878000714e038fcc746ac54f'
        // }
      ],
      maskShow: false,
      maskText: ''
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

    this.initMiningStatus()
    this.$JsonRPCClient.getBlockHeight((chainHeight) => {
      this.chainHeight = chainHeight.toString()
      this.networkMining = (Number(chainHeight)*2).toString()
    })
    this.getBlockHeightJob = setInterval(()=>{
        this.$JsonRPCClient.getBlockHeight((chainHeight) => {
        this.chainHeight = chainHeight.toString()
        this.networkMining = (Number(chainHeight)*2).toString()
      })
    }, 2500)
  },
  mounted () {

  },
  destroyed () {
    clearInterval(this.getBlockHeightJob)
    if (this.updateListJob !== '') {
      clearInterval(this.updateListJob)
    }
  },
  methods: {
    initMiningStatus () {
      let miningStatus = window.sessionStorage.getItem('miningStatus')
      if (miningStatus) {
        miningStatus = JSON.parse(miningStatus)
        this.selectedWallet = miningStatus.wallet
        this.selectedWalletName = miningStatus.wallet.walletName
        this.miningIn = miningStatus.miningIn
        this._setButton()
        this.isSynced = miningStatus.isSynced
      } else {
        this.selectedWallet = this.wallets[0]
        this.selectedWalletName = this.wallets[0].walletName
      }
      this._getWalletMiningHistory()
      // method to get total mined and number of block
    },

    //选择挖矿钱包
    downCheckWallet () {
      this.checkWallet = true
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
      this.selectedWallet = wallet
      this.selectedWalletName = wallet.walletName
      this._getWalletMiningHistory()
      this.checkWallet = false
      this.checkedWallet = true
    },
    
    _getWalletMiningHistory () {
      this.digIncome = "0"
      this.$JsonRPCClient.getWalletTransactions(this.selectedWallet.walletAddress, (history) => {
        let miningHistory = history.filter((hist) => {
          return hist.listAddress === 'Mined' && hist.listState === 'Successful'
        })
        miningHistory.forEach((element, index) => {
          this.digIncome = (Number(this.digIncome) + Number(element.listMoney)).toString() 
          this.moreList.push({
            id: index,
            age: element.listTime,
            reward: `${element.listMoney} SEC`,
            blicks: element.blockNumber,
            block: element.blockHash
          })
        })
      })
    },

    //开启挖矿
    beginDig () {
      if (this.digButton == "Start Mining") {
        this.moreList = []
        this.startMining()
        this.digButton = "Stop Mining"
        this.maskText = `Mining will start soon, confirm using the ${this.selectedWalletName} binding?`
        this.maskShow = true
        this.checkedWallet = false
      } else {
        this.stopMining()
        this.digButton = "Start Mining"
        this.maskText = "Confirm to Stop Mining?"
        this.maskShow = true
        this.checkedWallet = true
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
      this.$JsonRPCClient.switchToLocalHost()
      if (!this.isSynced) {
        this.$JsonRPCClient.client.request('sec_startNetworkEvent', [], (err, response) => {
          console.log(response)
          if (response) {
            this.isSynced = true
            setTimeout(()=>{
              this._beginMiningWithWallet()
            }, 2000)  
          }
        })
        return
      }
      this._beginMiningWithWallet()
    },

    stopMining () {
      this.$JsonRPCClient.switchToLocalHost()
      this.$JsonRPCClient.client.request('sec_setPOW', ['0'], (err, response) => {
        if (err) return
        this.miningIn = false
        this.saveMingingStatus()
      })
      clearInterval(this.updateListJob)
      this.$JsonRPCClient.switchToExternalServer()
    },

    _beginMiningWithWallet () {
      this.$JsonRPCClient.client.request('sec_setAddress', [this.selectedWallet.walletAddress], (err, response) => {
        if (err) return
      })
      this.$JsonRPCClient.client.request('sec_setPOW', ['1'], (err, response) => {
        if (err) {
          this.miningIn = false
          return
        }
        this.miningIn = true
        this.saveMingingStatus()
      })
      this.$JsonRPCClient.switchToExternalServer()
      this._getWalletMiningHistory()
      this.updateListJob = setInterval(this._getWalletMiningHistory, 5000)
    }
  },
}
</script>

<style scoped>
  main {padding: 24px;background: #F4F5F5;height: calc(100vh - 78px);display: flex;
    align-content: stretch;display:-webkit-flex;}
  .dig-container {display: flex;flex-direction: column;box-shadow:0px 0px 3px rgba(0,0,0,0.16);
  border-radius:4px;flex: 1;background: #fff;}
  .dig-header {height: 140px;border-top-left-radius: 4px;
    border-top-right-radius: 4px;padding: 20px 22px 24px 32px;display: flex;align-items: center;
    justify-content: space-between;}
  .dig-header .dig-header-check {width: 308px;}
  .dig-header .dig-header-check button {width: 182px;height: 32px;margin-top: 14px;}
  .dig-header .dig-header-check h3 {margin: 0;font-size:18px;font-family: Montserrat-SemiBold;font-weight:600;
    color:rgba(37,47,51,1);}
  .dig-header .dig-header-check p {font-family: Montserrat-Light;color: #839299;margin-top: 22px;}
  .dig-header .dig-header-check ul {height: 33px;line-height: 33px;width: 182px;color:#252F33;
    border-bottom:1px solid rgba(229,229,229,1);font-size: 14px;}
  .dig-header .dig-header-check ul img {width: 16px;height: 16px;}
  .dig-header .dig-header-check ul li:first-child {display: flex;justify-content: space-between;
    align-items: center;}
  .dig-header .dig-header-check ul li {position: relative;}
  .dig-header .dig-header-check ul li ul {height: 158px;position: absolute;top: 0;left: 0;z-index: 8;
    overflow: auto;background: #fff;box-shadow:0px 0px 6px rgba(0,0,0,0.16);border-radius: 4px;}
  .dig-header .dig-header-check ul li ul li {height: 40px;padding-left:16px;}
  .dig-header .dig-header-check ul li ul li:first-child {border-top-left-radius: 4px;border-top-right-radius: 4px;}
  .dig-header .dig-header-check ul li ul li:last-child {border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;}
  .dig-header .dig-header-check ul li ul li:hover {cursor: pointer;background:rgba(237,242,241,1);}
  .dig-header .dig-header-list {flex: 1;height: 108px;background:rgba(247,247,247,1);border-radius: 4px;
    overflow: auto;color: #252F33;padding: 16px 14px;}

  .dig-body {padding: 22px 22px 0 32px;flex: 1;overflow: hidden;}
  
  .dig-footer {padding: 0 22px 0 32px;color: #839299;height: 45px;
    border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;}

  .miningIn {background:linear-gradient(90deg,rgba(238,28,57,1) 0%,rgba(217,25,73,1) 100%)!important;}
  .dig-mask {position: relative;font-size: 14px;font-weight: 400;color: #576066;}
  .closeImg {width: 16px;height: 16px;position: absolute;top: 12px;right: 20px;}
  .dig-mask-body {padding: 44px 20px 16px 24px;text-align: right;}
  .dig-mask-body p {text-align: left;margin-bottom: 58px;}
  .dig-mask-body button {color: #fff;width:97px;background:linear-gradient(90deg,rgba(41,216,147,1) 0%,rgba(12,197,183,1) 100%);
    height:32px;border: 0;border-radius: 4px;}
</style>