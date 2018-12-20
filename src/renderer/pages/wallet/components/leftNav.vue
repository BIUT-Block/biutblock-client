<template>
  <el-container style="background: #FAFAFA">
    <el-row>
      <el-col :span="24">
        <section class="leftNavCnt">
          <ul>
            <li v-for="(item,index) in walletsArr" 
              :index="item.id"
              :class="[colorArr[index]?'color0':'',colorBorderArr[index%4]]"
              @click="tabWallet(item,index)">
                <p style="font-weight: bold;">{{item.walletName}}</p>
                <p style="margin-top:5px">{{item.walletAddress.replace(/(.{8}).+(.{8})/,'$1...$2')}}</p>
            </li>
            <!-- <li class="borderColor1" @click="tabWallet(index)">
                <p>{{walletName}}</p>
                <p style="margin-top:5px">{{walletAddress.replace(/(.{10}).+(.{10})/,'$1...$2')}}</p>
            </li> -->
          </ul>
          <button class="btn pointerTxt" @click="createWallet"><span style="font-size: 20px;vertical-align: middle;">+</span> Create a wallet</button>
        </section>
      </el-col>
    </el-row>

    <!-- 创建钱包弹窗 -->
    <el-dialog
      title="prompt"
      :visible.sync="createDialog"
      width="534px"
      :show-close = "closeAllowed"
      :closeOnClickModal = false
      :closeOnPressEscape = "closeAllowed"
      top="20vh"
      center>
      <!-- 创建钱包 -->
      <section v-show="createContent">
        <section class="mainCntTab">
            <button @click="tabBtn1" class="createTabBtn" :class="createTabBtnActive1">Create a new wallet</button>
            <button @click="tabBtn2" class="createTabBtn" :class="createTabBtnActive2">Mnemonic import wallet</button>
        </section>
        <section class="mainCntTab1" v-show="mainCntTab1">
              <el-input
                type="text"
                placeholder="wallet name"
                v-model="newWalletName"
                maxlength="12"
                clearable>
              </el-input>
              <section class="publicCntBtn" style="margin-top: 89px;">
                <button class="publicBtn" :disabled="!createActiveBtn" :class="createActiveBtn?'publicBtnAcitve':''" @click="createBtn">Create a wallet</button>
              </section>
        </section>
        <section class="mainCntTab2" v-show="mainCntTab2">
              <textarea cols="30" v-model="mnemonicTxt" class="createTextarea" rows="10" placeholder="Please enter a mnemonic, separated by a space"></textarea>
              <section class="publicCntBtn" style="margin-top: 29px;">
                <button class="publicBtn" :disabled="!publicBtnAcitve" :class="publicBtnAcitve?'publicBtnAcitve':''"  @click="importingFrom">Start importing</button>
              </section>
        </section>
      </section>
      
      <!-- 备份助记词 -->
      <section v-show="backUpContent">
          <section class="mainCntTxt">
            <p>Your password is encrypted, you can <span class="TxtColor pointerTxt" style="margin-left:8px;" @click="savaImgDialog = true">Save as...</span></p>
            <p>Be sure to back up this file. You can retrieve your wallet and reset your password with a </p>
            <p>mnemonic or private key. If you lose this file, you will lose the assets in your wallet.</p>
          </section>
          <section class="mainCntList">
            <section class="wordsLine" id="englishWordsList">
                {{englishWords}}
            </section>

            <section style="display: flex;justify-content: space-between;padding:0 8px 0 4px;
            margin:17px 0 20px;height:54px;background:rgba(250,250,250,1);border-radius:2px;align-items: center;">
                <qr-code :value="englishWordsString" :size="60" class="receiptCntImg">
                </qr-code>
              <section style="margin: 0 22px 0 4px;">
                <p class="copyTxt">Private key</p>
                <p class="copyTxt2" id="copyPrivateKey">{{newPrivateKey}}</p>
              </section>
              <button data-clipboard-target="#copyPrivateKey" type="button"  :class="copyBtnAcitve" class="copyBtn" @click="copyTxtCnt">{{copyTxtCntTit}}</button>
            </section>
          </section>
          <section class="publicCntBtn">
            <button class="publicBtn" @click="enterWallet" :disabled="!alreadySaved" :class="alreadySaved?'publicBtnAcitve':''">Backed up, enter the wallet</button>
          </section>
      </section>
    </el-dialog>

    <!-- 保存图片弹窗 -->
    <el-dialog
        title="Download format"
        :visible.sync="savaImgDialog"
        width="432px"
        :closeOnClickModal = false
        top="26vh">
        <section id="selectFileType" style="margin-top: 50px;text-align: left;">
          <p class="downTxt"><input type="radio" checked="checked" name="downImg" id="png">
            <span class="downTxt2">Picture file(*.png)</span>
              <span style="font-size: 11px;">
                Export files as images
              </span>
            </p>
          <p class="downTxt"><input type="radio" name="downImg" id="jpg">
            <span class="downTxt2">JPG file(*.jpg)</span>
              <span style="font-size: 11px;">
                Export to JPG file format (default is white background)
              </span>  
            </p>
          <div slot="footer" class="dialog-footer" style="text-align: center;">
            <button class="publicBtn publicBtnAcitve" style="margin-top:82px;" @click="saveFile">Confirm</button>
          </div>
        </section>
    </el-dialog>

    <!-- 同意协议弹窗 -->
    <el-dialog
      title="prompt"
      :visible.sync="agreementDialog"
      width="432px"
      :show-close = true
      :closeOnClickModal = false
      top="26vh">
        <section>
            <p class="agreementTxt" style="margin-top:52px;">
              Be sure to back up your mnemonics 
            </p>
            <p class="agreementTxt">
              and private keys. If the mnemonics and private keys
            </p>
            <p class="agreementTxt">
              are lost,you will permanently lose your assets.
            </p>
            <span slot="footer" class="dialog-footer">
              <button class="publicBtn publicBtnAcitve" style="margin-top:67px"  @click="enterTheWallet">Enter the wallet</button>
            </span>
        </section>
    </el-dialog>

      <el-dialog
          title="prompt"
          :visible.sync="newDialogVisible1"
          width="432px"
          :show-close = true
          :closeOnClickModal = false
          top="26vh"
          >
          <section class="mainCntTab1">
            <p style="color: #939CB2;font-size:14px;text-align: center;">
              {{newDialogLabel1}}
            </p>
            <el-input
                type="text"
                placeholder="Please input"
                v-model="newDialogInput1"
                clearable
                style="margin: 30px 0 50px;">
            </el-input>

            <span slot="footer" class="dialog-footer">
              <button class="publicBtn" :disabled="!importActiveBtn" :class="importActiveBtn?'publicBtnAcitve':''" @click="newDialogFn1()">OK</button>
            </span>
          </section>
      </el-dialog>
  </el-container>  
