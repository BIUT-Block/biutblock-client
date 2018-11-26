<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height v-if= "!busy">
        <v-layout justify-center align-center>
          <v-flex xs12 sm10 md8>
            <v-card class="elevation-12">   
              <v-card-text>
                <v-form>
                  <v-layout row align-center justify-space-between>
                  <v-flex>
                    <v-text-field id="inputFile" v-model = "inputFilePath" prepend-icon="attach_file" name="input" label="请选择密钥文件" type="text"></v-text-field>
                  </v-flex>            
                  <v-btn round color="primary" v-on:click = "$refs.file.click()">导入密钥文件</v-btn>
                  </v-layout>
                  <v-text-field id="password" v-model = "password" prepend-icon="lock" name="password" label="密码" type="password"></v-text-field>
                  <input type="file" ref="file" style="display:none" v-on:change="processFile($event)">
                </v-form>
              </v-card-text>
              <v-card-text v-if = "loginError">
                <v-alert :value="loginError" type="error" transition="scale-transition">
                  密钥错误。请检查错误。
                </v-alert>
              </v-card-text>
              <v-card-text v-if = "tokenExpire">
                <v-alert :value="tokenExpire" type="error" transition="scale-transition">
                  登录状态超市。请重新登录。
                </v-alert>
              </v-card-text>
              <v-card-actions>
                <v-dialog v-model="forgetDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
                  <v-btn flat small class="caption" slot="activator" dark color="primary"><u>找回密钥?</u></v-btn>
                  <v-card>
                    <v-toolbar dark color="primary">
                      <v-btn icon dark @click.native="forgetDialogClose">
                        <v-icon>关闭</v-icon>
                      </v-btn>
                      <v-toolbar-title>恢复您的密钥</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-toolbar-items v-if= "retrievedSuccess">
                        <v-btn dark flat @click.native="onRetrPwdSet">确认密码</v-btn>
                      </v-toolbar-items>                        
                      <v-toolbar-items v-else>
                        <v-btn dark flat @click.native="onRetrieveKey">发送</v-btn>
                      </v-toolbar-items>                  
                    </v-toolbar>
                    <v-card-text>
                      <v-container grid-list-md>
                        <v-layout wrap>
                          <v-flex xs12 v-if= "retrievedSuccess">
                            <v-text-field v-model= "forgetInfo.password" label="请输入钱包密码" type="password" rquired></v-text-field>
                          </v-flex>
                          <v-flex xs12 v-if= "retrievedSuccess">
                            <v-text-field v-model= "forgetInfo.repeatPassword" label="请重复钱包密码" type="password" required></v-text-field>
                          </v-flex>
                          <v-flex xs12 v-else>
                            <v-text-field v-model= "forgetInfo.userKeyWord" label="请按顺序输入助记词" required></v-text-field>
                          </v-flex>
                        </v-layout>       
                      </v-container>
                      <v-divider></v-divider>
                      <v-alert :value="retrievedError" type="error" transition="scale-transition">
                        回复密钥错误。您输入的助记词有错。
                      </v-alert>
                      <v-alert :value="retrievedSuccess" type="success" transition="scale-transition">
                        助记词正确。请重设密码。
                      </v-alert>
                      <v-alert :value="retrKeyPwdError" type="error" transition="scale-transition">
                        两次输入密码不一致！
                      </v-alert>
                      <v-alert :value="retrKeyPwdSuccess" type="success" transition="scale-transition">
                        找回密钥文件成功。您将登陆界面。
                      </v-alert>             
                    </v-card-text>
                  </v-card>
                </v-dialog>
                <v-spacer></v-spacer>
                <v-btn flat round class="font-weight-bold" color="primary" v-on:click = "onLoginClick">登录</v-btn>
                <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
                  <v-btn flat round class="font-weight-bold" slot="activator" dark color="primary">创建用户钱包</v-btn>
                  <v-card>
                    <v-toolbar dark color="primary">
                      <v-btn icon dark @click="dialog = false">
                        <v-icon>关闭</v-icon>
                      </v-btn>
                      <v-toolbar-title>创建您的钱包</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-toolbar-items>
                        <v-btn dark flat @click.native="onCreateAccount">创建钱包</v-btn>
                      </v-toolbar-items>
                    </v-toolbar>
                    <v-card-text>
                      <v-container grid-list-md>
                        <v-layout wrap>
                          <v-flex xs12 v-if="false">
                              <v-text-field v-model="newUserAccount.walletName" label="请输入钱包名字" rquired></v-text-field>
                          </v-flex>
                          <v-flex xs12>
                            <v-text-field v-model="newUserAccount.password" label="请输入钱包密码" type="password" rquired></v-text-field>
                          </v-flex>
                          <v-flex xs12>
                            <v-text-field v-model="newUserAccount.repeatPassword" label="请重复钱包密码" type="password" required></v-text-field>
                          </v-flex>
                        </v-layout>       
                      </v-container>
                      <v-divider></v-divider>
                      <v-alert :value="createAccountSuccess" type="success" transition="scale-transition">
                        请记住您随机产生的英文单词以及顺序。以便忘记密钥时，可以通过英文单词回复密钥。
                      </v-alert>
                      <v-alert :value="newAccPwdError" type="error" transition="scale-transition">
                        两次输入密码不一致！
                      </v-alert>
                      <v-flex v-if= "createAccountSuccess">{{englishWords}}</v-flex>
                      <v-divider></v-divider>
                        <qr-code v-if="createAccountSuccess" value="privateKey" :size="80">
                          <span>{{privateKey}}</span>
                          <span><v-btn v-clipboard:copy="privateKey" v-clipboard:success="onPrivateKeyCopy" small color="primary">复制</v-btn></span>
                        </qr-code>
                      <v-btn color="success" v-if="createAccountSuccess" @click="confirmCreateWallet = true">已备份好 进入钱包</v-btn>
                      <v-flex v-if= "createAccountError">创建用户失败 请重新尝试</v-flex>
                    </v-card-text>
                  </v-card>
                </v-dialog>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
      <v-dialog persistent v-model= "busy" max-width= "200px">
        <v-card>
          <v-card-text>
            <div class="text-xs-center">
            <v-progress-circular :size="50" :width="7" color="purple" indeterminate></v-progress-circular>
            </div>
            </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog persistent v-model="confirmCreateWallet" max-width="300px">
        <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>提示</v-card-title>
        <v-card-text>
          请务必备份好你的助记词和私钥，如果助记词和私钥丢失，则你将永久失去你的资产。
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
           <v-btn color="primary" flat @click="confirmCreateWallet = false">
            没记住
          </v-btn>
          <v-btn color="primary" flat @click="onConfirmCreateWallet">
            记住了, 进入钱包
          </v-btn>
        </v-card-actions>
      </v-card>
      </v-dialog>
    </v-content>
  </v-app>
