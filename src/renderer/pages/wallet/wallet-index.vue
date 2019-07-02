<template>
  <main class="wallet-container"  @click="closeMenuList">
    <!-- 钱包列表 -->
    <section class="wallet-list">
      <left-nav :wallets="wallets" :selectedPrivateKey="selectedPrivateKey" createdId="walletIndex" @walletSelectionChanged = "onSelectWalletChanged" />
    </section>


    <!-- 钱包相关信息 -->
    <section class="wallet-content">


      <section class="wallet-content-header">
        
        <section class="wallet-content-header-left">
          <!-- 头部删除 修改名字 -->
          <section>
            <img src="../../assets/images/menu.png" alt="" @click="tabMenuList" id='menuListImg'>
            <section class="wallet-content-header-left-update"
                    :class="inputActive?'input-active':''"
                     @click="updateName">
              <span v-show="inputReadonly">{{ oldWalletName }}</span>
              <input type="text" 
                   maxlength="14"
                   ref="contentInput"
                   v-model="walletName"
                   v-show="!inputReadonly"
                   :readonly="inputReadonly"
                   onkeyup="this.value=this.value.replace(/(^\s*)/g, '')"
                   @input="inputUpdateName"
                   @blur="saveName"/>
              <!-- <img src="../../assets/images/updateName.png" v-show="inputActive" alt="" @click="clearInput"> -->
            </section>
            
            <ul v-show="menuShow">
              <li v-for="(item, index) in menuList" 
                @click="lookMask(index)">{{item.text}}</li>
            </ul>
          </section>

          <!-- 私钥 转账 --->
          <!-- <h2>{{walletBalance}} <span>BIUT Token</span></h2> -->
          <section class="wallet-header-list">
            <section>
              <span id="address">0x{{selectedWallet.walletAddress}}</span>
              <img src="../../assets/images/copy.png" alt="" @click="copyCnt" 
                data-clipboard-target="#address" class="copyButton"/>
            </section>
            <section class="wallet-button-list">
              <wallet-button :text="receiptButton" :imgUrl="receiptImg" @click.native="lookMask(5)"/>
              <wallet-button :text="transferButon" :imgUrl="transferImg" @click.native="lookMask(4)"/>
            </section>
          </section>
          
        </section>
        <!-- left结束 -->

        <!-- 金额展示 -->
        <section class="wallet-header-money-list">
          <section class="money-content">
            <span> BIUT Balance </span>
            <p>{{walletBalance}} BIUT</p>
            <!-- <img src="../../assets/images/indexAmountBg.png" alt=""/> -->
          </section>
          <section class="money-content">
            <span> BIU Balance </span>
            <p>{{walletBalanceSEN}} BIU</p>
            <!-- <img src="../../assets/images/indexAmountBg.png" alt=""/> -->
          </section>
        </section>

        
      </section>

      <section class="wallet-content-body" :class="moreShow ? '' : 'wallet-padidng-bottom'">
        <p class="wallet-content-body-title">Transaction Record</p>

        <section class="wallet-container-list">
          <!-- 没有数据列表 walletContent == 1  -->
          <section class="wallet-content-body-mull" :style="noTradingStyle">
            <img src="../../assets/images/wallet-null.png" alt="">
            <p>No transaction data</p>
          </section>
          <!-- 有数据列表 walletContent == 1 -->
          <section class="wallet-content-body-list" :style="noTradingStyles">
            <trading-list :tradingList="tradingList" :wallets="wallets" :selectedPrivateKey="selectedPrivateKey"/>
          </section>
        </section>
        
        <!-- 暂无更多数据 -->
        <!-- <p class="noMore" v-show="noMoreData">No further data available ^_^</p> -->
        <section class="moreList" v-show="moreShow" @click="onClickLoadMore">
          <img src="../../assets/images/moreList.png" alt="">
          <span>Click to load more</span>
        </section>
      </section>

    </section>
 
  <!-- 半透明弹窗 -->
  <wallet-translucent :text="translucentText" v-show="translucentShow"/>
  <!-- 遮罩层弹窗 -->
  <wallet-mask :maskPages="maskPages" :walletData="selectedWalletData" :balance="walletBalance" :balanceSEN="walletBalanceSEN" :selectedWallet="selectedWallet"  
      :maskShow="maskShow" @changeClose="closeMask" @updateWalletList="onUpdateWalletList" @updateWalletBalance="onUpdateWalletBalance"
      @updateWalletBalanceSEN="onUpdateWalletBalanceSEN"/>
  </main>

</template>

