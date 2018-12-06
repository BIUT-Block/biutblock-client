<template>
  <el-container class="layoutCnt">
    <main style="width: 640px;height: 432px;border:1px solid #ccc;">
      <el-row class="publicNav">
        <el-col :span="6">
          <router-link :to="returnPage">
            <i class="el-icon-arrow-left icon_nav"></i>
          </router-link>
        </el-col>
        <el-col :span="12" class="navTit">
          {{navTit}}
        </el-col>
        <el-col :span="6" class="windowsCnt">
          <i class="el-icon-minus icon_nav" @click="minimizeApp"></i>
          <span class="publicBtn amplification" @click="maximizeApp"></span>
          <i class="el-icon-close icon_nav" @click="exitApp"></i>
        </el-col>
      </el-row>

      <el-row class="createTabCnt">
        <el-col :span="24" class="mainCnt">
          
          <section class="mainCntTab">
            <button @click="tab1" class="pointerTxt" :class="btn">Create a new wallet</button>
            <button @click="tab2" class="pointerTxt" :class="btn2">Mnemonic import wallet</button>
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
            <section v-show="passCntList">
              <!-- <p class="mainCntTab1Txt">password</p> -->
              <el-input
                type="password"
                placeholder="password"
                v-model="password"
                maxlength="30"
                clearable>
              </el-input>
              <!-- <p class="mainCntTab1Txt">confirm password</p> -->
              <el-input
                type="password"
                placeholder="confirm password"
                v-model="confirmP"
                maxlength="30"
                clearable>
              </el-input>
            </section>
            <section class="publicCntBtn" style="margin-top:16px;">
              <button class="publicBtn" :disabled="!createActiveBtn" :class="createActiveBtn?'publicBtnAcitve':''" @click="createBtn">Create a wallet</button>
            </section>
          </section>

          <section v-show="mainCntTab2" class="mainCntTab2">
            <textarea name="" id="" cols="30" v-model="mnemonicTxt" rows="10" placeholder="Please enter a mnemonic, separated by a space"></textarea>
            <section class="publicCntBtn" style="margin-top:28px;">
              <button class="publicBtn" :disabled="!publicBtnAcitve" :class="publicBtnAcitve?'publicBtnAcitve':''" @click="importingFrom">Start importing</button>
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
          top="30vh"
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
          top="30vh"
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
          :visible.sync="newDialogVisible2"
          width="432px"
          :show-close = true
          :closeOnClickModal = false
          top="30vh"
          center>
          <p style="color: #939CB2;font-size:14px;text-align: center;margin: 60px 0 93px;">
            {{newDialogLabel2}}
          </p>
          <el-input
              type="text"
              placeholder="Please input"
              v-model="newDialogInput2"
              clearable>
          </el-input>
          <span slot="footer" class="dialog-footer">
            <button class="publicBtn publicBtnAcitve" @click="newDialogVisible2 = false; newDialogFn2()">OK</button>
          </span>
      </el-dialog>
      <el-dialog
          title="prompt"
          :visible.sync="newDialogVisible3"
          width="432px"
          :show-close = true
          :closeOnClickModal = false
          top="30vh"
          center>
          <p style="color: #939CB2;font-size:14px;text-align: center;margin: 60px 0 93px;">
            {{newDialogLabel3}}
          </p>
          <el-input
              type="text"
              placeholder="Please input"
              v-model="newDialogInput3"
              clearable>
          </el-input>
          <span slot="footer" class="dialog-footer">
            <button class="publicBtn publicBtnAcitve" @click="newDialogVisible3 = false; newDialogFn3()">OK</button>
          </span>
      </el-dialog>
      <el-dialog
          title="prompt"
          :visible.sync="newDialogVisible4"
          width="432px"
          :show-close = true
          :closeOnClickModal = false
          top="30vh"
          center>
          <p style="color: #939CB2;font-size:14px;text-align: center;margin: 60px 0 93px;">
            {{newDialogLabel4}}
          </p>
          <el-input
              type="text"
              placeholder="Please input"
              v-model="newDialogInput4"
              clearable>
          </el-input>
          <span slot="footer" class="dialog-footer">
            <button class="publicBtn publicBtnAcitve" @click="newDialogVisible4 = false; newDialogFn4()">OK</button>
          </span>
      </el-dialog>
      <el-dialog
          title="prompt"
          :visible.sync="newDialogVisible5"
          width="432px"
          :show-close = true
          :closeOnClickModal = false
          top="30vh"
          center>
          <p style="color: #939CB2;font-size:14px;text-align: center;margin: 60px 0 93px;">
            {{newDialogLabel5}}
          </p>
          <el-input
              type="text"
              placeholder="Please input"
              v-model="newDialogInput5"
              clearable>
          </el-input>
          <span slot="footer" class="dialog-footer">
            <button class="publicBtn publicBtnAcitve" @click="newDialogVisible5 = false; newDialogFn5()">OK</button>
          </span>
      </el-dialog>
      <el-dialog
          title="prompt"
          :visible.sync="newDialogVisible6"
          width="432px"
          :show-close = true
          :closeOnClickModal = false
          top="30vh"
          center>
          <p style="color: #939CB2;font-size:14px;text-align: center;margin: 60px 0 93px;">
            {{newDialogLabel6}}
          </p>
          <el-input
              type="text"
              placeholder="Please input"
              v-model="newDialogInput6"
              clearable>
          </el-input>
          <span slot="footer" class="dialog-footer">
            <button class="publicBtn publicBtnAcitve" @click="newDialogVisible6 = false; newDialogFn6()">OK</button>
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

