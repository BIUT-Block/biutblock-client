<template>
  <el-container class="layoutCnt">
    <main class="publicContent">
      <el-row class="publicNav">
        <el-col :span="6">
          <router-link :to="{name: 'create', query: {
            id: this.id,
            privateKey: this.privateKey,
            publicKey: this.publicKey,
            walletAddress: this.secAddress,
            walletBalance: this.walletBalance,
            walletName: this.walletName,
            walletPwd: this.password,
            walletsArr: this.walletsArr,
            colorArr: this.colorArr
          }}">
            <i v-show="saveSuccess" class="el-icon-arrow-left icon_nav"></i>
          </router-link>
        </el-col>
        <el-col :span="12" class="navTit">
          Backup wallet
        </el-col>
        <!-- <el-col :span="6" class="windowsCnt">
          <i class="el-icon-minus icon_nav"></i>
          <span class="publicBtn amplification"></span>
          <i class="el-icon-close icon_nav"></i>
        </el-col> -->
      </el-row>


      <el-row class="backupCnt">
        <el-col :span="24" class="mainCnt">
          <section class="mainCntTxt">
            <p>Your password is encrypted, you can <span class="TxtColor pointerTxt" style="margin-left:8px;" @click="centerDialogVisible = true">Save as...</span></p>
            <p>Be sure to back up this file. You can retrieve your wallet and reset your password with a </p>
            <p>mnemonic or private key. If you lose this file, you will lose the assets in your wallet.</p>
          </section>

          <section class="mainCntList">
            <section class="wordsLine" id="englishWordsList">
                <ul v-for="wordsLine in englishWords" :key="wordsLine.index">
                  <li class="iptTxt">{{wordsLine[0]}}</li>
                  <li class="iptTxt">{{wordsLine[1]}}</li>
                  <li class="iptTxt">{{wordsLine[2]}}</li>
                  <li class="iptTxt">{{wordsLine[3]}}</li>
                </ul>
            </section>
            <section style="display: flex;justify-content: space-between;padding:0 8px;
            margin-top:23px;height:54px;background:rgba(250,250,250,1);border-radius:2px;align-items: center;">
              
                <qr-code :value="englishWordsString" :size="40" style="margin-top: 4px;">
                </qr-code>
              
              <section style="margin: 0 22px 0 8px;">
                <p class="copyTxt">Private key</p>
                <p class="copyTxt2" id="copyPrivateKey">{{privateKey}}</p>
              </section>
              <button data-clipboard-target="#copyPrivateKey" type="button" :class="copyBtnAcitve" class="copyBtn" @click="copyTxtCnt">{{copyTxtCntTit}}</button>
            </section>
          </section>

          <section class="publicCntBtn">
            <button class="publicBtn" :disabled="!alreadySaved" :class="alreadySaved?'publicBtnAcitve':''" @click="enterWallet1">Backed up, enter the wallet</button>
          </section>
          
         <el-dialog
            title="Download format"
            :visible.sync="centerDialogVisible"
            width="432px"
            :closeOnClickModal = false
            top="25vh"
            center>
            <div id="selectFileType" style="margin-top: 50px;">
              <p class="downTxt"><input type="radio" checked name="downImg" id="png">
                  <span class="downTxt2">Picture file(*.png)</span>Export files as images</p>

              <p class="downTxt"><input type="radio" name="downImg" id="jpg">
                <span class="downTxt2">JPG file(*.jpg)</span>Export to JPG file format (default is white background)</p>

              <!-- <p class="downTxt"><input type="radio" name="downImg"><span class="downTxt2">PDF file(*.pdf)</span> 
              Export to PDF file format</p>

              <p class="downTxt"><input type="radio" name="downImg"><span class="downTxt2">PDF file(*.pdf)</span> 
              Export HD PDF files (only partial font styles are supported)</p>

              <p class="downTxt"><input type="radio" name="downImg"><span class="downTxt2">POS file(*.pos)</span> 
              Contains image and graphic structure definitions (can be imported)</p> -->

              <!-- <p class="downTxt"><input type="radio" name="downImg" id="svg"><span class="downTxt2">SVG file(*.svg)</span> 
              Export to SVG vector graphics</p> -->
            </div>

            <span slot="footer" class="dialog-footer">
              <button class="publicBtn publicBtnAcitve" style="margin-top:82px;" @click="saveFile">Confirm</button>
            </span>
          </el-dialog>

          <el-dialog
            title="prompt"
            :visible.sync="dialogVisible"
            width="432px"
            :show-close = true
            :closeOnClickModal = false
            top="25vh"
            center>
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
              <button class="publicBtn publicBtnAcitve" style="margin-top:67px"  @click="enterWallet">Enter the wallet</button>
            </span>
          </el-dialog>

        </el-col>
      </el-row>
    </main>
    
  </el-container> 
