<template>
  <el-container class="layoutCnt">
    <main style="width: 700px;height: 600px;border:1px solid #ccc;">
      <el-row class="publicNav">
        <el-col :span="6">
          <router-link to="/create?id=1">
            <i class="el-icon-arrow-left icon_nav"></i>
          </router-link>
        </el-col>
        <el-col :span="12" class="navTit">
          Backup wallet
        </el-col>
        <el-col :span="6" class="windowsCnt">
          <i class="el-icon-minus icon_nav"></i>
          <span class="publicBtn amplification"></span>
          <i class="el-icon-close icon_nav"></i>
        </el-col>
      </el-row>

      <el-row class="backupCnt">
        <el-col :span="24" class="mainCnt">
          <section class="mainCntTxt">
            <p>Your password is encrypted, you can <span class="TxtColor pointerTxt" @click="centerDialogVisible = true">Save as...</span></p>
            <p>Be sure to back up this file. You can retrieve your wallet and reset your password with a mnemonic or</p>
            <p>private key. If you lose this file, you will lose the assets in your wallet.</p>
          </section>

          <section class="mainCntList">
            <div v-for="wordsLine in englishWords" :key="wordsLine.index">
              <ul>
                <li class="iptTxt">{{wordsLine[0]}}</li>
                <li class="iptTxt">{{wordsLine[1]}}</li>
                <li class="iptTxt">{{wordsLine[2]}}</li>
                <li class="iptTxt">{{wordsLine[3]}}</li>
              </ul>
            </div>
            <span class="line"></span>

            <section style="display: flex;justify-content: space-between;">
              <figure>
                <img src="../../assets/image/backupImg.png" alt="">
              </figure>
              <section>
                <p class="copyTxt">Private key</p>
                <p class="copyTxt2" id="testTxt">{{privateKey}}</p>
              </section>
              <button data-clipboard-target="#testTxt" type="button" class="copyBtn" @click="copyTxtCnt">Copy</button>
            </section>
          </section>

          <section class="publicCntBtn">
            <button class="publicBtn publicBtnAcitve" @click="enterWallet">Backed up, enter the wallet</button>
          </section>
          
          <el-dialog
            title="Download format"
            :visible.sync="centerDialogVisible"
            width="530px"
            :show-close=false
            :closeOnClickModal = false
            center>
            <p class="downTxt"><input type="radio" name="downImg"><span class="downTxt2">Picture file(*.png)</span> 
            Export files as images</p>

            <p class="downTxt"><input type="radio" name="downImg"><span class="downTxt2">JPG file(*.jpg)</span> 
            Export to JPG file format (default is white background)</p>

            <p class="downTxt"><input type="radio" name="downImg"><span class="downTxt2">PDF file(*.pdf)</span> 
            Export to PDF file format</p>

            <p class="downTxt"><input type="radio" name="downImg"><span class="downTxt2">PDF file(*.pdf)</span> 
            Export HD PDF files (only partial font styles are supported)</p>

            <p class="downTxt"><input type="radio" name="downImg"><span class="downTxt2">POS file(*.pos)</span> 
            Contains image and graphic structure definitions (can be imported)</p>

            <p class="downTxt"><input type="radio" name="downImg"><span class="downTxt2">SVG file(*.svg)</span> 
            Export to SVG vector graphics</p>
            <span slot="footer" class="dialog-footer">
              <button class="publicBtn publicBtnAcitve" @click="saveFile">determine</button>
              <button class="publicBtn publicBtnAcitve" @click="centerDialogVisible = false">cancel</button>
            </span>
          </el-dialog>

          <el-dialog
            title=""
            :visible.sync="dialogVisible"
            width="432px"
            :show-close=false
            :closeOnClickModal = false
            center>
            <p class="agreementTxt">
              Be sure to back up your mnemonics 
            </p>
            <p class="agreementTxt">
              and private keys. If the mnemonics and private keys
            </p>
            <p class="agreementTxt">
              are lost,you will permanently lose your assets.
            </p>
            <span slot="footer" class="dialog-footer">
              <button class="publicBtn publicBtnAcitve" @click="dialogVisibleFrom">Enter the wallet</button>
            </span>
          </el-dialog>
        </el-col>
      </el-row>
    </main>
    
  </el-container> 
