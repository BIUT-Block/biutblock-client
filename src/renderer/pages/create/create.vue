<template>
  <el-container class="layoutCnt">
    <main style="width: 960px;height: 580px;">
      <el-row class="publicNav">
        <el-col :span="6">
          <router-link :to="returnPage">
            <i class="el-icon-arrow-left icon_nav"></i>
          </router-link>
        </el-col>
        <el-col :span="12" class="navTit">
          {{navTit}}
        </el-col>
        <!-- <el-col :span="6" class="windowsCnt">
          <i class="el-icon-minus icon_nav" @click="minimizeApp"></i>
          <span class="publicBtn amplification" @click="maximizeApp"></span>
          <i class="el-icon-close icon_nav" @click="exitApp"></i>
        </el-col> -->
      </el-row>

      
     <!-- 加载遮罩层 -->
      <section class="layoutPosition" v-show="layoutPosition">
        <img :src="layoutPositionImg" alt="" class="layoutPositionImg" width="32px" height="32px">
        <span class="layoutPositionTxt">{{layoutPositionTxt}}</span>
      </section>

      <el-row class="createTabCnt">
        <el-col :span="24" class="mainCnt">
          
          <section class="mainCntTab">
            <button @click="tab1" class="pointerTxt" :class="btn">Create a new wallet</button>
            <button @click="tab2" class="pointerTxt" :class="btn2">Import Phrase</button>
          </section>
          
          <section v-show="mainCntTab1" class="mainCntTab1">
            <!-- <p class="mainCntTab1Txt">Wallet name</p> -->
             <el-input
              type="text"
              placeholder="wallet name"
              v-model="name"
              maxlength="12"
              clearable>
            </el-input>
            <section>
              <!-- <p class="mainCntTab1Txt">password</p> -->
              <section style="margin: 12px 0;">
                  <el-input
                    type="password"
                    placeholder="password"
                    v-model="password"
                    maxlength="30"
                    clearable>
                  </el-input>
                  <div style="margin: 6px 0 16px 0;font-size:12px;" v-show="passTxt">
                    <img src="../../assets/image/message.png" width="12px" height="12px"/>
                    <span class="mainCntTab1Txt1">
                      8-30 characters, must contain at least 2 types of numbers, English
                    </span>
                    <span class="mainCntTab1Txt2">
                       letters, and special characters
                    </span>
                  </div>
              </section>
              <!-- <p class="mainCntTab1Txt">confirm password</p> -->
              <el-input
                type="password"
                placeholder="confirm password"
                v-model="confirmP"
                maxlength="30"
                clearable>
              </el-input>
            </section>
            <section class="publicCntBtn" style="margin-top: 32px;">
              <button class="publicBtn" :disabled="!createActiveBtn" :class="createActiveBtn?'publicBtnAcitve':''" @click="createBtn">Create</button>
            </section>
          </section>
          <section v-show="mainCntTab2" class="mainCntTab2">
            <textarea name="" id="" cols="30" v-model="mnemonicTxt" placeholder="Type the cackup phrase here, separated by a space"></textarea>
            <section class="publicCntBtn" style="margin-top: 29px;">
              <button class="publicBtn" :disabled="!publicBtnAcitve" :class="publicBtnAcitve?'publicBtnAcitve':''" @click="importingFrom">Importing</button>
            </section>
          </section>

        </el-col>
      </el-row>

      
      <el-dialog
          title="prompt"
          :visible.sync="centerDialogVisible"
          width="432px"
          :show-close = true
          :closeOnClickModal = false
          top="25vh"
          center>
          <p style="color: #939CB2;font-size:14px;text-align: center;margin: 60px 0 93px;">
            Error message: mnemonic is incorrect
          </p>
          <span slot="footer" class="dialog-footer">
            <button class="publicBtn publicBtnAcitve" @click="centerDialogVisible = false">Re-import</button>
          </span>
      </el-dialog>


      <el-dialog
          title="prompt"
          :visible.sync="newDialogVisible1"
          width="432px"
          :show-close = true
          :closeOnClickModal = false
          top="25vh"
          center>
          <p style="color: #939CB2;font-size:14px;text-align: center;margin: 60px 0 93px;">
            {{newDialogLabel1}}
          </p>
          <el-input
              type="text"
              placeholder="Please input"
              v-model="newDialogInput1"
              clearable>
          </el-input>
          <span slot="footer" class="dialog-footer">
            <button class="publicBtn publicBtnAcitve" @click="newDialogVisible1 = false; newDialogFn1()">OK</button>
          </span>
      </el-dialog>

      <el-dialog
          title="prompt"
          :visible.sync="newDialogVisible5"
          width="432px"
          :show-close = true
          :closeOnClickModal = false
          top="25vh"
          center>
          <p style="color: #939CB2;font-size:14px;text-align: center;margin: 60px 0 93px;">
            {{newDialogLabel5}}
          </p>
          <el-input
              type="password"
              placeholder="Please input"
              v-model="newDialogInput5"
              clearable>
          </el-input>
          <span slot="footer" class="dialog-footer">
            <button class="publicBtn publicBtnAcitve" @click="newDialogVisible5 = false; newDialogFn5()">OK</button>
          </span>
      </el-dialog>           
    </main>
  </el-container>