//const secUtil = new SECUtil()
export default {
  name: "",
  data() {
    return {
      returnPage: "/",
      name: "wallet 01", //默认钱包显示，格式为“wallet+个数”，个数是根据目前应用中存在的钱包个数+1；若存在重复，则个数继续+1
      password: "",
      confirmP: "",
      privateKey: "",
      englishWords: "",
      mainCntTab1: true,
      mainCntTab2: false,
      passCntList: false,
      centerDialogVisible: false,
      newDialogVisible1: false,
      newDialogLabel1: "请设置您导入的钱包名称",
      newDialogInput1: "",
      newDialogVisible2: false,
      newDialogLabel2: "本地没有账户信息，这是您的第一个钱包，请设置您的新账户密码",
      newDialogInput2: "",
      newDialogVisible3: false,
      newDialogLabel3: "检测到本地已有账户，如果想保存您已有账户，请输入1，如果想新建账户(原账户内所有钱包信息将丢失), 请输入2",
      newDialogInput3: "",
      newDialogVisible4: false,
      newDialogLabel4: "您选择了保存账户，请登陆原有账户",
      newDialogInput4: "",
      newDialogVisible5: false,
      newDialogLabel5: "您选择了新建账户，请设置密码",
      newDialogInput5: "",
      newDialogVisible6: false,
      newDialogLabel6: "您导入的钱包与已有账户中的钱包名字重复，请重命名",
      newDialogInput6: "",
      filePath: "",
      keyFileDataJS: {},                  
      btn: "btn",
      btn2: "btn2",
      navTit: 'New wallet',
      mnemonicTxt: "",
      newUserAccount: {
        walletName: "",
        password: "",
        repeatPassword: ""
      },
      mnemonicWallet: {
        privateKey: '',
        pubKey128ToString: '',
        userAddressToString: '',
      },
    };
  },
  methods: {
    createBtn() {
      //检查钱包名字是否重复
      console.log('Button')
      if (this.walletPwd && this.walletPwd!==""){
        let dirPath = require('os').homedir() + '/secwallet'
        let filePath = dirPath + '/default.data'
        fs.readFile(filePath, 'utf-8', this._checkWalletName.bind(this, this.name))
      } else {
        if (this.confirmP != this.password) {
          alert("The input passwords are not same. Please enter again.");
          return;
        } else {
          let keys = SECUtil.generateSecKeys();
          let privKey64 = keys.privKey;
          this.privateKey = privKey64;
          this.englishWords = SECUtil.entropyToMnemonic(privKey64);

          let pubKey128 = keys.publicKey;
          this.pubKey128ToString = pubKey128.toString("hex");

          //let userAddressBuffer = keys.secAddress;
          //let userAddress = userAddressBuffer.toString("hex");
          this.userAddressToString = keys.secAddress;

          let tokenInfo = {
            password: this.newUserAccount.password
          };

          let token = jwt.sign(tokenInfo, "MongoX-Block", {
            expiresIn: 60 * 60 * 24
          });
          this.decoded = this.$JWT.verifyToken(token);
          //成功就跳转到助记词
          //this.$router.push('/backup')
          //失败  弹出提示框，不做任何跳转
          if (this.decoded === "") {
            return;
          } else {
            // save to local file
            this.userToken = token;
          }
          this.$router.push({
            name: "backup",
            query: {
              id: this.$route.query.id,
              privateKey: this.privateKey,
              publicKey: this.pubKey128ToString,
              userAddress: this.userAddressToString,
              password: this.password,
              englishWords: this.englishWords,
              walletPwd: this.walletPwd,
              walletName: this.name
            }
          });
        }
      }
    },

    _checkWalletName(name, err, data) {
      let keyData = CryptoJS.AES.decrypt(data.toString(), this.walletPwd).toString(CryptoJS.enc.Utf8)
      let keyDataJSON = JSON.parse(keyData)
      let walletNamesArr = Object.keys(keyDataJSON)
      if (walletNamesArr.indexOf(name) > -1) {
          //In the array!
          return "Name Repeat"
      } else {
          //Not in the array
        // 创建钱包方法
        if (this.confirmP != this.password) {
          alert("两次密码输入不一致，请重新输入");
          return;
        } else {
          let keys = SECUtil.generateSecKeys();
          let privKey64 = keys.privKey;
          this.privateKey = privKey64;
          this.englishWords = SECUtil.entropyToMnemonic(privKey64);

          let pubKey128 = keys.publicKey;
          this.pubKey128ToString = pubKey128.toString("hex");

          //let userAddressBuffer = keys.secAddress;
          //let userAddress = userAddressBuffer.toString("hex");
          this.userAddressToString = keys.secAddress;

          let tokenInfo = {
            password: this.newUserAccount.password
          };

          let token = jwt.sign(tokenInfo, "MongoX-Block", {
            expiresIn: 60 * 60 * 24
          });
          this.decoded = this.$JWT.verifyToken(token);
          //成功就跳转到助记词
          //this.$router.push('/backup')
          //失败  弹出提示框，不做任何跳转
          if (this.decoded === "") {
            return;
          } else {
            // save to local file
            this.userToken = token;
          }
          this.$router.push({
            name: "backup",
            query: {
              id: this.$route.query.id,
              privateKey: this.privateKey,
              publicKey: this.pubKey128ToString,
              userAddress: this.userAddressToString,
              password: this.password,
              englishWords: this.englishWords,
              walletsArr: this.$route.query.walletsArr,
              walletPwd: this.walletPwd,
              walletName: this.name
            }
          });
        }
      }
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

      if (!fs.existsSync(this.filePath)){
        this.newDialogVisible2 = true
      } else {
        if (this.walletPwd && this.walletPwd!=="") {
          fs.readFile(this.filePath, 'utf-8', this._fileRequest.bind(this, this.walletPwd, this.newDialogInput1))
        } else {
          // let isNewKeyFile = prompt('检测到本地已有账户，如果想保存您已有账户，请输入1，如果想新建账户(原账户内所有钱包信息将丢失), 请输入2')
          this.newDialogVisible3 = true
        }
      }
    },

    newDialogFn2() {
      let keyFileData = JSON.stringify(this.keyFileDataJS)
      let cipherKeyData = CryptoJS.AES.encrypt(keyFileData, this.newDialogInput2)
      fs.writeFile(this.filePath, cipherKeyData, (err) => {
        if(err) {
          return
        }
        alert(`Already saved the secure file would be saved in ${this.filePath}`)
      })
      this._mnemonicNavToWallet(this.keyFileDataJS, this.mnemonicPwd)
    },

    newDialogFn3() {
      if (this.newDialogInput3==="1") {
        // let mnemonicPwd = prompt('您选择了保存账户，请登陆原有账户')
        this.newDialogVisible4 = true

      } else if (this.newDialogInput3==="2") {
        // let mnemonicPwd = prompt('您选择了新建账户，请设置密码')
        this.newDialogVisible5 = true
      } else {
        alert('请输入1或2')
      }    
    },

    newDialogFn4() {
      fs.readFile(this.filePath, 'utf-8', this._fileRequest.bind(this, this.newDialogInput4, this.newDialogInput1))
    },

    newDialogFn5() {
      let keyFileData = JSON.stringify(this.keyFileDataJS)
      let cipherKeyData = CryptoJS.AES.encrypt(keyFileData, this.newDialogInput5)
      fs.writeFile(this.filePath, cipherKeyData, (err) => {
        if(err) {
          return
        }
        alert(`Already saved the secure file would be saved in ${this.filePath}`)
      })
      this._mnemonicNavToWallet(this.keyFileDataJS, this.newDialogInput5)
    },
    newDialogFn6() {
      fs.readFile(this.filePath, 'utf-8', this._fileRequest.bind(this, this.newDialogInput4, this.newDialogInput6))
    },                    
    importingFrom() {
      try{
        this.mnemonicWallet.privateKey = SECUtil.mnemonicToEntropy(this.mnemonicTxt)
        let privKey64Buffer = Buffer.from(this.mnemonicWallet.privateKey, 'hex')

        let pubKey128 = SECUtil.privateToPublic(privKey64Buffer)
        this.mnemonicWallet.pubKey128ToString = pubKey128.toString('hex')

        let userAddressBuffer = SECUtil.publicToAddress(pubKey128, true)
        this.mnemonicWallet.userAddressToString = SECUtil.bufferToHex(userAddressBuffer)
        alert('导入成功')
      } catch(e) {
        alert('助记词导入失败，请确认助记词正确')
        return
      }
      // read local file
      let dirPath = require('os').homedir() + '/secwallet'
      if (!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath);
      }

      this.filePath = dirPath + '/default.data'
      // let mnemonicName = prompt("请设置您导入的钱包名称")
      this.newDialogVisible1=true
    },

    _fileRequest: function(pwd, mnemonicName, err, data){
        if (err) {
          return
        }
        try {
          let keyData = CryptoJS.AES.decrypt(data.toString(), pwd).toString(CryptoJS.enc.Utf8)
          this.keyFileDataJS = JSON.parse(keyData)
          let walletNamesArr = Object.keys(this.keyFileDataJS)
          let localPrivatKey = ""
          for (let walletName of walletNamesArr) {
              localPrivatKey = this.keyFileDataJS[walletName]["privateKey"]
              if (localPrivatKey===this.mnemonicWallet.privateKey) {
                alert(`该钱包信息已在本地，本地钱包名 ${walletName}`)
                return 
              }
          }
          if(walletNamesArr.indexOf(mnemonicName)>-1){
            // mnemonicName = prompt('您导入的钱包与已有账户中的钱包名字重复，请重命名')
            this.newDialogVisible6 = true
            return
          }
          this.keyFileDataJS[mnemonicName] = {
            privateKey: this.mnemonicWallet.privateKey,
            publicKey: this.mnemonicWallet.pubKey128ToString,
            walletAddress: this.mnemonicWallet.userAddressToString
          }
          let keyFileData = JSON.stringify(this.keyFileDataJS)
          let cipherKeyData = CryptoJS.AES.encrypt(keyFileData, pwd)
          fs.writeFile(this.filePath, cipherKeyData, (err) => {
            if(err) {
              return
            }
            alert(`Already saved the secure file would be saved in ${this.filePath}`)
          })
          this._mnemonicNavToWallet(this.keyFileDataJS, pwd)
        } catch(e) {
          alert('登陆错误！请确认密码')
        }
    },

    _mnemonicNavToWallet: function(keyDataJSON, pwd) {
      let walletsArr = []
      let walletInfo = {}
      let walletNamesArr = Object.keys(keyDataJSON)
      for (let walletName of walletNamesArr) {
        walletInfo = keyDataJSON[walletName]
        walletInfo["walletName"] = walletName
        walletsArr.push(walletInfo)
      }
      this._userAuthRequest(walletsArr, pwd)
    },

    _userAuthRequest: function(walletsArr, walletPwd) {
      let tokenInfo = {
        password: walletPwd
      }
      let token = jwt.sign(tokenInfo, 'MongoX-Block', {
        'expiresIn': 60 * 60 * 24
      })

      window.localStorage.setItem('userToken', token)
      let walletsBalanceJS = {}
      for (let wallet of walletsArr) {
        this.$JsonRPCClient.client.request('sec_getBalance', [wallet.walletAddress], (err, response) => {
          console.log(response)
          if(response.result.status === 'false') {
            alert('无法获取余额，钱包地址可能无效')
          } else if (response.result.status == '0') {
            walletsBalanceJS[wallet.walletName] = response.result.value.toString()
          } else if (response.result.status === '1') {
            walletsBalanceJS[wallet.walletName] = response.result.value.toString()
          }
          if (Object.keys(walletsBalanceJS).length === walletsArr.length) {
            for (let wallet of walletsArr) {
                wallet["walletBalance"] = walletsBalanceJS[wallet.walletName]
            }
            this._navToAccountDetail({
              walletPwd: walletPwd,
              privateKey: walletsArr[0].privateKey,
              publicKey: walletsArr[0].publicKey,
              walletAddress: walletsArr[0].walletAddress,
              walletBalance: walletsArr[0].walletBalance,
              walletsArr: walletsArr,
              walletName: walletsArr[0].walletName
            })
          }
        })        
      }      
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
          walletName: params.walletName  
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
      //fs.readFile(filePath, 'utf-8', this._fileRequest.bind(this, this.loginValue))
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
      if (this.$route.query.id === "1") {
        return (this.name.length > 0 && this.password.length > 7 && this.confirmP.length > 7) ? true : false;
      }
      if (this.$route.query.id === "3") {
        return this.name.length > 0 ? true : false;
      }
      if (this.$route.query.id === "2") {
        this.navTit = 'Import wallet'
        return (this.name.length > 0 && this.password.length > 7 && this.confirmP.length > 7) ? true : false;
      }
    },
    publicBtnAcitve() {
      return this.mnemonicTxt.length > 0 ? true : false;
    }
  },
  created() {
    if (this.$route.query.id === "1") {
      this.returnPage = "/";
      this.mainCntTab1 = true;
      this.mainCntTab2 = false;
      this.btn = "btn";
      this.btn2 = "btn2";
      this.passCntList = true
    }
    if (this.$route.query.id === "3") {
      this.returnPage = {
        name: 'wallet',
        query: {
          privateKey: this.$route.query.walletPrivateKey,
          publicKey: this.$route.query.walletPublicKey,
          walletAddress: this.$route.query.walletAddress,
          walletBalance: this.$route.query.walletBalance,
          walletsArr: this.$route.query.walletsArr,
          walletPwd: this.$route.query.walletPwd,
          walletName: this.$route.query.walletName
        }
      };
      this.mainCntTab1 = true;
      this.mainCntTab2 = false;
      this.btn = "btn";
      this.btn2 = "btn2";
      this.passCntList = false;
      let walletOrd = (this.$route.query.walletsArr.length + 1).toString()
      this.name = walletOrd < 10 ? "wallet 0" + walletOrd : "wallet " + walletOrd
    }
    if (this.$route.query.id === "2") {
      this.returnPage = "/backup";
      this.mainCntTab1 = false;
      this.mainCntTab2 = true;
      this.btn = "btn2";
      this.btn2 = "btn";
      this.passCntList = true
    }
    this.walletPwd = this.$route.query.walletPwd;
  }
};
</script>

<style scoped>
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
  margin: 56px auto 33px;
}
.mainCntTab1 {
  margin: 32px auto 0;
  width: 380px;
}
.mainCntTab1Txt {
  color: #c8d1da;
  margin: 12px 0 6px;
}
.mainCntTab2 {
  width: 380px;
  margin: 28px auto;
}

.btn {
  width: 184px;
  height: 36px;
  background: #00D6B2;
  border: 1px solid #c8d1da;
  color: #fff;
  outline: none;
  border-radius: 2px;
}
.btn2 {
  width: 184px;
  height: 36px;
  background: #fff;
  color: #00D6B2;
  border: 1px solid #00D6B2;
  outline: none;
  border-radius: 2px;
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
  height: 30px;
  border: none;
  outline: none;
  text-align: center;
  color: #657292;
}
textarea {width:380px;height:149px;outline:none;border:1px solid #C8D1DA;padding: 12px;color:#242E49;}

section >>> .el-input__inner {padding-left: 0;text-indent: 8px;}
section >>> .el-input__inner:focus {border-color: #c8d1da;}
section >>> .el-input__inner {border-radius: 2px;outline: none;margin-bottom: 16px}
</style>