</template>

<script>
import {EventBus} from "../../../lib/EventBus.js"
import Clipboard from 'clipboard'
import qrCode from './qrCode'
import domtoimage from 'dom-to-image'
const CryptoJS = require("crypto-js")
const fs = require("fs")
const FileSaver = require('file-saver')
const jwt = require("jsonwebtoken");
const SECUtil = require("@sec-block/secjs-util");
export default {
  name: '',
  components: {
    qrCode
  },
  props: ['walletName', 'walletAddress', 'walletsArr', 'walletPwd', 'walletPrivateKey', 'walletPublicKey', 'walletBalance', 'colorArr'],
  data () {
    return {
      colorBorderArr: ['borderColor1','borderColor2','borderColor3','borderColor4'],
      //创建钱包
      createDialog: false,
      createTabBtnActive1: 'createTabBtnActive',
      createTabBtnActive2: '',
      mainCntTab1: true,
      mainCntTab2: false,
      newWalletName: '',
      mnemonicTxt: '',
      createContent: true,

      //备份助记词
      backUpContent: false,
      copyBtnAcitve: '',
      copyTxtCntTit: 'Copy',
      newPrivateKey: '',
      newPublicKey: '',
      newAddress: '',

      agreementDialog: false, //协议
      savaImgDialog: false, //保存图片
      newDialogVisible1: false,
      newDialogLabel1: "Please set the name of the wallet you imported",
      newDialogInput1: "",
      newDialogVisible2: false,
      newDialogLabel2: "There is no account information locally. This is your first wallet. Please set your new account password.",
      newDialogInput2: "",
      newDialogVisible3: false,
      newDialogLabel3: "If you want to save your existing account, please enter 1. If you want to create a new account (all wallet information in the original account will be lost), please enter 2",
      newDialogInput3: "",
      newDialogVisible4: false,
      newDialogLabel4: "You have chosen to save your account, please log in to your original account.",
      newDialogInput4: "",
      newDialogVisible5: false,
      newDialogLabel5: "You have chosen to create a new account, please set a password.",
      newDialogInput5: "",
      newDialogVisible6: false,
      newDialogLabel6: "The wallet you imported is duplicated with the name of the wallet in the existing account. Please rename it.",
      newDialogInput6: "",
      mnemonicWallet: {
        privateKey: '',
        pubKey128ToString: '',
        userAddressToString: '',
      },
      filePath: "",
      keyFileDataJS: {},

      englishWords: '',
      englishWordsArr: [[]],
      englishWordsString: '',

      alreadySaved: false,

      decoded: '',

      closeAllowed: true,
    }
  },
  methods: {
    tabBtn1 () {
      this.createTabBtnActive1 = 'createTabBtnActive'
      this.createTabBtnActive2 = ''
      this.mainCntTab1 = true
      this.mainCntTab2 = false
    },
    tabBtn2 () {
      this.createTabBtnActive1 = ''
      this.createTabBtnActive2 = 'createTabBtnActive'
      this.mainCntTab1 = false
      this.mainCntTab2 = true
    },
    //备份助记词 复制
    copyTxtCnt () {
       var clipboard = new Clipboard('.copyBtn')
        clipboard.on('success', e => {
          this.copyTxtCntTit = 'Copied'
          this.copyBtnAcitve = 'copyBtnAcitve'
          clipboard.destroy()
        })
        clipboard.on('error', e => {
          this.copyTxtCntTit = 'Copy'
          clipboard.destroy()
        })
    },
    //保存图片
    saveFile () {
      this.savaImgDialog = false
      let dirPath = require('os').homedir() + '/secwallet'
      let filePath = dirPath + '/default.data'
      if (!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath);
      }
      fs.readFile(filePath, 'utf-8', this._createImageFile.bind(this, filePath))
    },

    _AppendWallet: function(filePath, data){
        try {
          let keyData = CryptoJS.AES.decrypt(data.toString(), this.walletPwd).toString(CryptoJS.enc.Utf8)
          let keyDataJSON = JSON.parse(keyData)
          keyDataJSON[this.newWalletName] = {
            privateKey: this.newPrivateKey,
            publicKey: this.newPublicKey,
            walletAddress: this.newAddress
          }
          this.keyFileDataJS = keyDataJSON
          let keyFileData = JSON.stringify(keyDataJSON)
          let cipherKeyData = CryptoJS.AES.encrypt(keyFileData, this.walletPwd)
          fs.writeFile(filePath, cipherKeyData, (err) => {
            if(err) {
              return
            }
            // this._createImageFile(require('os').homedir() + '/secwallet')     
          })
        } catch(e) {
          return
        }
    },
    _createImageFile (filePath, err, data) {
      if (err) {
        return
      }
      try{
        let domSection = document.getElementById('englishWordsList')
        if (document.getElementById('png').checked) {
          domtoimage.toBlob(domSection)
                    .then( (blob) => {
                        FileSaver.saveAs(blob, 'englishWords.png');
                        this.alreadySaved=true
                    })
          this._AppendWallet(filePath, data)
          return
        }
        if (document.getElementById('jpg').checked) {
          domtoimage.toJpeg(domSection, { quality: 0.95 })
            .then( (dataUrl) => {
              let link = document.createElement('a')
              link.download = 'englishWords.jpeg'
              link.href = dataUrl
              link.click()
              this.alreadySaved = true
          })
          this._AppendWallet(filePath, data)
          return
        }
        this.$alert('Select a file format to save your english words', 'prompt', {
            confirmButtonText: 'Confirm',
        });
        return
      } catch(e) {
        return
      }
    },
    //保存好图片后进入协议界面
    enterTheWallet () {
      //先打开协议
      this.createDialog = false
      this.createContent = true
      this.backUpContent = false
      this.closeAllowed = true
      this.agreementDialog = false
      let walletsArr = []
      let walletNamesArr = Object.keys(this.keyFileDataJS)
      let walletInfo = {}
      for (let walletName of walletNamesArr) {
        walletInfo = this.keyFileDataJS[walletName]
        walletInfo["walletName"] = walletName
        walletsArr.push(walletInfo)
      }
      EventBus.$emit('updateWalletInfo', {
        walletPwd: this.walletPwd, 
        walletAddress: this.newAddress, 
        walletPrivateKey: this.newPrivateKey, 
        walletPublicKey: this.newPublicKey, 
        walletBalance: '10',
        walletsArr: walletsArr,
        walletName: this.newWalletName,
        walletIndex: walletsArr.length-1
      })
      EventBus.$emit('updateQuery', {
          walletAddress: this.newAddress,
          privateKey: this.newPrivateKey,
          publicKey: this.newPublicKey,
          walletMoney: '10',
          walletsArr: walletsArr,
          walletPwd: this.walletPwd,
          walletName: this.newWalletName,
          colorArr: new Array(this.walletsArr.length).fill(false)
      })
    },
    enterWallet () {
      //先打开协议
      this.agreementDialog = true
    },
    createWallet () {
      this.createDialog = true
      this.createContent = true
      this.backUpContent = false
      this.closeAllowed = true
      let walletOrd = this.walletsArr.length + 1
      this.newWalletName = walletOrd < 10 ? "wallet 0" + walletOrd : "wallet " + walletOrd
      let result = this.walletsArr.filter((wallet) => {
        return wallet.walletName === this.newWalletName
      })
      if(result.length > 0) {
        walletOrd = walletOrd + 1
        this.newWalletName = walletOrd < 10 ? "wallet 0" + walletOrd : "wallet " + walletOrd
      }   
    },
    tabWallet (item,index) {
      //this.colorArr.fill(false)
      //this.colorArr[index] = true
      console.log(item) //需要的参数可以通过方法 拿
      let res = new Array(this.colorArr.length).fill(false)
      res[index] = !res[index]
      EventBus.$emit('updateQuery', {
        walletPwd: this.walletPwd, 
        walletAddress: item.walletAddress, 
        walletPrivateKey: item.privateKey, 
        walletPublicKey: item.publicKey, 
        walletBalance: item.walletBalance,
        walletsArr: this.walletsArr,
        walletName: item.walletName ,
        colorArr: res
      })
      if (this.$route.name === 'wallet') {
        EventBus.$emit('updateWalletInfo', {
          walletPwd: this.walletPwd, 
          walletAddress: item.walletAddress, 
          walletPrivateKey: item.privateKey, 
          walletPublicKey: item.publicKey, 
          walletBalance: item.walletBalance,
          walletsArr: this.walletsArr,
          walletName: item.walletName ,
          walletIndex: index
        })
      } else {
        this.$router.push({
          name: 'wallet',
          query: {
            walletPwd: this.walletPwd, 
            walletAddress: item.walletAddress, 
            walletPrivateKey: item.privateKey, 
            walletPublicKey: item.publicKey, 
            walletBalance: item.walletBalance,
            walletsArr: this.walletsArr,
            walletName: item.walletName,
            walletIndex: index,
            colorArr: res,
            pageId: 1 
          }
        })
      }
    },
    createBtn() {
      let dirPath = require('os').homedir() + '/secwallet'
      let filePath = dirPath + '/default.data'
      fs.readFile(filePath, 'utf-8', this._checkWalletName.bind(this, this.newWalletName))
    },

    _checkWalletName(name, err, data) {
      let keyData = CryptoJS.AES.decrypt(data.toString(), this.walletPwd).toString(CryptoJS.enc.Utf8)
      let keyDataJSON = JSON.parse(keyData)
      let walletNamesArr = Object.keys(keyDataJSON)
      if (walletNamesArr.indexOf(name) > -1) {
          //In the array!
          this.$alert("Wallet name already exists", 'prompt', {
                confirmButtonText: 'OK',
          });
          return
      } else {
          //Not in the array
        // 创建钱包方法
        if (this.confirmP != this.password) {
           this.$alert('The password input is inconsistent twice, please re-enter', 'prompt', {
              confirmButtonText: 'Confirm',
          });
          return;
        }  else {
          let keys = SECUtil.generateSecKeys();
          let privKey64 = keys.privKey;
          this.newPrivateKey = privKey64;
          this.englishWords = SECUtil.entropyToMnemonic(privKey64);

          let pubKey128 = keys.publicKey;
          this.newPublicKey = pubKey128.toString("hex");

          //let userAddressBuffer = keys.secAddress;
          //let userAddress = userAddressBuffer.toString("hex");
          this.newAddress = keys.secAddress;

          let tokenInfo = {
            password: this.walletPwd
          };

          let token = jwt.sign(tokenInfo, "MongoX-Block", {
            expiresIn: 60 * 60 * 24
          });
          this.decoded = this.$JWT.verifyToken(token);
          if (this.decoded === "") {
            return;
          } else {
            // save to local file
            this.userToken = token;
          }
          this.createContent = false
          this.alreadySaved = false
          this.backUpContent = true
          this.closeAllowed = false
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
      this.createTabBtnActive1 = 'createTabBtnActive'
      this.createTabBtnActive2 = ''
      this.mainCntTab1 = true
      this.mainCntTab2 = false
      this.mnemonicTxt = ''
      fs.readFile(this.filePath, 'utf-8', this._fileRequest.bind(this, this.walletPwd, this.newDialogInput1))
    },
                  
    importingFrom() {
      this.createDialog = false
      try{
        this.mnemonicWallet.privateKey = SECUtil.mnemonicToEntropy(this.mnemonicTxt)
        let privKey64Buffer = Buffer.from(this.mnemonicWallet.privateKey, 'hex')

        let pubKey128 = SECUtil.privateToPublic(privKey64Buffer)
        this.mnemonicWallet.pubKey128ToString = pubKey128.toString('hex')

        let userAddressBuffer = SECUtil.publicToAddress(pubKey128, true)
        this.mnemonicWallet.userAddressToString = SECUtil.bufferToHex(userAddressBuffer).substring(2)
        // this.$alert('Successfully imported', 'prompt', {
        //       confirmButtonText: 'Confirm',
        //  });
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
                this.$alert(`The wallet information is already local, local wallet name ${walletName}`, 'prompt', {
                    confirmButtonText: 'Confirm',
                    callback: action => {
                      this.newDialogVisible1 = false
                      this.createTabBtnActive1 = 'createTabBtnActive'
                      this.createTabBtnActive2 = ''
                      this.mainCntTab1 = true
                      this.mainCntTab2 = false
                      this.mnemonicTxt = ''
                    }
                });
                return 
              }
          }
          if(walletNamesArr.indexOf(mnemonicName)>-1){
            //In the array!
            this.$alert("Importing is interrupted. Because wallet name already exists.", 'prompt', {
                  confirmButtonText: 'OK',
            });
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
            this.$alert(`Already saved the secure file would be saved in ${this.filePath}`, 'prompt', {
                confirmButtonText: 'Confirm',
            });
          })
          this.newDialogVisible1 = false
          this._mnemonicNavToWallet(this.keyFileDataJS, pwd)
        } catch(e) {
          this.$alert('Login error! Please confirm your password', 'prompt', {
                confirmButtonText: 'Confirm',
            });
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
            this.$alert('Unable to get balance, wallet address may be invalid', 'prompt', {
                confirmButtonText: 'Confirm',
            });
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
              privateKey: walletsArr[walletsArr.length-1].privateKey,
              publicKey: walletsArr[walletsArr.length-1].publicKey,
              walletAddress: walletsArr[walletsArr.length-1].walletAddress,
              walletBalance: walletsArr[walletsArr.length-1].walletBalance,
              walletsArr: walletsArr,
              walletName: walletsArr[walletsArr.length-1].walletName,
              colorArr: new Array(walletsArr.length-1).fill(false).concat([true]),
              pageId: 1
            })
          }
        })        
      }      
    },
    _navToAccountDetail: function(params) {
      EventBus.$emit('updateWalletInfo', {
        walletPwd: this.walletPwd, 
        walletAddress: params.walletAddress, 
        walletPrivateKey: params.privateKey, 
        walletPublicKey: params.publicKey, 
        walletBalance: '10',
        walletsArr: params.walletsArr,
        walletName: params.walletName,
        walletIndex: params.walletsArr.length-1
      })
    }
  },
  filters: {
    statusColor (status) {
        const statusMap = {
          0: 'testColor1',
          1: 'testColor2',
          2: 'testColor3',
          3: 'testColor4'
        }
        return statusMap[status]
    }
  },
  computed: {
    //创建钱包
    createActiveBtn () {
      return this.newWalletName.length > 0 ? true : false
    },
    publicBtnAcitve () {
      return this.mnemonicTxt.length > 0 ? true : false;
    },
    importActiveBtn () {
      return this.newDialogInput1.length > 0 ? true : false
    },
   }
}
</script>