</template>

<script>
const {ipcRenderer: ipc} = require('electron')
const CryptoJS = require("crypto-js");
const SECUtil = require("@sec-block/secjs-util");
const jwt = require("jsonwebtoken");
const fs = require("fs")
import waitingImg from '../../assets/image/waitingImg.png'
import successImg from '../../assets/image/successImg.png'
import walletsHandler from '../../lib/WalletsHandler'
//const secUtil = new SECUtil()
export default {
  name: "",
  data() {
    return {
      layoutPosition: false,
      layoutPositionImg: waitingImg,
      layoutPositionTxt: 'Import into the wallet...',
      passTxt: false,
      returnPage: "/",
      name: '',
      password: "",
      confirmP: "",
      privateKey: "",
      englishWords: "",
      mainCntTab1: true,
      mainCntTab2: false,
      passCntList: false,
      centerDialogVisible: false,
      newDialogVisible1: false,
      newDialogLabel1: "Please set the name of the wallet you imported",
      newDialogInput1: "",
      newDialogVisible5: false,
      newDialogLabel5: "You have chosen to create a new account, please set a password.",
      newDialogInput5: "",
      filePath: "",
      keyFileDataJS: {},                  
      btn: "btn",
      btn2: "btn2",
      navTit: 'Wallet Creation',
      tempColorArr: [],
      mnemonicTxt: "",
      mnemonicWallet: {
        privateKey: '',
        pubKey128ToString: '',
        userAddressToString: '',
      },
    };
  },
  methods: {
    createBtn() {
      if (this.walletName === ''){
        this.$alert('You need to give the wallet a name.', 'prompt', {
              confirmButtonText: 'Confirm',
        });
        return
      }
        if (this.confirmP != this.password) {
          this.$alert('The input passwords are not same. Please enter again.', 'prompt', {
              confirmButtonText: 'Confirm',
          });
          return;
        } else if(!new RegExp(/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,30}$/).test(this.password)){
          this.$alert('The password formatt is wrong. Please enter 8 - 30 character with number and letter.', 'prompt', {
              confirmButtonText: 'Confirm',
          });
          return;
        } else {
          let keys = walletsHandler.getWalletKeys()
          this._navToBackUp({
            privateKey: keys.privateKey,
            publicKey: keys.publicKey,
            userAddress: keys.userAddress,
            password: this.password,
            englishWords: keys.englishWords,
            walletName: this.name
          })
        }
    },

    _navToBackUp(params) {
      this.$router.push({
        name: 'backup',
        query: params
      })
    },

    newDialogFn1() {
      this.keyFileDataJS = {
        [this.newDialogInput1]:
        {
          privateKey: this.mnemonicWallet.privateKey,
          publicKey: this.mnemonicWallet.pubKey128ToString,
          walletAddress: this.mnemonicWallet.userAddressToString
        }
      }
      this.newDialogVisible5 = true   
    },

    newDialogFn5() {
      let keyFileData = JSON.stringify(this.keyFileDataJS)
      let cipherKeyData = CryptoJS.AES.encrypt(keyFileData, this.newDialogInput5)
      if(!new RegExp(/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,30}$/).test(this.newDialogInput5)){
          this.$alert('The password formatt is wrong. Please enter 8 - 30 character with number and letter.', 'prompt', {
              confirmButtonText: 'Confirm',
          });
          return;
        }
      fs.writeFile(this.filePath, cipherKeyData, (err) => {
        if(err) {
          return
        }
        this.$alert(`The encrypted file saved in ${this.filePath}`, '', {
              confirmButtonText: 'Confirm',
          });
      })
      this._mnemonicNavToWallet(this.keyFileDataJS, this.newDialogInput5)
    },
                 
    importingFrom() {
      try{
        this.mnemonicWallet.privateKey = SECUtil.mnemonicToEntropy(this.mnemonicTxt)
        let privKey64Buffer = Buffer.from(this.mnemonicWallet.privateKey, 'hex')

        let pubKey128 = SECUtil.privateToPublic(privKey64Buffer)
        this.mnemonicWallet.pubKey128ToString = pubKey128.toString('hex')

        let userAddressBuffer = SECUtil.publicToAddress(pubKey128, true)
        this.mnemonicWallet.userAddressToString = SECUtil.bufferToHex(userAddressBuffer).substring(2)
      } catch(e) {
        this.$alert('The mnemonic import failed, please confirm that the mnemonic is correct.', 'prompt', {
              confirmButtonText: 'Confirm',
          });
        return
      }
      // read local file
      let dirPath = require('os').homedir() + '/secwallet'
      if (!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath);
      }
      this.filePath = dirPath + '/default.data'
      this.newDialogVisible1=true
    },

    _mnemonicNavToWallet: function(keyDataJSON, pwd) {
      let walletsArr = []
      let walletInfo = {}
      let walletNamesArr = Object.keys(keyDataJSON)
      for (let walletName of walletNamesArr) {
        walletInfo = keyDataJSON[walletName]
        walletInfo["walletName"] = walletName.replace(/"/g, '')
        walletsArr.push(walletInfo)
      }
      this._userAuthRequest(walletsArr, pwd)
    },

    _userAuthRequest: function(walletsArr, walletPwd) {
      let walletsBalanceJS = {}
      walletsBalanceJS = this.$JsonRPCClient.getAllWalletsBalance(walletsArr)
      walletsHandler.fillUpWalletsBalance(walletsArr, walletsBalanceJS)
      this._navToAccountDetail({
              walletPwd: walletPwd,
              privateKey: walletsArr[walletsArr.length-1].privateKey,
              publicKey: walletsArr[walletsArr.length-1].publicKey,
              walletAddress: walletsArr[walletsArr.length-1].walletAddress,
              walletBalance: walletsArr[walletsArr.length-1].walletBalance,
              walletsArr: walletsArr,
              walletName: walletsArr[walletsArr.length-1].walletName,
              colorArr: new Array(walletsArr.length-1).fill(false).concat([true]),
              pageId: 1
            })      
    },
    _navToAccountDetail: function(params) {
      this.$router.push({
        name: 'wallet',
        query: {
          walletPwd: params.walletPwd, 
          walletAddress: params.walletAddress, 
          walletPrivateKey: params.privateKey, 
          walletPublicKey: params.publicKey, 
          walletBalance: params.walletBalance,
          walletsArr: params.walletsArr,
          walletName: params.walletName,
          colorArr: params.colorArr
        }
      })
    },
    tab1() {
      this.mainCntTab1 = true;
      this.mainCntTab2 = false;
      this.btn = "btn";
      this.btn2 = "btn2";
      this.navTit = 'New wallet'
    },
    tab2() {
      this.mainCntTab1 = false;
      this.mainCntTab2 = true;
      this.btn = "btn2";
      this.btn2 = "btn";
      this.navTit = 'Import wallet'
    },
    exitApp() {
      ipc.send('close')
    },
    minimizeApp() {
      ipc.send('min')
    },
    maximizeApp() {
      ipc.send('max')
    }
  },
  computed: {
    createActiveBtn() {
      if (this.password.length > 0) {
        this.passTxt = true
      } else {
        this.passTxt = false
      }
      return (this.name.length > 0 && this.password.length > 7 && this.confirmP.length > 7) ? true : false;
    },
    publicBtnAcitve() {
      return this.mnemonicTxt.length > 0 ? true : false;
    }
  },
  created() {
    this.returnPage = "/";
    this.mainCntTab1 = true;
    this.mainCntTab2 = false;
    this.btn = "btn";
    this.btn2 = "btn2";
   }
};
</script>