</template>


<script>
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
import QrCode from './QrCode'
const SECUtil = require('@sec-block/secjs-util')
const jwt = require('jsonwebtoken')
const CryptoJS = require("crypto-js")
const fs = require("fs")

const secUtil = new SECUtil()
const reader = new FileReader()
Vue.use(VueClipboard)
export default {
  components: {
    QrCode
  },
  data: () => ({
    dialog: false,
    forgetDialog: false,
    busy: false,
    drawer: null,
    inputFilePath: '',
    inputFile: null,
    password: '',
    privateKey: '',
    loginError: false,
    tokenExpire: false,
    createAccountError: false,
    createAccountSuccess: false,
    newAccPwdError: false,
    retrievedError: false,
    retrievedSuccess: false,
    retrKeyPwdError: false,
    retrKeyPwdSuccess: false,
    forgetInfo: {
      userKeyWord: '',
      privateKey: '',
      pubKey128ToString: '',
      userAddressToString: '',
    },
    newUserAccount: {
      walletName: '',
      password: '',
      repeatPassword: ''
    },
    englishWords: '',
    decoded: '',
    pubKey128ToString: '',
    confirmCreateWallet: false,
    userToken: ''
  }),

  created() {
    this.busy = true
    let token = window.localStorage.getItem('userToken')
    let decoded, filePath

    if(require('os').type() === 'Darwin' || require('os').type() === 'Linux') {
      filePath = require('os').homedir() + '/.secwallet/default.data'
    } else {
      filePath = require('os').homedir() + '\\.secwallet\\default.data'
    }
    setTimeout(() => {
      if (fs.existsSync(filePath)) {
        if(token) {
          this.busy = false
          decoded = this.$JWT.verifyToken(token)
          fs.readFile(filePath, 'utf-8', this._loginWithToken.bind(this, decoded))
          this.inputFilePath = filePath
        }
        else {
          this.inputFilePath = filePath
        } 
      }
      this.busy = false
    }, 500)
  },

  methods: {
    processFile: function(event) {
      this.inputFile = event.target.files[0]
      this.inputFilePath = this.inputFile.path
    },

    _loginWithToken: function(decoded, err, data){
      try {
        let keyData = CryptoJS.AES.decrypt(data.toString(), decoded.password).toString(CryptoJS.enc.Utf8)
        let keyDataJSON = JSON.parse(keyData)
        this.$JsonRPCClient.client.request('getBalance', {address: keyDataJSON.walletAddress}, (err, response) => {
          if (response.result.info === 'Invalid Token') {
            this.loginError = true
          } else if (response.result.info === 'no previous transactions found'){
            this._navToAccountDetail({
              publicKey: keyDataJSON.publicKey,
              walletAddress: keyDataJSON.walletAddress,
              walletBalance: '10'
            })
          } else {
            this._navToAccountDetail({
              publicKey: keyDataJSON.publicKey,
              walletAddress: keyDataJSON.walletAddress,
              walletBalance: response.result.balance.toString()
            }) 
          }
        })
      } catch(e) {
        this.tokenExpire = true
      }
    },

    onLoginClick: function(oEvent){
      this.tokenExpire = false
      this.loginError = false
      fs.readFile(this.inputFilePath, 'utf-8', this._fileRequest.bind(this, this.password))
    },

    _fileRequest: function(password, err, data){
        if (err) {
          this.createAccountError = true
          return
        }
        try {
          let keyData = CryptoJS.AES.decrypt(data.toString(), password).toString(CryptoJS.enc.Utf8)
          let keyDataJSON = JSON.parse(keyData)
          this.privateKey = keyDataJSON.privateKey
        if (this.privateKey !== "") {
          this._userAuthRequest(keyDataJSON, password)
        }} catch(e) {
          this.loginError = true
        }
      /*
      reader.onload = event => this._fileRequest(event)
      reader.onerror = error => reject(error)
      reader.readAsText(this.inputFile)
      */
    },

    /*
    _fileRequest: function(event){
      let resultArr = event.target.result.split(/\r?\n/)
      this.username = resultArr[0]
      this.password = resultArr[1]
      //console.log(this.username, this.password)
      if (this.username !== "" && this.password !== "") {
        this._userAuthRequest()
      }
    },
    */
    _userAuthRequest: function(keyDataJSON, password){
      let tokenInfo = {
        password: password
      }

      let token = jwt.sign(tokenInfo, 'MongoX-Block', {
        /**
         * setting token aktiv time
         */
        'expiresIn': 60 * 60 * 24
      })

      window.localStorage.setItem('userToken', token)
      this.$JsonRPCClient.client.request('getBalance', {address: keyDataJSON.walletAddress}, (err, response) => {
        if(response.result.info === 'InvalidToken') {
          this.loginError = true
        } else if (response.result.info == 'no previous transactions found') {
          this.busy = false
          this._navToAccountDetail({
            publicKey: keyDataJSON.publicKey,
            walletAddress: keyDataJSON.walletAddress,
            walletBalance: '10'
          })
        } else {
          this.busy = false
          this._navToAccountDetail({
            publicKey: keyDataJSON.publicKey,
            walletAddress: keyDataJSON.walletAddress,
            walletBalance: response.result.balance.toString()
          })
        }
      })     
    },

    _navToAccountDetail: function(params) {
      this.$router.push({
        name: 'user-account',
        params: {walletAddress: params.walletAddress, walletPublicKey: params.publicKey, walletBalance: params.walletBalance}
      })
    },

    onRetrieveKey: function(oEvent) {
      this.busy = true
      try{
        this.forgetInfo.privateKey = secUtil.mnemonicToEntropy(this.forgetInfo.userKeyWord)
        let privKey64Buffer = Buffer.from(this.forgetInfo.privateKey, 'hex')

        let pubKey128 = secUtil.privateToPublic(privKey64Buffer)
        this.forgetInfo.pubKey128ToString = pubKey128.toString('hex')

        let userAddressBuffer = secUtil.publicToAddress(pubKey128, true)
        // let userAddress = userAddressBuffer.toString('hex')
        this.forgetInfo.userAddressToString = secUtil.bufferToHex(userAddressBuffer)
        this.busy = false
        this.retrievedError = false
        this.retrievedSuccess = true
      } catch(e) {
        this.busy = false
        this.retrievedSuccess = false
        this.retrievedError = true
      }
    },

    onRetrPwdSet: function(oEvent) {
      if (this.forgetInfo.password !== this.forgetInfo.repeatPassword) {
        this.retrKeyPwdError = true
        return
      }
      // save to local file
      let dirPath = require('os').homedir() + '\\.secwallet'
      if (!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath);
      }
      let keyFileData = JSON.stringify({
        privateKey: this.forgetInfo.privateKey,
        publicKey: this.forgetInfo.pubKey128ToString,
        walletAddress: this.forgetInfo.userAddressToString
      })
      let cipherKeyData = CryptoJS.AES.encrypt(keyFileData, this.newUserAccount.password)
      fs.writeFile(dirPath+'\\default.data', cipherKeyData, function(err){
        if(err) {
          this.retrievedError = true
          return
        }
      })
      this.inputFilePath = dirPath+'\\default.data'
      this.retrKeyPwdError = false
      this.retrKeyPwdSuccess = true
      setTimeout(this.forgetDialogClose, 2000);
    },

    forgetDialogClose: function(oEvent) {
      this.forgetDialog = false
      this.retrievedError = false
      this.retrievedSuccess = false
      this.retrKeyPwdError = false
      this.retrKeyPwdSuccess = false
    },

    onCreateAccount: function(oEvent) {
      if (this.newUserAccount.password !== this.newUserAccount.repeatPassword) {
        this.newAccPwdError= true
        return
      }

      secUtil.generatePrivateKey()
      let privKey64 = secUtil.getPrivateKey()
      this.privateKey = privKey64
      let privKey64Buffer = Buffer.from(privKey64, 'hex')

      let englishWord = secUtil.entropyToMnemonic(privKey64)

      let pubKey128 = secUtil.privateToPublic(privKey64Buffer)
      this.pubKey128ToString = pubKey128.toString('hex')

      let userAddressBuffer = secUtil.publicToAddress(pubKey128, true)
      let userAddress = userAddressBuffer.toString('hex')
      this.userAddressToString = secUtil.bufferToHex(userAddressBuffer)
      let userAddressChecksumString = secUtil.toChecksumAddress(this.userAddressToString)

      let tokenInfo = {
        password: this.newUserAccount.password
      }

      let token = jwt.sign(tokenInfo, 'MongoX-Block', {
        /**
         * setting token aktiv time
         */
        'expiresIn': 60 * 60 * 24
      })
      this.decoded = this.$JWT.verifyToken(token)
      if (this.decoded === '') {
            this.createAccountError = true
      } else {
        // save to local file
        this.userToken = token
        let dirPath = require('os').homedir() + '/.secwallet'
        if (!fs.existsSync(dirPath)){
          fs.mkdirSync(dirPath);
        }
        let keyFileData = JSON.stringify({
          privateKey: privKey64,
          publicKey: this.pubKey128ToString,
          walletAddress: this.userAddressToString
        })
        let cipherKeyData = CryptoJS.AES.encrypt(keyFileData, this.newUserAccount.password)
        fs.writeFile(dirPath+'/default.data', cipherKeyData, (err) => {
          if(err) {
            this.createAccountError = true
            this.dialog = true
            return
          }
          this.createAccountSuccess = true
          this.englishWords = englishWord
        })
      }
    },
    onConfirmCreateWallet: function() {
      this.confirmCreateWallet = false
      window.localStorage.setItem('userToken', this.userToken)
      this.$JsonRPCClient.client.request('getBalance', {address: this.userAddressToString}, (err, response) => {
        if (response.result.info === 'Invalid Token') {
          this.createAccountError = true
          return
        } else if (response.result.info === 'no previous transactions found'){
          this._navToAccountDetail({
            publicKey: this.pubKey128ToString,
            walletAddress: this.userAddressToString,
            walletBalance: '10'
          })
        } else {
          this._navToAccountDetail({
            publicKey: this.pubKey128ToString,
            walletAddress: this.userAddressToString,
            walletBalance: response.result.balance.toString()
          })
        }
      })
    },

    onPrivateKeyCopy: function(e) {
      alert(`已复制您的私钥: ${e.text}`)
    }

  }
}
</script> 