</template>

<script>
import Clipboard from 'clipboard'
import domtoimage from 'dom-to-image'
import qrCode from '../wallet/components/qrCode'
const CryptoJS = require("crypto-js")
const fs = require("fs")
const FileSaver = require('file-saver')
export default {
  name: '',
  components: {
    qrCode
  },
  data() {
    return {
      copyBtnAcitve: '',
      copyTxtCntTit: 'Copy',
      id: '',
      centerDialogVisible: false,
      dialogVisible: false,
      englishWords: [[]],
      englishWordsString: '',
      privateKey: "",
      password: "",
      keyFileDataJS: {},
      walletPwd: "",
      walletName: "",
      walletsArr: '',
      walletBalance: "",
      alreadySaved: false,
      colorArr: [],
      saveSuccess: true
    }
  },
  methods: {
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
    saveFile () {
      this.centerDialogVisible = false
      let dirPath = require('os').homedir() + '/secwallet'
      let filePath = dirPath + '/default.data'
      if (!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath);
      }
      if (!fs.existsSync(filePath) || !this.walletPwd || this.walletPwd === ""){
        this.keyFileDataJS = {
          [this.walletName]:
          {
            privateKey: this.privateKey,
            publicKey: this.publicKey,
            walletAddress: this.secAddress
          }
        }
        let keyFileData = JSON.stringify(this.keyFileDataJS)
        let cipherKeyData = CryptoJS.AES.encrypt(keyFileData, this.password)
        fs.writeFile(dirPath+'/default.data', cipherKeyData, (err) => {
          if(err) {
            return
          }
          this._createImageFile(dirPath)   
        })
        
      } else {
        fs.readFile(filePath, 'utf-8', this._AppendWallet.bind(this, filePath))
      }
    },
    _AppendWallet: function(filePath, err, data){
        if (err) {
          return
        }
        this.alreadySaved = true
        try {
          let keyData = CryptoJS.AES.decrypt(data.toString(), this.walletPwd).toString(CryptoJS.enc.Utf8)
          let keyDataJSON = JSON.parse(keyData)
          keyDataJSON[this.walletName] = {
            privateKey: this.privateKey,
            publicKey: this.publicKey,
            walletAddress: this.secAddress
          }
          this.keyFileDataJS = keyDataJSON
          let keyFileData = JSON.stringify(keyDataJSON)
          let cipherKeyData = CryptoJS.AES.encrypt(keyFileData, this.walletPwd)
          fs.writeFile(filePath, cipherKeyData, (err) => {
            if(err) {
              return
            }
            this._createImageFile(require('os').homedir() + '/secwallet')
          //  this._saveWalletSuccess(filePath)          
          })
        } catch(e) {
          return
        }
    },
    _createImageFile (filePath) {
      let domSection = document.getElementById('englishWordsList')
      if (document.getElementById('png').checked) {
        domtoimage.toBlob(domSection)
                  .then( (blob) => {
                      FileSaver.saveAs(blob, 'englishWords.png');
                      this._saveWalletSuccess(filePath)
                  })
        return
      }
      if (document.getElementById('jpg').checked) {
        domtoimage.toJpeg(domSection, { quality: 0.95 })
          .then( (dataUrl) => {
            let link = document.createElement('a')
            link.download = 'englishWords.jpeg'
            link.href = dataUrl
            link.click()
            this._saveWalletSuccess(filePath)
         })
         return
      }
      this.$alert('Select a file format to save your english words', 'prompt', {
          confirmButtonText: 'Confirm',
      });
      return
    },
    _saveWalletSuccess (filePath) {
      this.alreadySaved = true
      this.saveSuccess = false
      // this.$alert(`Already saved png file and the secure file would be saved in ${filePath}`, 'prompt', {
      //     confirmButtonText: 'Confirm',
      // });
    },
    enterWallet1 () {
      this.dialogVisible = true
    },
    enterWallet() {
      this.dialogVisible = false
      let walletsArr = []
      let walletNamesArr = Object.keys(this.keyFileDataJS)
      let walletInfo = {}
      for (let walletName of walletNamesArr) {
        walletInfo = this.keyFileDataJS[walletName]
        walletInfo["walletName"] = walletName
        walletsArr.push(walletInfo)
      }
      if (this.walletPwd) {
        this.$router.push({name: 'wallet', query: {
            privateKey: this.privateKey,
            publicKey: this.publicKey,
            walletAddress: this.secAddress,
            walletBalance: '10',
            walletsArr: walletsArr,
            walletPwd: this.walletPwd,
            walletName: this.walletName,
            colorArr: new Array(walletsArr.length-1).fill(false).concat([true]),
            pageId: 1
        }})
      } else {
        this.$router.push({name: 'wallet', query: {
            privateKey: this.privateKey,
            publicKey: this.publicKey,
            walletAddress: this.secAddress,
            walletBalance: '10',
            walletsArr: walletsArr,
            walletPwd: this.password,
            walletName: this.walletName,
            colorArr: new Array(walletsArr.length-1).fill(false).concat([true]),
            pageId: 1
        }})
      }
    }
  },
  created() {
    this.id = this.$route.query.id
    this.privateKey = this.$route.query.privateKey
    this.publicKey = this.$route.query.publicKey
    this.walletPwd = this.$route.query.walletPwd
    if(this.id==="3"){
      this.password = this.$route.query.walletPwd
    } else {
      this.password = this.$route.query.password
    }
    this.secAddress = this.$route.query.userAddress
    this.walletName = this.$route.query.walletName
    this.walletBalance = this.$route.query.walletBalance
    if (this.$route.query.colorArr) {
      this.colorArr = this.$route.query.colorArr
    }    
    if (this.$route.query.walletsArr) {
      this.walletsArr = this.$route.query.walletsArr
    }
    let lineCount = 0
    let englishWords = this.$route.query.englishWords.split(' ')
    this.englishWordsString = this.$route.query.englishWords
    for(let i = 0; i < englishWords.length; i++) {
      if ( i % 4 === 0 && i !== 0 ) {
        lineCount ++
        this.englishWords[lineCount] = []
        //continue
      }
      this.englishWords[lineCount][i % 4] = englishWords[i]
    }
    this.walletPwd = this.$route.query.walletPwd
  
  },
  computed: {
    checkAlreadySaved () {
      return this.alreadySaved
    }
  }
}
</script>