<style scoped>
.layoutPosition {position: fixed;top: 50%;left:50%;width: 176px;height: 112px;border-radius: 2px;
  background:rgba(36,46,73,.92);box-shadow:0px 0px 15px rgba(96,98,115,0.2);
  margin: -56px 0 0 -88px;display: flex;flex-direction: column;align-items: center;z-index: 9999;}
.layoutPositionImg {padding: 25px 0 20px;}
.layoutPositionTxt {font-size:12px;color:#fff;}

.layoutCnt {
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  align-items: center;
}
.mainCnt {
  width: 500px;
  height: 382px;
}

.createTabCnt {
  display: flex;
  justify-content: center;
  align-items: center;
}
.mainCntTab {
  display: flex;
  justify-content: space-between;
  width: 380px;
  margin: 104px auto 32px;
  border-radius: 2px;
}
.mainCntTab1 {
  margin: 32px auto 0;
  width: 380px;
  height: 236px;
}

.mainCntTab1Txt1 {
  color: #939CB2;
  padding-left: 8px;
}
.mainCntTab1Txt2 {
  color: #939CB2;
  padding-left: 23px;
}
.mainCntTab2 {
  width: 380px;
  margin: 32px auto 0;
  height: 236px;
}

.btn {
  width: 190px;
  height: 36px;
  background: rgba(0,214,178,0.6);
  border: none;
  color: #fff;
  outline: none;
}
.btn2 {
  width: 190px;
  height: 36px;
  background: #fff;
  color: #00D6B2;
  border: 1px solid rgba(0,214,178,0.6);
  outline: none;
}

ul {
  display: flex;
}
ul .iptTxt {
  width: 116px;
  height: 36px;
  border: 1px solid #c8d1da;
  color: #c8d1da;
  line-height: 36px;
  text-align: center;
  margin-top: 12px;
  margin-right: 12px;
}
ul .iptTxt:last-child {
  margin-right: 0;
}

ul .iptTxt input[type="text"] {
  width: 116px;
  height: 48px;
  border: none;
  outline: none;
  text-align: center;
  color: #657292;
}
textarea {width:354px;height:142px;outline:none;border:1px solid #C8D1DA;padding: 12px;color:#242E49;
  outline:none;resize:none;}

section >>> .el-input__inner {padding-left: 0;text-indent: 8px;height: 48px;}
section >>> .el-input__inner:focus {border-color: #c8d1da;}
section >>> .el-input__inner {border-radius: 2px;outline: none;}
</style>