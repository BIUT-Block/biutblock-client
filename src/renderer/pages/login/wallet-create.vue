<template>
  <main>
    <aside>
      <img src="../../assets/images/loginLogo.png" alt="" title="SEC"/>
      <h2 class="titleTop">{{ createTitle1 }}</h2>
      <h2>{{ createTitle2 }}</h2>
      <span></span>
    </aside>
    <!-- <section class="wallet-nav">
      <wallet-nav/>
    </section> -->
    <img src="../../assets/images/closeImg.png" v-show="createClose" title="close" class="closeImg" @click="closeCreate"/>
    <!-- 创建钱包 createPages == 1 -->
    <section class="wallet-create" v-if="createPages == 1">
      <span class="wallet-button-important" @click="importCreate">Import Wallet</span>
      <wallet-title :title="walletNameText" :choose="true"/>
      <wallet-input type="text" placeholder="Wallet Name" maxlength="14" v-model.trim="walletName"></wallet-input>
      <wallet-title :title="walletPassText1" :choose="true"/>
      <wallet-input-pass placeholder="Password" maxlength="30" 
          v-model="walletPass1"
          @loseFocus="loseFocus"
          @getFocus="getFocus"></wallet-input-pass>
      <wallet-tips :tips="passFormat"  v-show="passFormatShow"/>
      <wallet-title :title="walletPassText2" :choose="true"/>
      <wallet-input-pass placeholder="Confirm Password" maxlength="30" 
          v-model="walletPass2"
          @loseFocus="loseFocus2"></wallet-input-pass>
      <wallet-tips :tips="passFormat2"  v-show="passFormat2Show"/>
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
        <span id="privateKeyText">{{ privateKey }}</span>
        <img src="../../assets/images/copy.png" alt="" 
              @click="copyPrivateKey" 
              data-clipboard-target="#privateKeyText" 
              class="copyButton"/>
      </section>
      <wallet-translucent :text="copyText" v-show="copyShow"/>
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
        <wallet-input placeholder="Wallet Name" maxlength="14" v-model.trim="walletNameImport1"></wallet-input>
        <textarea placeholder="Eenter your private key here" 
            maxlength="64" 
            v-model="walletPrivateKey"
            onkeyup="this.value=this.value.replace(/\s+/g,'')">
        </textarea>
        <wallet-tips :tips="privateKeyErrorText" v-show="privateKeyError"/>
        <wallet-button  class="wallet-button-backup" 
                      :text="walletImportButton"
                      @click.native="importWallet"
                      :disabled="!privateActive"
                      :class="privateActive?'passCorrect':''"/>
      </section>

      <!-- keystore导入 -->
      <section class="wallet-import-keystore" v-show="tabIndex == 1">
         <p class="wallet-import-keystore-title">Select your Keystore</p>
         <div>
           <span :class="KeyStoreColor?'KeyStoreColor':''">{{KeyStoreVal}}</span>
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
        <wallet-input placeholder="Wallet Name" maxlength="14" v-model.trim="walletNameImport2"></wallet-input>
        <textarea placeholder="Enter your Phrase here width space-separated" v-model="walletPhrase"></textarea>
        <wallet-tips :tips="phraseErrorText" v-show="phraseError"/>
        <wallet-button  class="wallet-button-backup" 
                      :text="walletImportButton"
                      @click.native="importWallet"
                      :disabled="!phraseActive"
                      :class="phraseActive?'passCorrect':''"/>
      </section>

     <p class="go-create">No wallet?   <span @click="closeCreate">Create Wallet</span></p> 
    </section>
    <!-- 钱包版本号 -->
    <span class="wallet-version"> {{ versionNumber }}</span>
    <!-- 遮罩层 -->
    <section class="mask" v-show="maskShow">
      <section class="mask-container phrase-mask">
        <img
          src="../../assets/images/closeMask.png"
          alt=""
          class="maskCloseImg"
          title="close"
          @click="maskShow = false"
        />
        <section class="phrase-mask-body">
          <p>This is a new wallet, are you confirm to import and save it locally?</p>
          <button type="button"  @click="_navToNext">Confirm</button>
        </section>
      </section>
    </section>
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
import walletTranslucent from '../../components/wallet-translucent'
import Clipboard from 'clipboard'
import walletsHandler from '../../lib/WalletsHandler'
import WalletHandler from '../../lib/WalletsHandler'
const fs = require('fs')
const pkg = require('../../../../package.json')

