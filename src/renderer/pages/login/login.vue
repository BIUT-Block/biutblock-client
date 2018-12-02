<template>
  <el-container class="layoutCnt">
    <el-row>
      <el-col :span="24">
        <section class="mainCnt">
           <section class="mainCntLeft">
             <img src="../../assets/image/loginLogo.png" alt="sec-logo">
           </section>
           
           <section class="mainCntRight">
              <section class="loginClose">
                <i class="el-icon-minus icon_nav" @click="minimalApp"></i>
                <i class="el-icon-close icon_nav" @click="exitApp"></i>
              </section>
              <h1 class="loginTit">Private key login</h1>
              <input v-model="loginValue"  maxlength="64" class="loginIpt" placeholder="Please enter the private key"></input>
              <button type="button" class="publicBtn" :disabled="!publicBtnAcitve" :class="publicBtnAcitve?'publicBtnAcitve':''" @click="loginBtn">Log in</button>

              <section class="errorCnt">
                <p v-if="errorTxt" class="errorTxt">Wrong private key format</p>
              </section>

              <p class="loginTxt">No wallet? <router-link to="create?id=1" tag="span" class="TxtColor pointerTxt">Click here to create a new</router-link></p>
           </section>
        </section>
      </el-col>
    </el-row>
  </el-container> 
 
</template>

<script>
const fs = require("fs")
const CryptoJS = require("crypto-js")
const jwt = require('jsonwebtoken')
const {ipcRenderer: ipc} = require('electron')

export default {
  name: '',
  data() {
    return {
      errorTxt: false,
      loginValue: '',
      privateKey: '',
      publicKey: '',
      walletAddress: ''
    }
  },
  methods: {
    loginBtn () { // 登陆方法
      let filePath = ''
      if(require('os').type() === 'Darwin' || require('os').type() === 'Linux') {
        filePath = require('os').homedir() + '/secwallet/default.data'
      } else {
        filePath = require('os').homedir() + '\\secwallet\\default.data'
      }
      if (this.loginValue == '') {
        this.errorTxt = true
      } else {
        fs.readFile(filePath, 'utf-8', this._fileRequest.bind(this, this.loginValue))
        //登陆成功跳转至下一页
        //this.$router.push({ path: '/create?id=1' })

        //登陆失败
        //this.errorTxt = true  展示错误的信息，不做任何跳转
      }
    },
    _fileRequest: function(loginValue, err, data){
        if (err) {
          return
        }
        try {
          let keyData = CryptoJS.AES.decrypt(data.toString(), loginValue).toString(CryptoJS.enc.Utf8)
          let keyDataJSON = JSON.parse(keyData)
          this.privateKey = keyDataJSON.privateKey
        if (this.privateKey !== "") {
          this._userAuthRequest(keyDataJSON, loginValue)
        }} catch(e) {
          this.errorTxt = true
        }
    },
    _userAuthRequest: function(keyDataJSON, loginValue) {
      let tokenInfo = {
        password: loginValue
      }

      let token = jwt.sign(tokenInfo, 'MongoX-Block', {
        'expiresIn': 60 * 60 * 24
      })

      window.localStorage.setItem('userToken', token)
      this.$JsonRPCClient.client.request('sec_getBalance', [keyDataJSON.walletAddress], (err, response) => {
        console.log(response)
        if(response.result.status === 'false') {
          this.loginError = true
        } else if (response.result.status == '0') {
          this._navToAccountDetail({
            privateKey: keyDataJSON.privateKey,
            publicKey: keyDataJSON.publicKey,
            walletAddress: keyDataJSON.walletAddress,
            walletBalance: response.result.value.toString()
          })
        } else if (response.result.status === '1') {
          this._navToAccountDetail({
            privateKey: keyDataJSON.privateKey,
            publicKey: keyDataJSON.publicKey,
            walletAddress: keyDataJSON.walletAddress,
            walletBalance: response.result.value.toString()
          })
        }
      })     
    },
    _navToAccountDetail: function(params) {
      this.$router.push({
        name: 'wallet',
        query: {walletAddress: params.walletAddress, walletPrivateKey: params.privateKey, walletPublicKey: params.publicKey, walletBalance: params.walletBalance}
      })
    },
    exitApp: function() {
      ipc.send('close')
    },
    minimalApp: function() {
      ipc.send('min')
    }
  },
  computed: {
    publicBtnAcitve () {
      return this.loginValue.length > 7 ? true : false
    }
   },
  watch: {
    //  loginValue (val) {
    //   var x = /^[A-Za-z0-9]+$/
    //   if(!x.test(val)){
    //     this.loginValue = ''
    //   }
    //  }
  }
}
</script>

<style scoped>
.layoutCnt {background: #fff;display: flex;height: 100vh;justify-content: center;align-items: center;}

.mainCnt {background: #FFFFFF;height: 400px;width: 640px;display: flex;border: 1px solid #ccc;position: relative;}
.mainCntLeft {width: 248px;height: 400px;background: url('../../assets/image/loginBk.png') no-repeat;
background-size: cover;display: flex;justify-content: center;align-items: center;}
.mainCntRight {flex: 1;height: 400px;display: flex;justify-content: center;align-items: center;
flex-direction: column;}

.loginClose {position: absolute;top:20px;right:20px;}

.loginTit {color: #242E49;font-size: 24px;font-weight:400;}
.loginTxt {margin-top: 75px;color: #657292;}
.errorCnt {height: 20px;width:100%;text-align: center;}
.errorTxt {color: #FF8DB2;margin-top: 12px;}
.loginIpt {width: 300px;height: 36px;margin: 43px 0 47px;outline: none;border:1px solid #C8D1DA;text-align: center;}
</style>