<script>
import leftNav from './components/wallet-left-nav'
import walletMask from './components/wallet-mask'
import tradingList from './components/wallet-trading-list'
import walletTranslucent from '../../components/wallet-translucent'
import walletButtonImg from '../../components/wallet-button-img'
import receiptImg from '../../assets/images/receiptImg.png'
import transferImg from '../../assets/images/transferImg.png'
import Clipboard from 'clipboard'
import WalletsHandler from '../../lib/WalletsHandler'
import { clearInterval, setInterval } from 'timers';
let FileSaver = require('file-saver')
let jobID
export default {
  name: '',
  components: {
    leftNav,
    walletTranslucent,
    walletButton: walletButtonImg,
    walletMask,
    tradingList
  },
  props: {},
  data () {
    return {
      receiptButton: 'Receipt',
      receiptImg: receiptImg,
      transferButon: 'Sent',
      wallets: {},
      selectedWallet: {},
      selectedPrivateKey: '',
      selectedWalletData: {},
      transferImg: transferImg,
      menuShow: false,
      walletName: 'wallet Name',
      oldWalletName: 'wallet Name',
      walletBalance: '0',//sec余额
      walletBalanceSEN: '0',//sen余额
      walletAddress: '',
      inputReadonly: true,
      inputActive: false,
      noMoreData: false, //暂无更多数据
      menuList: [
        {
          id: '01',
          text: 'Export Private key',
        },
        {
          id: '02',
          text: 'Export Keystore',
        },
        {
          id: '03',
          text: 'Export Phrase',
        },
        {
          id: '04',
          text: 'Delete Wallet',
        }
      ],
      translucentText: '',
      translucentShow: false,
      maskPages: 0,
      maskShow: false,
      tradingList: [],
      tradingListTotalLength: 0,
      tradingListSkip: 4
    }
  },
  computed: {
    noTradingStyle () {
      if (this.tradingListTotalLength > 0){
        return {
          display: 'none'
        }
      }
    },
    noTradingStyles () {
      if (this.tradingListTotalLength == 0){
        return {
          display: 'none'
        }
      }
    },
    moreShow () {
      if (this.tradingListTotalLength > 4 && !this.noMoreData) {
        return true
      } else {
        return false
      }
    }
  },
  created () {
    this.wallets = this.$route.query.wallets
    this.selectedPrivateKey = this.$route.query.selectedPrivateKey
  },
  mounted () {

  },
  destroyed () {
    if (jobID) {
      clearInterval(jobID)
    }
  },
  methods: {
    //交易记录方法
    onClickLoadMore () {
      this.tradingListSkip = this.tradingListSkip + 4
      clearInterval(jobID)
      this._startUpateJob()
    },

    //遮罩层相关弹窗
    lookMask (index) {
      // maskPages 0 私钥 1 keystrore 2 助记词 3 删除 4  转账 5 二维码地址
      if (index === 3) {
        let mingingStatus = JSON.parse(window.sessionStorage.getItem('miningStatus'))
        if (mingingStatus && mingingStatus.wallet.privateKey === this.selectedPrivateKey && mingingStatus.miningIn) {
          this.maskPages = 6
        } else {
          this.maskPages = index
        }
      } else if (index === 4) {
        /**
         * SEN余额小于 （获取） 转账手续费最小值（0.001）
         * 
         * toast提示语 'SEN isn't enough to sent'
        */
        if (Number(this.walletBalanceSEN) < 0.01) {
          this.translucentShow = true
          this.translucentText = "BIU isn't enough to sent"
          setTimeout(() => {
            this.translucentShow = false
          }, 3000)
        } else {
          this.maskPages = 4
        }
      } else {
        this.maskPages = index
      }
      this.maskShow = true
    },
    
    //复制地址
    copyCnt () {
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
          this.translucentText = 'Copy the failure'
          setTimeout(() => {
            this.translucentShow = false
          }, 3000)
          clipboard.destroy()
      })
    },

    //切换操作菜单是否显示
    tabMenuList () {
      this.menuShow = !this.menuShow
    },

    //钱包名称不能输入空格开头
    inputUpdateName () {
      this.$nextTick(()=> {
        this.walletName = this.walletName.replace(/(^\s*)/g, '')
      })
    },

    //修改钱包名称
    updateName () {
      this.inputReadonly = false
      this.inputActive = true
      this.$nextTick( () =>{
        this.$refs.contentInput.focus()
      } )
    },

    //失去焦点保存名称
    saveName () {
       let newKeyStore = {} 
       if (this.walletName.trim().length === 0) {
         this.translucentShow = true
         this.translucentText = "Wallet name cannot be empty or only with space"
         setTimeout(() => {
          this.translucentShow = false
       }, 4000)
         return
       } else if (this.walletName === this.selectedWallet.name) {
          this.inputReadonly = true
          this.inputActive = false
          return
       }
       let miningWallet = JSON.parse(window.sessionStorage.getItem("miningStatus"))
       
       if (miningWallet) {
         miningWallet.wallet.walletName = this.walletName
         window.sessionStorage.setItem("miningStatus", JSON.stringify(miningWallet))
       }

       this.selectedWallet.name = this.walletName
       this.wallets[this.selectedWallet.privateKey].walletName = this.walletName
       this.selectedWalletData.walletName = this.walletName
       newKeyStore[this.selectedWalletData.privateKey] = this.selectedWalletData
       WalletsHandler.updateWalletFile(this.selectedWalletData, () => {
         this.translucentShow = true
         this.translucentText = "Change wallet name success"
         this.oldWalletName = this.walletName
       })

       setTimeout(() => {
          this.translucentShow = false
       }, 4000)
      //修改失败
      //  this.translucentShow = true
      //  this.translucentText = "Name option no empty"
       this.inputReadonly = true
       this.inputActive = false
    },

    //清楚输入框
    // clearInput () {
    //   this.walletName = ""
    // },

    //点击其他的地方关闭菜单列表
    closeMenuList (event) {
      let menuList = document.getElementById('menuListImg')
      if (this.menuShow && !menuList.contains(event.target)) {
        this.menuShow = false;
      }
    },
    
    //关闭遮罩层
    closeMask () {
      this.maskShow = false
    },

    _resetSkipTotal () {
      this.tradingListTotalLength = 0
      this.tradingListSkip = 4
      this.tradingList = []
      this.noMoreData = false
    },

    /** Event Method, triggerd if wallet selection changed*/
    onSelectWalletChanged (selectedWallet) {
      if (jobID) {
        clearInterval(jobID)
      }
      window.sessionStorage.setItem("selectedPrivateKey", selectedWallet.privateKey)
     this._resetSkipTotal()
      this.selectedWallet = selectedWallet
      this.selectedWalletData = this.wallets[selectedWallet.privateKey]
      
      this.selectedPrivateKey = selectedWallet.privateKey
      //this.$route.query.selectedPrivateKey = this.selectedPrivateKey
      this.oldWalletName = selectedWallet.name
      this.walletName = selectedWallet.name
      this._startUpateJob()
      //return
    },

    _startUpateJob () {
      if (jobID) {
        clearInterval(jobID)
      }
      this._getWalletBalance(this.selectedWallet.walletAddress)
      this._getWalletTransactions(this.selectedWallet.walletAddress)
      jobID = setInterval(()=>{
        this._getWalletBalance(this.selectedWallet.walletAddress)
        this._getWalletTransactions(this.selectedWallet.walletAddress)
      }, 3 * 60 * 1000)
    },

    _getWalletBalance (walletAddress) {
      this.$JsonRPCClient.getWalletBalanceOfBothChains(walletAddress, (balanceSEC) => {
        this.walletBalance = this._checkValueFormat(balanceSEC)
      }, (balanceSEN) => {
        this.walletBalanceSEN = this._checkValueFormat(balanceSEN)
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

    _getWalletTransactions (walletAddress) {
      let skip = 0
      this.$JsonRPCClient.getWalletTransactionsBothChains(walletAddress, (transactions) => {
        
        this.tradingListTotalLength = transactions.length
        if (this.tradingListSkip >= transactions.length && transactions.length > 0) {
          this.noMoreData = true
          skip = transactions.length
        } else {
          this.noMoreData = false
          skip = this.tradingListSkip
        }
        if (transactions.length > 0) {
          this.tradingList = []
          for (let i=0; i < skip; i++) {
            this.tradingList.push(transactions[i])
          }
        }
      })
    },

    /** Event Method, triggered if wallet removed, update the wallet list */
    onUpdateWalletList (wallets) {
      // Delete wallet successfully 删除成功 Delete wallet failure 删除失败
      this.translucentShow = true
      this.translucentText = "Delete wallet successfully"
      setTimeout(() => {
          this.translucentShow = false
          this.translucentText = ""
      }, 3000)
      if (JSON.stringify(wallets) === '{}') {
        this.$router.push({name: 'walletCreate'})
      } else {
        this.wallets = wallets
        //this.$route.query.wallets = this.wallets
      } 
    },

    /** Event Method, triggered if wallet balance updated */
    onUpdateWalletBalance (balance, walletAddress) {
      this.walletBalance = this._checkValueFormat(balance)
      this._getWalletTransactions(walletAddress)
    },

    onUpdateWalletBalanceSEN (balance, walletAddress) {
      this.walletBalanceSEN = this._checkValueFormat(balance)
    }
  },

}
</script>

<style scoped>
  .wallet-content {padding: 36px 32px 0;}
  .wallet-content-header {display: flex;justify-content: space-between;flex-direction: column;}
  .wallet-content-header-left section:first-child {display: flex;align-items: center;color: #576066;} 
  .wallet-content-header-left section:first-child img {width: 16px;height: 12px;margin-right: 12px;}
  .wallet-content-header-left section:first-child {position: relative;}
  .wallet-content-header-left section:first-child ul {width:146px;background:rgba(66,83,91,1);
    box-shadow:0px 10px 10px rgba(66,83,91,0.2);position: absolute;top: 24px;left:-7px;z-index: 9;
    border-radius: 4px;color: #AFC3CC;font-size: 14px;}
  .wallet-content-header-left section:first-child ul li {height: 37px;line-height: 37px;padding-left: 12px;
    border-bottom: 1px solid #536973;}
  .wallet-content-header-left section:first-child ul li:first-child {border-top-left-radius: 4px;
    border-top-right-radius: 4px;position: relative;}
  .wallet-content-header-left section:first-child ul li:last-child {border:0;border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;}
  .wallet-content-header-left section:first-child ul li:hover {cursor: pointer;background: #536973;}
  
  /* 修改名称 */
  .wallet-content-header-left-update {display: flex;align-items: center;height:24px;
    border: 1px solid #fff;width: 124px;border-radius: 4px;} 
  .wallet-content-header-left-update input {border: 0;height:20px;color: #576066;width: 106px;}
  .wallet-content-header-left-update img {width: 10px!important;height: 10px!important;margin-right: 8px!important;}
  .input-active {border-color:rgba(229,229,229,1);}
  .wallet-content-header-left-update span {display: inline-block;height: 24px;line-height: 24px;font-family: Montserrat-SemiBold;
    font-size: 16px;}
  .wallet-content-header-left-update span:hover {background: #F2F2F2;cursor: pointer;}

  /* 按钮列表 */
  .wallet-header-list {display: flex;justify-content: space-between;padding: 8px 0 24px;}
  .wallet-header-list section:first-child img {width: 14px;height: 14px;margin-left: 12px;}
  .wallet-button-list {display: flex;}
  .wallet-button-list section {width: 96px;height: 36px;line-height: 36px;border-radius: 4px;
    border:1px solid rgba(229,229,229,1);font-size: 14px;}
  .wallet-button-list section:hover {cursor: pointer;}
  .wallet-button-list section >>> p {color: #252F33!important;}
  .wallet-button-list section:last-child {margin-left: 6px;}

  /* 金额列表 */
  .wallet-header-money-list {display: flex;align-items: center;justify-content: space-between;width: 100%;}
  .wallet-header-money-list .money-content {height: 112px;flex: 1;border-radius:4px;color: #fff;position: relative;
    background:linear-gradient(90deg,rgba(41,216,147,1) 0%,rgba(12,197,183,1) 100%);padding-left: 16px;
    box-shadow:0px 3px 6px rgba(37,47,51,0.16);}
  .wallet-header-money-list .money-content:last-child {margin-left: 10px;
    background:linear-gradient(90deg,rgba(66,145,255,1) 0%,rgba(11,127,230,1) 100%);
    box-shadow:0px 3px 6px rgba(37,47,51,0.16);}
  .wallet-header-money-list .money-content span {display: block;font-size: 12px;padding: 12px 0 8px;}
  .wallet-header-money-list .money-content p {font-size: 24px;font-weight: normal;}
  .wallet-header-money-list .money-content img {width: 128px;height: 112px;position: absolute;right: 0;top: 0;}

  .wallet-content-body {box-shadow:0px 0px 6px rgba(37,47,51,0.16);margin-top: 24px;
    flex: 1;display: flex;flex-direction: column;border-top-left-radius:4px;border-top-right-radius:4px;}

  .wallet-container-list {overflow: auto;box-sizing: border-box;height: 248px;}

  .wallet-content-body-list {width: 100%;}
  .wallet-container-list::-webkit-scrollbar { width: 2px; height: 2px;}
  .wallet-container-list::-webkit-scrollbar-thumb { -webkit-box-shadow: inset 0 0 1px #00D6B2;background: #00D6B2;border-radius: 1px;}
  .wallet-container-list::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 1px #EDF5F4;border-radius: 0; background: #EDF5F4;}

  .wallet-content-body .wallet-content-body-title {padding: 18px 0 12px;color: #839299;background: #fff;
    font-size: 13px;font-family: Montserrat-Regular;margin: 0 32px;}

  .wallet-content-body .wallet-content-body-mull {text-align: center;width: 100%;margin-top: 97px;}
  .wallet-content-body .wallet-content-body-mull img {width: 71px;height: 71px;}
  .wallet-content-body .wallet-content-body-mull p {color: #999999;font-family: Lato-Bold;margin-top: 14px;}

  .moreList {background: #fff;height: 50px;
    display: flex;align-items: center;justify-content: center;color: #576066;z-index: 9;}
  .moreList img {width: 11px;height: 7px;margin-right: 5px;}

  .wallet-padidng-bottom {padding-bottom: 16px;}
  .noMore {text-align: center;color: #576066;padding: 15px 0;}
</style>