</template>

<script>
import Clipboard from 'clipboard'
const CryptoJS = require("crypto-js");
const fs = require("fs")
export default {
  name: '',
  data() {
    return {
      centerDialogVisible: false,
      dialogVisible: false,
      englishWords: [[]],
      privateKey: "",
      password: "",
      keyFileDataJS: {},
      walletPwd: "",
      walletName: ""
    }
  },
  methods: {
    copyTxtCnt () {
        var clipboard = new Clipboard('.copyBtn')
        clipboard.on('success', e => {
          this.$alert('复制成功', '温馨提示', {
            confirmButtonText: '确定',
            callback: action => {
              
            }
          });
          clipboard.destroy()
        })
        clipboard.on('error', e => {
          this.$alert('该浏览器不支持自动复制', '温馨提示', {
            confirmButtonText: '确定',
            callback: action => {}
          });
          clipboard.destroy()
        })
    },
    dialogVisibleFrom () {
      this.dialogVisible = false
      this.$router.push('/create?id=2')
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
        })
      } else {
        fs.readFile(filePath, 'utf-8', this._AppendWallet.bind(this, filePath))
      }
    },
    _AppendWallet: function(filePath, err, data){
        if (err) {
          return
        }
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
          })
        } catch(e) {
          return
        }
    },
    enterWallet() {
      this.dialogVisible = true
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
            walletPwd: this.walletPwd
        }})
      } else {
        this.$router.push({name: 'wallet', query: {
            privateKey: this.privateKey,
            publicKey: this.publicKey,
            walletAddress: this.secAddress,
            walletBalance: '10',
            walletsArr: walletsArr,
            walletPwd: this.password
        }})
      }
    }
  },
  created() {
    this.privateKey = this.$route.query.privateKey
    this.publicKey = this.$route.query.publicKey
    this.password = this.$route.query.password
    this.secAddress = this.$route.query.userAddress
    this.walletPwd = this.$route.query.walletPwd
    this.walletName = this.$route.query.walletName
    let lineCount = 0
    let englishWords = this.$route.query.englishWords.split(' ')
    for(let i = 0; i < englishWords.length; i++) {
      if ( i % 4 === 0 && i !== 0 ) {
        lineCount ++
        this.englishWords[lineCount] = []
        //continue
      }
      this.englishWords[lineCount][i % 4] = englishWords[i]
    }
  }
}
</script>

<style scoped>
.layoutCnt {background: #fff;display: flex;flex-direction: column;height: 100vh;justify-content: center;align-items: center;}
.mainCnt {background: #FFFFFF;width:570px;}
.backupCnt {display: flex;justify-content: center;flex: 1;}

.mainCntList {width: 500px;margin: 16px auto 32px;}

input[type="radio"] {vertical-align: middle;}
.line {display: block;width:500px;height: 1px;border-top: 1px dashed #C8D1DA;margin: 17px auto 14px;}

.mainCntTxt {width: 570px;color: #939CB2;text-align: center;line-height: 1.5;}

.downTxt {color: #C8D1DA;font-size: 12px;margin: 11px 0;}
.downTxt2 {font-size: 10ox;color: #657292;margin:0 5px;}

.agreementTxt {color: #FF8DB2;font-size: 16px;text-align: center;margin: 10px 0;}

ul {display: flex;}
ul .iptTxt {width: 116px;height: 36px;border: 1px solid #C8D1DA;color: #C8D1DA;line-height: 36px;text-align: center;margin-top: 12px;margin-right: 12px;}
ul .iptTxt:last-child {margin-right: 0;}


.copyBtn {outline:none;width: 116px;height: 36px;border: 1px solid #C8D1DA;background:#fff;color: #C8D1DA;}
.copyBtn:hover {cursor: pointer;}
.copyTxt {font-size: 12px;color: #657292;}
.copyTxt2 {font-size: 14px;color: #657292;margin-top:10px;}

section >>> .el-dialog__title {color: #939CB2}
</style>
