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
          <button class="btn pointerTxt" @click="createWallet"><sapn style="font-size: 20px;vertical-align: middle;">+</sapn> Create a wallet</button>
        </section>
      </el-col>
    </el-row>

    <!-- 创建钱包弹窗 -->
    <el-dialog
      title="prompt"
      :visible.sync="createDialog"
      width="534px"
      :show-close = true
      :closeOnClickModal = false
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
                v-model="walletName"
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
      <section v-show="backUoContent">
          <section class="mainCntTxt">
            <p>Your password is encrypted, you can <span class="TxtColor pointerTxt" style="margin-left:8px;" @click="savaImgDialog = true">Save as...</span></p>
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
            margin:17px 0 20px;height:54px;background:rgba(250,250,250,1);border-radius:2px;align-items: center;">
                <qr-code :value="englishWordsString" :size="80" class="receiptCntImg">
                </qr-code>
              <section style="margin: 0 22px 0 8px;">
                <p class="copyTxt">Private key</p>
                <p class="copyTxt2" id="copyPrivateKey">{{privateKey}} 3A4B8C0d3242565655445aoqwu923700sdfpsf280ru23asfs7saf 78asfaafaf5</p>
              </section>
              <button data-clipboard-target="#copyPrivateKey" type="button"  :class="copyBtnAcitve" class="copyBtn" @click="copyTxtCnt">{{copyTxtCntTit}}</button>
            </section>
          </section>
          <section class="publicCntBtn">
            <button class="publicBtn" @click="enterWallet">Backed up, enter the wallet</button>
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
          <p class="downTxt"><input type="radio" name="downImg" id="png">
            <span class="downTxt2">Picture file(*.png)</span>Export files as images</p>
          <p class="downTxt"><input type="radio" name="downImg" id="jpg">
            <span class="downTxt2">JPG file(*.jpg)</span>Export to JPG file format (default is white background)</p>
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
    
  </el-container>  
</template>

<script>
import {EventBus} from "../../../lib/EventBus.js"
import Clipboard from 'clipboard'
export default {
  name: '',
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
      walletName: '',
      mnemonicTxt: '',
      createContent: true,

      //备份助记词
      backUoContent: false,
      copyBtnAcitve: '',
      copyTxtCntTit: 'Copy',
      privateKey: '',

      agreementDialog: false, //协议
      savaImgDialog: false //保存图片
    }
  },
  methods: {
    //创建钱包
    createBtn () {
      //创建钱包成功
      this.createContent = false
      this.backUoContent = true
    },
    importingFrom () {
      //导入助记词成功
      this.createDialog = false
    },
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
    },
    //保存好图片后进入协议界面
    enterWallet () {
      //先打开协议
      this.agreementDialog = true
    },
    //同意协议
    enterTheWallet () {
      this.agreementDialog = false
      this.createDialog = false
      this.createContent = true
      this.backUoContent = false
    },
    createWallet () {
      this.createDialog = true
      // this.$router.push({ 
      //   name: 'create',
      //   query: {
      //     id: "3",
      //     walletPwd: this.walletPwd,
      //     walletAddress: this.walletAddress, 
      //     walletPrivateKey: this.walletPrivateKey, 
      //     walletPublicKey: this.walletPublicKey, 
      //     walletBalance: this.walletBalance,
      //     walletsArr: this.walletsArr,
      //     walletName: this.walletName,
      //     colorArr: this.colorArr
      //   }
      // })
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
      return this.walletName.length > 0 ? true : false
    },
    publicBtnAcitve () {
      return this.mnemonicTxt.length > 0 ? true : false;
    }
   }
}
</script>

<style scoped>
.btn {width: 160px;height: 58px;background: #fff;color: #657292;outline: none;position:fixed;
  bottom:24px;left: 102px;border-radius:2px;border: none;}


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
.mainCntTxt {color: #939CB2;text-align: left;margin:16px auto 8px;width:492px;}
.mainCntTxt p {margin-top: 6px;font-size: 12px;}

.mainCntList {width: 492px;margin: 0  auto;}
.wordsLine {width:466px;height:70px;outline:none;border:1px solid #C8D1DA;padding: 12px;color:#242E49;
display: flex;flex-wrap: wrap;}
.copyBtn {outline:none;width: 80px;height: 32px;background:#fff;color: #00D6B2;border: 1px solid #00D6B2;}
.copyBtnAcitve {background: #C8D1DA;color: #fff;border: 1px solid #C8D1DA;}
.copyBtn:hover {cursor: pointer;}
.copyTxt {color: #657292;font-size: 12px;margin-bottom: 1px;}
.copyTxt2 {color: #657292;margin-top:2px;font-size: 12px;word-wrap:break-word;word-break:break-all;}

.downTxt {color: #C8D1DA;font-size: 12px;margin: 11px 0 11px 24px;}
.downTxt2 {font-size: 10ox;color: #657292;margin:0 5px;}
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
</style>