<template>
 <el-container class="loginConter">
    <el-row>
      <el-col :span="24">
        <section class="mainCnt">
           <!-- <section class="mainCntLeft"></section> -->
           <section class="mainCntRight">
              <!-- <img src="../../assets/image/loginLogo.png" alt="secLogo" title="sec" class="secLogo"> -->
              <!-- <section class="loginClose">
                <i class="el-icon-minus icon_nav" @click="minimalApp"></i>
                <i class="el-icon-close icon_nav" @click="exitApp"></i>
              </section> -->
              <h1 class="loginTit">Login</h1>
              <input type="password" v-model="loginValue"  maxlength="30" class="loginIpt" placeholder="Please enter your password"></input>
              <button type="button" class="logoBtn pointerTxt" :disabled="!logoBtnAcitve" :class="logoBtnAcitve?'logoBtnAcitve':''" @click="loginBtn">Submit</button>
              <section class="errorCnt">
                <!-- <p v-if="errorTxt" class="errorTxt">Wrong private key format</p> -->
                <span v-if="errorTxt" class="errorTxt">Wrong password</span>
              </section>
              <p class="loginTxt">No wallet? <span class="TxtColor pointerTxt" @click="createNew">Create Wallet</span></p>
           </section>
        </section>
      </el-col>
    </el-row>
    <el-dialog
      title=""
      :visible.sync="centerDialogVisible"
      width="432px"
      :show-close = true
      :closeOnClickModal = false
      top="25vh"
      center>
      <p style="color: #939CB2;font-size:14px;text-align: center;margin-top: 60px;">
         This operation will delete all your local wallet data, 
      </p>
      <p style="color: #939CB2;font-size:14px;text-align: center;margin-top:8px;margin-bottom: 85px;">
         press confirm to continue or close the window.
      </p>
      <span slot="footer" class="dialog-footer">
        <button class="publicBtn publicBtnAcitve" @click="createNew2">Confirm</button>
      </span>
    </el-dialog>

  </el-container>
</template>

<script>
const fs = require("fs")
const CryptoJS = require("crypto-js")
const jwt = require('jsonwebtoken')
import walletsHandler from '../../lib/WalletsHandler'

export default {
  name: '',
  data() {
    return {
      errorTxt: false,
      loginValue: '',
      centerDialogVisible: false
    }
  },
  methods: {
    createNew () {
      this.centerDialogVisible = true
    },
    createNew2 () {
      this.centerDialogVisible = false
      this.$router.push(
          {
            name: 'create'
          }
        )
    },
    loginBtn () {
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
      }
    },
    _fileRequest: function(loginValue, err, data){
        if (err) {
          return
        }
        try {
          let keyData = CryptoJS.AES.decrypt(data.toString(), loginValue).toString(CryptoJS.enc.Utf8)
          let keyDataJSON = JSON.parse(keyData)
          let walletsArr = []
          let walletNamesArr = Object.keys(keyDataJSON)
          let walletInfo = {}
          for (let walletName of walletNamesArr) {
            walletInfo = keyDataJSON[walletName]
            walletInfo["walletName"] = walletName.replace(/"/g, '')
            walletsArr.push(walletInfo)
          }
          this._userAuthRequest(walletsArr, loginValue)
        } catch(e) {
          this.errorTxt = true
        }
    },
    _userAuthRequest: function(walletsArr, loginValue) {
      let walletsBalanceJS = {}
      walletsBalanceJS = this.$JsonRPCClient.getAllWalletsBalance(walletsArr)
      walletsHandler.fillUpWalletsBalance(walletsArr, walletsBalanceJS)
      this._navToAccountDetail({
        privateKey: walletsArr[0].privateKey,
        publicKey: walletsArr[0].publicKey,
        walletAddress: walletsArr[0].walletAddress,
        walletBalance: walletsArr[0].walletBalance,
        walletsArr: walletsArr,
        walletName: walletsArr[0].walletName
      })      
    },
    _navToAccountDetail: function(params) {
      this.$router.push({
        name: 'wallet',
        query: {
          walletPwd: this.loginValue, 
          walletAddress: params.walletAddress, 
          walletPrivateKey: params.privateKey, 
          walletPublicKey: params.publicKey, 
          walletBalance: params.walletBalance,
          walletsArr: params.walletsArr,
          walletName: params.walletName  
        }
      })
    }
  },
  computed: {
    logoBtnAcitve () {
      if (this.loginValue.length === 0) {
        this.errorTxt = false
      }
      return this.loginValue.length > 7 ? true : false
    },
    createActiveBtn () {
      return this.walletName.length > 0 ? true : false
    },
    publicBtnAcitve () {
      return this.mnemonicTxt.length > 0 ? true : false;
    }
   }
}
</script>

<style scoped>
.loginConter {display: flex;height: 100vh;justify-content: center;align-items: center;
 }

.mainCnt {height: 580px;width: 960px;display: flex;position: relative;}
.mainCntLeft {width: 380px;height: 580px;background: url('../../assets/image/loginBk.png') no-repeat;background-size: cover;}

.mainCntRight {flex: 1;height: 580px;display: flex;align-items: center;
flex-direction: column; background: url('../../assets/image/loginBg.png') no-repeat;background-size: cover;}
.secLogo {position: absolute;top:32px;right:34px;}
.logoBtn {width:346px;height:48px;background: #C8D1DA;color: #fff;outline: none;
border:1px solid #C8D1DA;border-radius: 4px;font-size: 14px;}
.logoBtnAcitve {background: #00D6B2;}

.loginTit {color: #657292;font-size: 22px;margin-bottom: 32px;font-weight: normal;padding-top: 150px;}
.loginTxt {margin-top: 40px;color: #657292;}
.errorCnt {height: 20px;width:100%;text-align: center;line-height: 20px;margin-top: 17px;}
.errorTxt {color: #FF8DB2;font-size: 14px;}
.loginIpt {width: 346px;height: 36px;margin-bottom:24px;outline: none;color:#657292;border:1px solid #C8D1DA;text-align: center;}

section >>> .el-dialog__title {color: #939CB2;font-size: 16px;}
section >>> .el-dialog__header {border-bottom:1px solid rgba(200,209,218,0.5);height: 47px;line-height: 47px;padding: 0;}
section >>> .el-dialog--center {height: 288px;}
section >>> .el-dialog__body {padding: 0;}
section >>> .el-dialog__footer {padding: 0;}
section >>> .el-dialog__headerbtn {top: 15px!important;right: 16px!important;}
</style>