export default {
  name: 'walletCreate',
  components: {
    walletTitle,
    walletButton,
    walletInput,
    walletInputPass,
    walletTips,
    phraseList,
    walletNav,
    walletTranslucent
  },
  props: {},
  data () {
    return {
      createTitle1: 'Create',
      createTitle2: 'New Wallet',
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
      passFormat2: 'Two passwords are inconsistent',//两次密码输入不一致
      passFormat2Show: false,//密码格式提示
      backupText1: 'PHRASE',
      backupText2: 'PRIVATE KEY',
      privateKey: '8305dcbb827255ef79f348654cd381768bd95349d330530ab33a9b2336a8f2e6',//备份助记词私钥
      walletBackupButton: 'Enter Wallet',
      radioImg: agreement,//协议按钮
      radioIndex: 1,// 1 表示默认不选择 相反选择
      agreedId: false, //备份助记词按钮默认不可点击
      itemList: [],//助记词列表
      versionNumber: '',
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
      walletNameImport1: '',
      walletNameImport2: '',
      walletPrivateKey: '',//私钥
      walletNewPass: '',//导入keystroe文件输入密码
      walletPhrase: '',//助记词
      selectedKeystorePath: '',
      walletImportButton: 'Login',
      privateKeyErrorText: 'Private Error',//私钥错误提示语
      privateKeyError: false,//私钥错误提示是否显示
      walletnNewPassText: 'Your wallet is encrypted.Good! Please enter the password',//
      walletnNewPassErrorText: 'Password Error, unlock failed',//密码错误提示语
      showPass: false,//选择keystroe之后出现密码输入的框
      KeyStoreVal: 'Select Keystore',
      walletnNewPassError: false,//密码错误提示语是否显示
      phraseErrorText: 'Phrase error',//助记词提示语错误
      phraseError: false,//助记词提示语是否显示
      KeyStoreColor: true,
      copyText: 'Copy success',//私钥复制
      copyShow: false,
      maskShow: false, //助记词导入钱包提示
      navQuery: {}
    }
  },
  computed: {
    //创建钱包按钮是否激活
    createActive () {
      if (this.walletPass2 == this.walletPass1) {
        this.passFormat2Show = false
      }
      let pass = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,30}$/
      return this.walletName.trim().length > 0 
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
      return this.walletPrivateKey.trim().length > 63 ? true : false
    },

    //导入钱包keystore按钮是否激活
    keystoreActive () {
      let pass = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,30}$/
      return this.walletNewPass.trim().length > 7
             && pass.test(this.walletNewPass) ? true : false
    },

    //导入钱包助记词按钮是否激活
    phraseActive () {
      return this.walletPhrase ? true : false
    }
  },
  created () {
    let createId = this.$route.query.createId
    if ((createId == 1 && this.createPages == 1) || createId === 1) {
      this.createClose = true
    } else {
      this.createClose = false
    }
    this.versionNumber = pkg.version
    if (createId !== 1) {
      let dirPath = require('os').homedir() + '/.secwallet'
      let filePath = dirPath + '/wallets.data'
      let wallets = {}
      walletsHandler.getAllWalletsFromFile((wallets) => {
        if (JSON.stringify(wallets) !== '{}') {
            this.$router.push({
              name: 'walletIndex',
              query: {
                wallets: wallets,
                selectedPrivateKey: Object.keys(wallets)[0]
              }
          })
        } 
      })
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

    //确认密码失去焦点
    loseFocus2 () {
      this.passFormat2Show = true
      if (this.walletPass1 == this.walletPass2) {
        this.passFormat2Show = false
      }
    },

    //导入钱包
    importCreate () {
      this.createClose = true //进入导入钱包关闭按钮显示
      this.createPages = 3
      this.createTitle1 = 'Import'
      this.createTitle2 = 'Wallet'
    },

    //创建钱包
    createWallet() {
      this.keys = walletsHandler.getWalletKeys() //create all keys of wallet
      let wordsArray = this.keys.englishWords.split(' ')
      let keyDataJSON = {}
      this.itemList = []
      this.privateKey = this.keys.privateKey
      wordsArray.forEach((word, index)=>{
        this.itemList.push({
          id: index.toString(),
          cnt: word
        })
      })
      keyDataJSON[this.keys.privateKey] = {
        walletName: this.walletName,
        privateKey: this.keys.privateKey,
        publicKey: this.keys.publicKey,
        walletAddress: this.keys.userAddress,
        englishWords: this.keys.englishWords
      }
      WalletHandler.saveKeyStore(`SEC${this.keys.privateKey}`, keyDataJSON, this.walletPass1)

      this.createClose = true //进入备份助记词关闭按钮显示
      this.createPages = 2
      this.createTitle1 = 'Wallet'
      this.createTitle2 = 'Created!'
    },

    //创建钱包的关闭方法
    closeCreate () {
      let createId = this.$route.query.createId // 获取路由参数，如果 是 1 是从主页进入的 ，否则点击关闭按钮返回创建页面
      if (createId === 1 && this.createPages === 1) {
        this.$router.push({name: 'walletIndex', query: {wallets: this.$route.query.wallets, selectedPrivateKey: this.$route.query.selectedPrivateKey}})
      } else if (this.createPages == 2 && createId == 1  || this.createPages == 3  && createId == 1) {
        this.createPages = 1
        this.createTitle1 = 'Create'
        this.createTitle2 = 'New Wallet'
        this.walletNameImport1 = ''
        this.walletPrivateKey = ''
        this.showPass = false
        this.walletNameImport2 = ''
        this.walletPhrase = ''
        this.KeyStoreVal = 'Select Keystore'
        this.walletNewPass = ''
        this.walletnNewPassError = false
        this.KeyStoreColor = true
        this.radioIndex = 1
        this.agreedId = false
        this.radioImg = agreement
        this.walletName = ''
        this.walletPass1 = ''
        this.walletPass2 = ''
      } else {  //其他就是创建钱包
        this.createPages = 1
        this.createClose = false
        this.createTitle1 = 'Create'
        this.createTitle2 = 'New Wallet'
        this.walletNameImport1 = ''
        this.walletPrivateKey = ''
        this.showPass = false
        this.walletNameImport2 = ''
        this.walletPhrase = ''
        this.KeyStoreVal = 'Select Keystore'
        this.walletNewPass = ''
        this.walletnNewPassError = false
        this.KeyStoreColor = true
        this.radioIndex = 1
        this.agreedId = false
        this.radioImg = agreement
        this.walletName = ''
        this.walletPass1 = ''
        this.walletPass2 = ''
      }
    },

    //复制私钥
    copyPrivateKey () {
      var clipboard = new Clipboard('.copyButton')
      this.copyShow = true
      clipboard.on('success', e => {
          clipboard.destroy()
          setTimeout(() => {
            this.copyShow = false
          }, 3000)
      })
      clipboard.on('error', e => {
          this.copyText = "Copy the failure"
          setTimeout(() => {
              this.copyShow = false
          }, 3000)
          clipboard.destroy()
      })
    },

    //备份助记词成功进入钱包主页
    backupWallet () {
      WalletHandler.backUpWalletIntoFile({
        walletName: this.walletName,
        privateKey: this.keys.privateKey,
        publicKey: this.keys.publicKey,
        walletAddress: this.keys.userAddress,
        englishWords: this.keys.englishWords
      }, (keyDataJSON) => {
        window.sessionStorage.setItem("selectedPrivateKey", this.keys.privateKey)
        this.$router.push({name: 'walletIndex', query: {wallets: keyDataJSON, selectedPrivateKey: this.keys.privateKey}})
      })
    },

    //导入钱包
    importWallet () {
      let walletIdx = this.tabIndex // walletIdx 0 私钥导入 1 keystroe 2 助记词导入

      if (walletIdx == 0) {
        if (this.walletNameImport1 === '' || this.walletNameImport1.trim().length === ' ' || this.walletNameImport2 === '' || this.walletNameImport2.trim().length === ' ') {
          this._importNameError(0)
          return
        } 
        walletsHandler.importWalletFromPrivateKey(this.walletPrivateKey, this.walletNameImport1, (wallets, selectedPrivateKey) => {
          if (wallets === 'error') {
            this.privateKeyError = true
          } else if (wallets === 'DuplicateKey') {
            this.privateKeyErrorText = 'Wallet already exisits or imported.'
            this.privateKeyError = true
          } else {
            window.sessionStorage.setItem("selectedPrivateKey", selectedPrivateKey)
            this.$router.push({ name: 'index',query: { wallets: wallets, selectedPrivateKey: selectedPrivateKey}})
          }
        })
      } else if (walletIdx == 1) {
        WalletHandler.decryptKeyStoreFile(this.selectedKeystorePath, this.walletNewPass, (wallets, selectedPrivateKey) => {
          if (wallets === 'error') {
            this.walletnNewPassError = true
          } else if (wallets === 'DuplicateKey'){
            this.walletnNewPassErrorText = 'Wallet already exists or imported.'
            this.walletnNewPassError = true
          } else {
            window.sessionStorage.setItem("selectedPrivateKey", selectedPrivateKey)
            this.$router.push({ name: 'index',query: { wallets: wallets, selectedPrivateKey: selectedPrivateKey}})
          }
        }) 
      } else {
        WalletHandler.importWalletFromPhrase(this.walletPhrase, this.walletNameImport2, (wallets, selectedPrivateKey) => {
            if (wallets === 'error') {
              this.phraseErrorText = true
            } else if (wallets === 'DuplicateKey') {
              this.phraseErrorText = true
              this.phraseErrorText = 'Wallet already exists or imported.'
            } else {  
              this.maskShow = true
              this.navQuery = {
                wallets: wallets,
                selectedPrivateKey: selectedPrivateKey
              }
            }
        })
      }
    },

    _navToNext () {
      this.maskShow = false
      window.sessionStorage.setItem("selectedPrivateKey", this.navQuery.selectedPrivateKey)
      this.$router.push({ name: 'index',query: { wallets: this.navQuery.wallets, selectedPrivateKey: this.navQuery.selectedPrivateKey}})
    },

    _importNameError (index) {
      switch (index) {
        case 0:
          this.privateKeyErrorText = 'No empty wallet name'
          this.privateKeyError = true
          break
        case 1:
          this.walletnNewPassErrorText = 'No empty wallet name'
          this.walletnNewPassError = true
          break
        case 2:
          this.phraseErrorText = 'No empty wallet name'
          this.phraseError = true
          break
      }
    },

    //获取input file上传文件的相关属性
    tirggerFile (event) {
      var file = event.target.files;
      if (file.length === 1) {
        this.KeyStoreVal = file[0].name
        this.selectedKeystorePath = file[0].path
        this.showPass = true
        this.KeyStoreColor = false
      } else {
        this.KeyStoreVal = 'Select Keystore'
        this.walletNewPass = ''
        this.walletnNewPassError = false
        this.showPass = false
        this.KeyStoreColor = true
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
      // this.walletNameImport1 = ''
      // this.walletNameImport2 = ''
      // this.walletPrivateKey = ''
      // this.walletPhrase = ''
      this.tabIndex = index
    }
  }
}
</script>

<style scoped>
  main {display: flex;height: 100vh;position: relative;}
  main aside {background: url('../../assets/images/loginBackground.png') no-repeat center;
    background-size: 100% 100%;width: 372px;}
  main aside img {margin: 32px 0 0 24px;width: 64px;height: 25px;}
  main aside h2 {color: #fff;font-size: 32px;margin: 0;padding-left: 64px;
    font-family: 'Montserrat-SemiBold';}
  main aside .titleTop {margin-top: 155px;}
  main aside span {display: block;width:43px;height:10px;background:rgba(255,255,255,1);
    margin-top: 16px;margin-left: 64px;}
  
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
  .wallet-backup .private-key-contant img {margin-left: 20px;vertical-align: middle;}
  .wallet-backup .private-key-contant img:hover {cursor: pointer;}
  .wallet-backup .wallet-button-backup {width:190px;}
  .wallet-backup .radio-content {padding: 25px 0 16px;display: flex;align-items: center;color: #252F33;}
  .wallet-backup .radio-content img {margin-right: 10px;width: 14px;height: 14px;}

  /* 导入钱包 */
  .wallet-import {padding: 148px 90px 0 104px;flex: 1;}
  .wallet-import ul {display: flex;height: 36px;line-height: 36px;color: #388ED9;font-size: 14px;justify-content: space-between;}
  .wallet-import ul li {text-align: center;border:1px solid rgba(229,229,229,1);display: block;flex: 1;}
  .wallet-import ul li:first-child {border-top-left-radius: 4px;border-right: 0;border-bottom-left-radius: 4px;}
  .wallet-import ul li:last-child {border-top-right-radius: 4px;border-left: 0;border-bottom-right-radius: 4px;}
  .wallet-import ul .check-li {background:linear-gradient(90deg,rgba(66,145,255,1) 0%,rgba(11,127,230,1) 100%);color: #fff;}
  .wallet-import button {width: 190px!important;margin-top: 48px;}
  .wallet-import .go-create {color: #576066;padding-top: 28px;}
  .wallet-import .go-create span {color: #29D893;}
  .wallet-import textarea {border: 1px solid #E6E6E6;border-radius: 4px;height: 58px;color: #252F33;
    padding: 24px;outline: none;resize: none;flex: 1;margin-top: 20px;font-size: 14px;overflow: auto;
    font-family: Lato-Regular;}
  .wallet-import textarea::-webkit-scrollbar {display: none;}

  .wallet-import .KeyStoreColor {color: #29D893;}
  /* 导入钱包 -- 私钥导入 */
  .wallet-import-private-key,.wallet-import-keystore,
  .wallet-import-phrase {display: flex;flex-direction: column;}

  .wallet-import-private-key input,.wallet-import-phrase input{margin-top: 32px;}
  
  /* 导入钱包 -- keyStore导入 */
  .wallet-import-keystore p {font-size: 14px;color: #839299;font-family: Lato-Bold;}
  .wallet-import-keystore .wallet-import-keystore-title {margin: 32px 0 12px;}
  .wallet-import-keystore div {flex: 1;background:rgba(242,242,242,1);border-radius:4px;padding-left: 16px;
    color: #42535B;font-size: 14px;margin-bottom: 20px;text-align: center;height: 36px;line-height: 36px;
    position: relative;}
  .wallet-import-keystore div input[type='file'] {position: absolute;top: 0;left: 0;right: 0;bottom: 0;
    height: 36px;z-index: 2;width: 100%;opacity: 0;}

  .phrase-mask {position: relative;font-size: 14px;font-weight: 400;color: #576066;}
  .maskCloseImg {width: 16px;height: 16px;position: absolute;top: 12px;right: 20px;}
  .maskCloseImg:hover {cursor: pointer;} 
  .phrase-mask-body {padding: 44px 20px 16px 24px;text-align: right;}
  .phrase-mask-body p {text-align: left;margin-bottom: 58px;}
  .phrase-mask-body button {color: #fff;width:97px;background:linear-gradient(90deg,rgba(41,216,147,1) 0%,rgba(12,197,183,1) 100%);
    height:32px;border: 0;border-radius: 4px;}
</style>