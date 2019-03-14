<template>
  <main>
    <aside></aside>
    <section class="wallet-nav">
      <wallet-nav/>
    </section>
    <img src="../../assets/images/closeImg.png" v-show="createClose" title="close" class="closeImg" @click="closeCreate"/>
    <!-- 创建钱包 createPages == 1 -->
    <section class="wallet-create" v-if="createPages == 1">
      <span class="wallet-button-important" @click="importCreate">Import Wallet</span>
      <wallet-title :title="walletNameText" :choose="true"/>
      <wallet-input type="text" placeholder="Waller Name" maxlength="14" v-model="walletName"></wallet-input>
      <wallet-title :title="walletPassText1" :choose="true"/>
      
      <wallet-input-pass placeholder="Password" maxlength="30" 
          v-model="walletPass1"
          @loseFocus="loseFocus"
          @getFocus="getFocus"></wallet-input-pass>
      <wallet-tips :tips="passFormat"  v-show="passFormatShow"/>
      <wallet-title :title="walletPassText2" :choose="true"/>
      <wallet-input-pass placeholder="Confirm Password" maxlength="30" v-model="walletPass2"></wallet-input-pass>
      <wallet-button  type="button" 
                      class="wallet-button-create" 
                      :text="walletButtonText"
                      :disabled="!createActive"
                      :class="createActive?'passCorrect':''"
                      @click.native="createWallet"/>
    </section>

    <!-- 创建钱包 -- 备份助记词 createPages == 2 -->
    <section class="wallet-backup"  v-if="createPages == 2">
      <section class="backup-title">
        <label>Save these details!</label> 
        If you lose these credentials, you lose access to your assets.
      </section>
      <wallet-title :title="backupText1" :choose="false"/>
      <phrase-list :itemList="itemList"/>
      <wallet-title :title="backupText2" :choose="false" class="private-key-title"/>
      <section class="private-key-contant">
        {{ privateKey }}
      </section>
      <section class="radio-content">
        <img :src="radioImg" alt="" @click="checkRadio">
        <span>I have backed up these credentials</span>
      </section>
      <wallet-button  class="wallet-button-backup" 
                      :text="walletBackupButton"
                      :disabled="!backupActive"
                      :class="backupActive?'passCorrect':''"
                      @click.native="backupWallet"/>
    </section>

    <!-- 创建钱包 -- 导入钱包 createPages == 3 -->
    <section class="wallet-import" v-if="createPages == 3">
      <ul>
        <li v-for="(item, index) in tabList" 
            :class="tabIndex == index?'check-li':''"
            @click="isTab(index)">{{item.cnt}}</li>
      </ul>

      <!-- 私钥导入 -->
      <section class="wallet-import-private-key" v-show="tabIndex == 0">
        <textarea placeholder="Eenter your private key here" maxlength="64" v-model="walletPrivateKey"></textarea>
        <wallet-tips :tips="privateKeyErrorText" v-show="privateKeyError"/>
        <wallet-button  class="wallet-button-backup" 
                      :text="walletImportButton"
                      @click.native="importWallet"
                      :disabled="!privateActive"
                      :class="privateActive?'passCorrect':''"/>
      </section>

      <!-- keystore导入 -->
      <section class="wallet-import-keystore" v-show="tabIndex == 1">
         <p class="wallet-import-keystore-title">Enter your wallet password</p>
         <div>
           <span>{{KeyStoreVal}}</span>
           <input type="file" @change="tirggerFile($event)"/>
         </div>
         
         <section v-show="showPass">
            <wallet-title :title="walletnNewPassText" :choose="false"/>
            <wallet-input-pass placeholder="Password" maxlength="30" v-model="walletNewPass"></wallet-input-pass>
            <wallet-tips :tips="walletnNewPassErrorText" v-show="walletnNewPassError"/>
         </section>
         <wallet-button  class="wallet-button-backup" 
                      :text="walletImportButton"
                      @click.native="importWallet"
                      :disabled="!keystoreActive"
                      :class="keystoreActive?'passCorrect':''"/>
      </section>

      <!-- 助记词导入 -->
      <section  class="wallet-import-phrase" v-show="tabIndex == 2">
        <textarea placeholder="Eenter your private key here" v-model="walletPhrase"></textarea>
        <wallet-tips :tips="phraseErrorText" v-show="phraseError"/>
        <wallet-button  class="wallet-button-backup" 
                      :text="walletImportButton"
                      @click.native="importWallet"
                      :disabled="!phraseActive"
                      :class="phraseActive?'passCorrect':''"/>
      </section>

     <p class="go-create">No wallet?   <span @click="createPages = 1">Create Wallet</span></p> 
    </section>
    <!-- 钱包版本号 -->
    <span class="wallet-version">V 1.1</span>
  </main>