<style scoped>
.btn {width: 160px;height: 58px;background: #fff;color: #657292;outline: none;position:fixed;
  bottom:24px;left: 102px;border-radius:2px;border: none;}

.backupCnt {display: flex;justify-content: center;flex: 1;}

.leftNavCnt {width: 190px;background: #EDF5F4;height:580px;padding-left: 30px;}
ul {padding-top:8px;overflow: hidden;overflow-y: scroll;height: 484px;}
li {width: 140px;height: 58px;display: flex;justify-content:center;margin-top: 16px;
    flex-direction: column;border:1px none;background: #fff;color:#657292;padding-left:20px;}
ul::-webkit-scrollbar { width: 2px; height: 2px;}
ul::-webkit-scrollbar-thumb { -webkit-box-shadow: inset 0 0 1px #00D6B2;background: #00D6B2;border-radius: 1px;}
ul::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 1px #EDF5F4;border-radius: 0; background: #EDF5F4;}
li:hover {cursor: pointer;background:#00D6B2;color:#fff;border-left: none;}

.borderColor1 {border-left: 2px solid #98A9D2;}
.borderColor2 {border-left: 2px solid #F5A623;}
.borderColor3 {border-left: 2px solid #FF8DB2;}
.borderColor4 {border-left: 2px solid #7498FB;}
.color0 {background:#00D6B2;color:#fff;border-left: none;}

/* 创建钱包 */
.mainCntTab {display: flex;justify-content: space-between;width: 380px;margin: 48px auto 32px;}
.mainCntTab1 {margin: 32px auto 0;width: 380px;height: 173px;}
.mainCntTab2 {margin: 32px auto 0;width: 380px;height: 173px;}
.createTabBtn {width: 190px;height: 36px;outline: none;background: #fff;color: #00D6B2;border: 1px solid rgba(0,214,178,0.6);}
.createTabBtnActive {background: rgba(0,214,178,0.6);color: #fff;border: none;}
.createTextarea {width:354px;height:79px;outline:none;border:1px solid #C8D1DA;padding: 12px;color:#242E49;
  outline:none;resize:none;}
/* 备份助记词 */
.mainCntTxt {color: #939CB2;text-align: left;margin:16px 0 8px 21px;}
.mainCntTxt p {margin-top: 6px;font-size: 12px;}

.mainCntList {width: 492px;margin: 0  auto;}
.wordsLine {width:466px;height:70px;outline:none;border:1px solid #C8D1DA;padding: 12px;color:#242E49;
display: flex;flex-wrap: wrap;}
.englishWords {display: flex;height: 10px;}
ul .iptTxt {color: #242E49;text-align: center;margin-right: 5px;}
.copyBtn {outline:none;width: 80px;height: 32px;background:#fff;color: #00D6B2;border: 1px solid #00D6B2;}
.copyBtnAcitve {background: #C8D1DA;color: #fff;border: 1px solid #C8D1DA;}
.copyBtn:hover {cursor: pointer;}
.copyTxt {color: #657292;font-size: 12px;margin-bottom: 1px;}
.copyTxt2 {color: #657292;margin-top:2px;font-size: 12px;word-wrap:break-word;word-break:break-all;}

.downTxt {color: #C8D1DA;font-size: 12px;margin: 11px 24px 11px 24px;}
.downTxt2 {font-size: 10ox;color: #657292;margin-left:5px;}
.agreementTxt {font-size: 14px;text-align: center;margin: 5px 0;color:#939CB2}
[type="checkbox"], [type="radio"] {vertical-align: middle;}

section >>> .el-input__inner {padding-left: 0;text-indent: 8px;height: 48px;}
section >>> .el-input__inner:focus {border-color: #c8d1da;}
section >>> .el-input__inner {border-radius: 2px;outline: none;}
section >>> .el-dialog__title {color: #939CB2;font-size: 16px;}
section >>> .el-dialog__header {border-bottom:1px solid rgba(200,209,218,0.5);height: 47px;line-height: 47px;padding: 0;}
section >>> .el-dialog {height: 288px;text-align: center;}
section >>> .el-dialog--center {height: 368px;}
section >>> .el-dialog__body {padding: 0;}
section >>> .el-dialog__footer {padding: 0;}
section >>> .el-dialog__headerbtn {top: 15px!important;right: 16px!important;}
</style>