<style scoped>
.layoutCnt {display: flex;flex-direction: column;height: 100vh;justify-content: center;align-items: center;}
.mainCnt {background: #FFFFFF;width:492px;margin-top: 104px;}
.backupCnt {display: flex;justify-content: center;flex: 1;}

.mainCntList {width: 492px;margin: 16px auto 49px;}

input[type="radio"] {vertical-align: middle;background-color: #01cd78;
    background-clip: content-box;
    padding: .2em;}
input[type="radio"]:checked + label::before {
    background-color: #01cd78;
    background-clip: content-box;
    padding: .2em;
}


.mainCntTxt {color: #939CB2;text-align: left;margin-bottom:15px;width:100%;}
.mainCntTxt p {margin-top: 6px;}

.downTxt {color: #C8D1DA;font-size: 12px;margin: 11px 0 11px 24px;}
.downTxt2 {font-size: 10ox;color: #657292;margin:0 5px;}

.agreementTxt {font-size: 14px;text-align: center;margin: 5px 0;color:#939CB2}

ul {display: flex;height: 20px;}
ul .iptTxt {color: #657292;text-align: center;margin-right: 5px;}



.copyBtn {outline:none;width: 80px;height: 32px;background:#fff;color: #00D6B2;border: 1px solid #00D6B2;}
.copyBtnAcitve {background: #C8D1DA;color: #fff;border: 1px solid #C8D1DA;}
.copyBtn:hover {cursor: pointer;}
.copyTxt {color: #939CB2;}
.copyTxt2 {color: #657292;margin-top:4px;word-wrap:break-word;word-break:break-all;}

.wordsLine {width:466px;height:71px;outline:none;border:1px solid #C8D1DA;padding: 12px;color:#242E49;
display: flex;flex-wrap: wrap;}

section >>> .el-dialog__title {color: #939CB2;font-size: 16px;}
section >>> .el-dialog__header {height: 47px;line-height: 47px;padding: 0;border-bottom:1px solid rgba(200,209,218,0.5);}
section >>> .el-dialog--center {height: 288px;}
section >>> .el-dialog__body {padding: 0;}
section >>> .el-dialog__footer {padding: 0;}
section >>> .el-dialog__headerbtn {top: 15px!important;right: 16px!important;}
</style>
