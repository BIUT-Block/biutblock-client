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
                   @blur="saveName"
                   onkeyup="this.value=this.value.replace(/\s+/g,'')"/>
              <!-- <img src="../../assets/images/updateName.png" v-show="inputActive" alt="" @click="clearInput"> -->
            </section>
            
            <ul v-show="menuShow">
              <li v-for="(item, index) in menuList" 
                @click="lookMask(index)">{{item.text}}</li>
            </ul>
          </section>
          <h2>{{walletBalance}} <span>SEC Token</span></h2>
          <section>
            <span id="address">0x{{selectedWallet.walletAddress}}</span>
            <img src="../../assets/images/copy.png" alt="" @click="copyCnt" data-clipboard-target="#address" class="copyButton">
          </section>
        </section>

        <section class="wallet-content-header-right">
          <wallet-button :text="receiptButton" :imgUrl="receiptImg" @click.native="lookMask(5)"/>
          <wallet-button :text="transferButon" :imgUrl="transferImg" @click.native="lookMask(4)"/>
        </section>
      </section>
      <section class="wallet-content-body" :class="moreShow?'wallet-padidng-bottom':''">
        <p class="wallet-content-body-title">Transaction Record</p>
        <!-- 没有数据列表 walletContent == 1 -->
        <section class="wallet-content-body-mull" :style="noTradingStyle">
          <img src="../../assets/images/wallet-null.png" alt="">
          <p>No transaction data</p>
        </section>
        <!-- 有数据列表 walletContent == 1 -->
        <section class="wallet-content-body-list">
          <trading-list :tradingList="tradingList" :wallets="wallets" :selectedPrivateKey="selectedPrivateKey"/>
        </section>
        <!-- 暂无更多数据 -->
        <p class="noMore" v-show="noMoreData">No further data available ^_^</p>
      </section>
    </section>
  <section class="moreList" v-show="moreShow" @click="moreTradingList">
    <img src="../../assets/images/moreList.png" alt="">
    <span>Click to load more</span>
  </section>
  <!-- 半透明弹窗 -->
  <wallet-translucent :text="translucentText" v-show="translucentShow"/>
  <!-- 遮罩层弹窗 -->
  <wallet-mask :maskPages="maskPages" :walletData="selectedWalletData" :balance="walletBalance" :selectedWallet="selectedWallet"  
      :maskShow="maskShow" @changeClose="closeMask" @updateWalletList="onUpdateWalletList" @updateWalletBalance="onUpdateWalletBalance"/>
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
      transferButon: 'Transfer',
      wallets: {},
      selectedWallet: {},
      selectedPrivateKey: '',
      selectedWalletData: {},
      transferImg: transferImg,
      menuShow: false,
      walletName: 'wallet Name',
      oldWalletName: 'wallet Name',
      walletBalance: '1000',
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
      tradingList: []
    }
  },
  computed: {
    noTradingStyle () {
      if (this.tradingList.length > 0){
        return {
          display: 'none'
        }
      }
    },
    moreShow () {
      if (this.tradingList.length > 5) {
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
  destroyed () {},
  methods: {
    //交易记录方法
    moreTradingList () {
      /**
       * 点击更多默认多加载五条、如果已经加载全部数据就  this.noMoreData = true  
       */
      alert("加载更多")
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

    /** Event Method, triggerd if wallet selection changed*/
    onSelectWalletChanged (selectedWallet) {
      if (jobID) {
        clearInterval(jobID)
      }
      window.sessionStorage.setItem("selectedPrivateKey", selectedWallet.privateKey)

      this.selectedWallet = selectedWallet
      this.selectedWalletData = this.wallets[selectedWallet.privateKey]
      
      this.selectedPrivateKey = selectedWallet.privateKey
      //this.$route.query.selectedPrivateKey = this.selectedPrivateKey
      this.oldWalletName = selectedWallet.name
      this.walletName = selectedWallet.name
      this._getWalletBalance(selectedWallet.walletAddress)
      this._getWalletTransactions(selectedWallet.walletAddress)
      jobID = setInterval(()=>{
        this._getWalletBalance(selectedWallet.walletAddress)
        this._getWalletTransactions(selectedWallet.walletAddress)
      }, 5000)
      //return
    },
    _getWalletBalance (walletAddress) {
      this.$JsonRPCClient.getWalletBalance(walletAddress, (balance) => {
        this.walletBalance = balance
      })
    },
    _getWalletTransactions (walletAddress) {
      this.$JsonRPCClient.getWalletTransactions(walletAddress, (transactions) => {
        this.tradingList = transactions
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
      this.walletBalance = balance
      this._getWalletTransactions(walletAddress)
    }
  },

}
</script>

<style scoped>
  .wallet-content {padding: 36px 32px 24px;}
  .wallet-content-header {height: 130px;display: flex;justify-content: space-between;}
  .wallet-content-header-left section {display: flex;align-items: center;color: #576066;}
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
  .wallet-content-header-left section:last-child img {width: 14px;height: 14px;margin-left: 12px;}
  .wallet-content-header-left h2 {font-size: 32px;color: #252F33;font-weight: 300;margin: 20px 0 10px;}
  .wallet-content-header-left h2 span {font-size: 14px;}
   
  .wallet-content-header-left-update {display: flex;align-items: center;height:24px;
    border: 1px solid #fff;width: 124px;border-radius: 4px;} 
  .wallet-content-header-left-update input {border: 0;height:20px;color: #576066;width: 106px;}
  .wallet-content-header-left-update img {width: 10px!important;height: 10px!important;margin-right: 8px!important;}
  .input-active {border-color:rgba(229,229,229,1);}
  .wallet-content-header-left-update span {display: inline-block;height: 24px;line-height: 24px;}
  .wallet-content-header-left-update span:hover {background: #F2F2F2;cursor: pointer;}

  .wallet-content-header-right {display: flex;flex-direction: column;padding-bottom: 16px;}
  .wallet-content-header-right section {width: 130px;height:54px;line-height:54px;border-radius: 4px;
    box-shadow:0px 3px 6px rgba(37,47,51,0.16);font-size: 14px;}
  .wallet-content-header-right section:first-child {margin-bottom: 6px;}

  
  .wallet-content-body {box-shadow:0px 0px 6px rgba(37,47,51,0.16);border-radius:4px;overflow: auto;
    flex: 1;padding-top: 54px;}
  .wallet-content-body::-webkit-scrollbar { width: 2px; height: 2px;}
  .wallet-content-body::-webkit-scrollbar-thumb { -webkit-box-shadow: inset 0 0 1px #00D6B2;background: #00D6B2;border-radius: 1px;}
  .wallet-content-body::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 1px #EDF5F4;border-radius: 0; background: #EDF5F4;}

  .wallet-content-body .wallet-content-body-title {padding: 23px 0 14px;color: #839299;background: #fff;
    border-bottom: 1px solid #E5E5E5;font-size: 13px;font-family: Montserrat-Regular;position: fixed;
    top: 196px;right: 64px;left: 354px;}
  .wallet-content-body .wallet-content-body-mull {display: flex;align-items: center;justify-content: center;
    min-height: 300px;flex-direction: column;}
  .wallet-content-body .wallet-content-body-mull img {width: 71px;height: 71px;}
  .wallet-content-body .wallet-content-body-mull p {color: #999999;font-family: Lato-Bold;margin-top: 14px;}

  .moreList {position: fixed;bottom: 24px;right: 64px;left: 354px;background: #fff;height: 47px;
    display: flex;align-items: center;justify-content: center;color: #576066;z-index: 9;}
  .moreList img {width: 11px;height: 7px;margin-right: 5px;}
  .wallet-padidng-bottom {padding-bottom: 47px;}


  .noMore {text-align: center;color: #576066;padding: 15px 0;}
</style>