</template>

<script>
import walletTitle from '../../components/wallet-title'
import walletButton from '../../components/wallet-button'
import walletInput from '../../components/wallet-input'
import walletInputPass from '../../components/wallet-input-pass'
import walletTips from '../../components/wallet-tips'
import phraseList from './components/phraseList'
import walletNav from '../../components/wallet-nav'
import agreement from '../../assets/images/agreement.png'
import agreements from '../../assets/images/agreements.png'
import walletsHandler from '../../lib/WalletsHandler'
import WalletHandler from '../../lib/WalletsHandler';

export default {
  name: 'walletCreate',
  components: {
    walletTitle,
    walletButton,
    walletInput,
    walletInputPass,
    walletTips,
    phraseList,
    walletNav
  },
  props: {},
  data () {
    return {
      createPages: 1, // 1 创建钱包 2 备份助记词 3 导入钱包
      createClose: false, //创建钱包页面关闭按钮是否显示
      walletNameText: 'WALLET NAME',
      walletPassText1: 'PASSWORD',
      walletPassText2: 'CONFIRM PASSWORD',
      walletName: '', //创建钱包名称
      walletPass1: '',//密码
      walletPass2: '',//确认密码
      walletButtonText: 'Create Wallet',
      passFormat: '8-30 characters, must contain at least 2 types of numbers, English letters, and special characters',
      passFormatShow: false,//密码格式提示
      backupText1: 'PHRASE',
      backupText2: 'PRIVATE KEY',
      privateKey: '8305dcbb827255ef79f348654cd381768bd95349d330530ab33a9b2336a8f2e6',//备份助记词私钥
      walletBackupButton: 'Enter Wallet',
      radioImg: agreement,//协议按钮
      radioIndex: 1,// 1 表示默认不选择 相反选择
      agreedId: false, //备份助记词按钮默认不可点击
      itemList: [],//助记词列表

      tabList: [
        {
          id: '01',
          cnt: 'Private Key'
        },
        {
          id: '02',
          cnt: 'Keystore'
        },
        {
          id: '03',
          cnt: 'Phrase'
        }
      ],//导入钱包title
      tabIndex: 0,
      walletPrivateKey: '',//私钥
      walletNewPass: '',//导入keystroe文件输入密码
      walletPhrase: '',//助记词
      walletImportButton: 'Login',
      privateKeyErrorText: 'Private Error',//私钥错误提示语
      privateKeyError: false,//私钥错误提示是否显示
      walletnNewPassText: 'Your wallet is encrypted',//
      walletnNewPassErrorText: 'Password Error, unlock failed',//密码错误提示语
      showPass: false,//选择keystroe之后出现密码输入的框
      KeyStoreVal: 'Select Keystore',
      walletnNewPassError: false,//密码错误提示语是否显示
      phraseErrorText: 'Phrase error',//助记词提示语错误
      phraseError: false,//助记词提示语是否显示
    }
  },
  computed: {
    //创建钱包按钮是否激活
    createActive () {
      let pass = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,30}$/
      return this.walletName.length > 0 
             && this.walletPass1.length > 7
             && pass.test(this.walletPass1)
             && this.walletPass2 == this.walletPass1 ? true : false
    },
    
    //备份助记词按钮是否激活
    backupActive () {
      return this.agreedId ? true : false 
    },

    //导入钱包私钥按钮是否激活
    privateActive () {
      return this.walletPrivateKey.length > 63 ? true : false
    },

    //导入钱包keystore按钮是否激活
    keystoreActive () {
      let pass = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,30}$/
      return this.walletNewPass.length > 7
             && pass.test(this.walletNewPass) ? true : false
    },

    //导入钱包助记词按钮是否激活
    phraseActive () {
      return (this.walletPhrase).split(" ").length-1 > 23 ? true : false
    }
  },
  created () {
    let createId = this.$route.params.createId
    console.log(createId)
    if (createId == 0 && this.createPages == 1) {
      this.createClose = true
    } else {
      this.createClose = false
    }
  },
  mounted () {

  },
  destroyed () {},
  methods: {
    //失去焦点
    loseFocus () {
      this.passFormatShow = false
    },

    //得到焦点
    getFocus () {
      this.passFormatShow = true
    },

    //导入钱包
    importCreate () {
      this.createClose = true //进入导入钱包关闭按钮显示
      this.createPages = 3
    },

    //创建钱包
    createWallet() {
      let keys = walletsHandler.getWalletKeys() //create all keys of wallet
      let wordsArray = keys.englishWords.split(' ')
      this.itemList = []
      this.privateKey = keys.privateKey
      wordsArray.forEach((word, index)=>{
        this.itemList.push({
          id: index.toString(),
          cnt: word
        })
      })

      WalletHandler.backUpWalletIntoFile({
        walletName: this.walletName,
        privateKey: keys.privateKey,
        publicKey: keys.publicKey,
        walletAddress: keys.userAddress,
        englishWords: keys.englishWords
      })

      this.createClose = true //进入备份助记词关闭按钮显示
      this.createPages = 2
    },

    //创建钱包的关闭方法
    closeCreate () {
      let createId = this.$route.params.createId // 获取路由参数，如果 是 0 是从主页进入的 ，否则点击关闭按钮返回创建页面
      if (createId == 0 && this.createPages == 1) {
        this.$router.push({ name: 'index',params: { createId: 1 }})
      } else if (this.createPages == 2 || this.createPages == 3) {
        this.createPages = 1
      } else {
        this.createPages = 1
      }
    },
    //备份助记词成功进入钱包主页
    backupWallet () {
      this.$router.push({ name: 'index',params: { createId: 1 }})
    },

    //导入钱包
    importWallet () {
      let walletIdx = this.tabIndex // walletIdx 0 私钥导入 1 keystroe 2 助记词导入
      if (walletIdx == 0) {
        this.$router.push({ name: 'index',params: { createId: 2 }})
      } else if (walletIdx == 1) {
        this.$router.push({ name: 'index',params: { createId: 2 }})
      } else {
        this.$router.push({ name: 'index',params: { createId: 3 }})
      }
    },

    //获取input file上传文件的相关属性
    tirggerFile (event) {
      var file = event.target.files;
      if (file.length === 1) {
        this.KeyStoreVal = file[0].name
        this.showPass = true
      } else {
        this.KeyStoreVal = 'Select Keystore'
        this.walletNewPass = ''
        this.walletnNewPassErrorText = false
        this.showPass = false
      }
    },

    //备份助记词同意协议
    checkRadio () {
      this.radioIndex = !this.radioIndex
      this.agreedId = !this.agreedId
      if (this.radioIndex == 1) {
        this.radioImg = agreement
      } else {
        this.radioImg = agreements
      }
    },

    //切换导入钱包的方式
    isTab (index) {
      this.tabIndex = index
    }
  }
}
</script>

<style scoped>
  main {display: flex;height: 100vh;position: relative;}
  main aside {background: url('../../assets/images/loginBackground.png') no-repeat center;
    background-size: 100% 100%;width: 372px;}
  main .wallet-version {position: absolute;right: 28px;bottom: 24px;color: #839299;}
  main .closeImg {width: 24px;height: 24px;position: absolute;top: 50px;right: 20px;}
  main .wallet-nav {position: absolute;top: 0;right: 0;height: 30px;left: 351px;
    border-bottom: 1px solid #E5E5E5;text-align: right;}
  
  /* 创建钱包 */
  .wallet-create {padding: 142px 68px 0;flex: 1;width: 450px;}
  .wallet-create p {padding-top: 32px;}
  .wallet-create .wallet-button-create {width:190px;margin-top: 36px;}
  .wallet-create .wallet-button-important {display: inline-block;padding: 8px 12px;
    color: #0B7FE6;font-weight: 400;border:1px solid rgba(229,229,229,1);border-radius:4px;
    position: absolute;right: 68px;top: 78px;}

  /* 备份助记词 */
  .wallet-backup {padding: 124px 68px 0;flex: 1;}
  .wallet-backup .backup-title {font-size: 14px;padding-top: 0;padding-bottom: 32px;word-break: break-all;color: #EE1C39;}
  .wallet-backup .backup-title label{font-family: Lato-Bold;}
  .wallet-backup .private-key-title {padding-top: 17px;}
  .wallet-backup .private-key-contant {background:rgba(242,242,242,1);border-radius:4px;color: #252F33;font-size: 14px;
    margin-top: 10px;padding: 11px 18px;word-break: break-all;}
  .wallet-backup .wallet-button-backup {width:190px;}
  .wallet-backup .radio-content {padding: 25px 0 16px;display: flex;align-items: center;color: #252F33;}
  .wallet-backup .radio-content img {margin-right: 10px;width: 14px;height: 14px;}

  /* 导入钱包 */
  .wallet-import {padding: 148px 90px 0 104px;flex: 1;}
  .wallet-import ul {display: flex;height: 36px;line-height: 36px;color: #388ED9;font-size: 14px;}
  .wallet-import ul li {width: 130px;text-align: center;border:1px solid rgba(229,229,229,1);}
  .wallet-import ul li:first-child {border-top-left-radius: 4px;border-right: 0;border-bottom-left-radius: 4px;}
  .wallet-import ul li:last-child {border-top-right-radius: 4px;border-left: 0;border-bottom-right-radius: 4px;}
  .wallet-import ul .check-li {background:linear-gradient(90deg,rgba(66,145,255,1) 0%,rgba(11,127,230,1) 100%);color: #fff;}
  .wallet-import button {width: 190px!important;margin-top: 48px;}
  .wallet-import .go-create {color: #576066;padding-top: 28px;}
  .wallet-import .go-create span {color: #29D893;}
  .wallet-import textarea {border: 1px solid #E6E6E6;border-radius: 4px;height: 58px;color: #252F33;
    padding: 24px;outline: none;resize: none;flex: 1;margin-top: 32px;font-size: 14px;overflow: auto;
    font-family: Lato-Regular;}
  .wallet-import textarea::-webkit-scrollbar {display: none;}

  /* 导入钱包 -- 私钥导入 */
  .wallet-import-private-key,.wallet-import-keystore,
  .wallet-import-phrase {display: flex;flex-direction: column;}
  
  /* 导入钱包 -- keyStore导入 */
  .wallet-import-keystore p {font-size: 14px;color: #839299;font-family: Lato-Bold;}
  .wallet-import-keystore .wallet-import-keystore-title {margin: 32px 0 12px;}
  .wallet-import-keystore div {flex: 1;background:rgba(242,242,242,1);border-radius:4px;padding-left: 16px;
    color: #42535B;font-size: 14px;margin-bottom: 20px;text-align: center;height: 36px;line-height: 36px;
    position: relative;}
  .wallet-import-keystore div input[type='file'] {position: absolute;top: 0;left: 0;right: 0;bottom: 0;
    height: 36px;z-index: 2;width: 100%;opacity: 0;}
</style>