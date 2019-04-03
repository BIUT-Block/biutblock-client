<template>
  <!-- 遮罩层弹窗 -->
  <main>
      <section class="mask" v-show="maskShow">
      <!-- <section class="mask"></section> -->
      <section class="mask-container wallet-mask">
        <img
          src="../../../assets/images/closeMask.png"
          alt=""
          class="closeImg"
          title="close"
          @click="clostMask"
        />
        <!-- 转账 maskPages = 4 Sent -->
        <section class="wallet-mask-sent" v-show="maskPages == 4">
          <!-- 填写转账信息 --> 
          <section v-show="sentPages == 1">
            <h3>Sent</h3>
            <p>FROM</p>
            <span class="wallet-mask-sent-from-address">0x{{selectedWallet.walletAddress}}</span>
            <p>TO</p>
            <section class="wallet-mask-sent-to-address">
              <input type="text" placeholder="Receive Address" v-model="sentAddress" maxlength="42"/>
              <img src="../../../assets/images/clearAddress.png" v-show="clearSentAddressImg" alt="" @click="clearSentAddress"/>
            </section>
            <wallet-tips :tips="addressError"/>
            <p>AMOUNT</p>
            <section class="wallet-mask-sent-amount">
              <input type="text" v-model="sentTradingAmount" :placeholder="allAmountPlace" maxlength="20"
                @input="clearAmount" onpaste="return false"/>
              <section>
                <img src="../../../assets/images/clearAddress.png" v-show="clearSentAmountImg" @click="clearSentAmount" alt="" />
                <section>
                  <span>SEC</span>
                  <span @click="sentAllAmount">ALL</span>
                </section>
              </section>
            </section>

            <button type="button" @click="clostMask">Cancel</button>
            <button type="button"
                    :disabled="!sentActive"
                    :class="sentActive ? 'passCorrect' : ''"
                    @click="sentConfirm">Sent</button>
          </section>

          <!-- 确认转账 -->
          <section v-show="sentPages == 2">
            <h3>Confirm The Following information</h3>
            <wallet-tips :tips="sessionAddress" style="font-size: 14px;"/>
            <p>FROM</p>
            <span class="wallet-mask-sent-from-address">0x{{selectedWallet.walletAddress}}</span>
            <p>TO</p>
            <span class="wallet-mask-sent-from-address">{{sentAddress}}</span>
            <p>AMOUNT</p>
            <span class="wallet-mask-sent-from-address">{{sentTradingAmount}}</span>
            <button type="button" @click="backSent">Back</button>
            <button type="button" class="passCorrect" @click="sent">Confirm</button>
          </section>

        </section>

        <!-- 二维码 maskPages = 5 receive -->
        <section class="wallet-mask-receive" v-show="maskPages == 5">
          <h3>Receive</h3>
          <p>Account</p>
          <span>0x{{selectedWallet.walletAddress}}</span>
          <p>Amount</p>
          <section>
            <input type="text" maxlength="20"
            v-model="receiveAmount" @input="clearNoNum" onpaste="return false"/>
            <label>SEC</label>
          </section>
          <wallet-tips :tips="receiveError" />
          <qrcode :value="qrcodeWalletAddress" :options="{ size: 93 }"></qrcode>
          <span>Your address(QR Code)</span>
        </section>

        <!-- 导出私钥 maskPages = 0 Export Private key -->
        <section class="wallet-mask-priivate-key" v-show="maskPages == 0">
          <h3>Export Private key</h3>
          <wallet-tips :tips="privateKey" />
          <section id="privateKey">
            {{selectedWallet.privateKey}}
          </section>
          <span class="priivate-key-button copyButton" @click="copyCnt" 
              data-clipboard-target="#privateKey"
              :class="copySuccess ? 'copySuccessBg' : ''">
            {{ copyButtonText }}
          </span>
        </section>

        <!-- 导出keyStore文件 maskPages = 1  Export Keystore -->
        <section class="wallet-mask-keystroe" v-show="maskPages == 1">
          <h3>Export Keystore</h3>
          <wallet-input-pass
            placeholder="Enter your new password"
            maxlength="30"
            v-model="walletNewPass"
            @input="inputContent"></wallet-input-pass>
          <wallet-tips :tips="passFormat" class="tips" />
          <span class="wallet-button" @click="clostMask">Cancel</span>
          <span class="wallet-button" 
                :disabled="!keystroeActive"
                :class="keystroeActive ? 'keystroeActive' : ''"
                @click="importantKeystroe">
              Confirm
          </span>
        </section>

        <!-- 导出助记词Export maskPages = 2 Phrase -->
        <section class="wallet-mask-phrase" v-show="maskPages == 2">
          <h3>Export Phrase</h3>
          <ul>
            <li>{{selectedWallet.englishWords}}</li>
          </ul>
          <span class="wallet-button" @click="importantPhrase">Confirm</span>
        </section>

        <!-- 删除钱包 maskPages = 3 delete -->
        <section class="wallet-mask-delete" v-show="maskPages == 3">
          <p>
            Confirm to delete your wallet? Please make sure you have backed up
            your wallet.
          </p>
          <span class="wallet-button" @click="deleteWallet">Delete</span>
        </section>

        <section class="wallet-mask-delete" v-show="maskPages == 6">
          <p>
            The wallet is bind to mining. You can not remove it.
          </p>
          <span class="wallet-button" @click="clostMask">Confirm</span>
        </section>
      </section>
    </section>
    <!-- 透明弹窗 -->
    <wallet-translucent :text="translucentText" v-show="translucentShow"/>
  </main>
</template>

<script>
import walletTips from '../../../components/wallet-tips'
import walletInputPass from '../../../components/wallet-input-pass'
import walletTranslucent from '../../../components/wallet-translucent'
import Qrcode from '@xkeshi/vue-qrcode'
import Clipboard from 'clipboard'
import WalletHandler from '../../../lib/WalletsHandler';
export default {
  name: 'walletMask',
  components: {
    qrcode: Qrcode,
    walletInputPass,
    walletTips,
    walletTranslucent
  },
  props: {
    maskPages: Number,
    maskShow: Boolean,
    selectedWallet: Object,
    walletData: Object,
    balance: String
  },
  data() {
    return {
      qrcodeWalletAddress: '',//二维码内容
      sessionAddress: 'You are sending assets to the following address, please confirm the operation',
      addressError: 'Addresses are generally 42-bit characters beginning with 0x',
      amountError: '',
      receiveError: '',
      passFormat: '8-30 characters, must contain at least 2 types of numbers, English letters, and special characters',
      privateKey: 'Security Warning: The private key is not encrypted and the export is risky. Here recommend to backup with mnemonic and Keystore.',
      walletAddress: '0x27e7192fdbe340c8bc9569bb4bf2f15e76e9fed3',
      walletNewPass: '',
      
      sentAddress: '',//转账地址
      sentTradingAmount: '',//转账金额
      sentPages: 1,//默认显示转账页面
      //allAmountPlace: "Maximum input of " + this.balance,//默认字符总金额
      allAmount: this.balance,//总金额
      translucentShow: false, //弹窗
      translucentText: 'Copy success',

      copyButtonText: 'copy',
      copySuccess: false,
      copyTime: 3,
      receiveAmount: '',//二维码收款金额
      amountPlaceHolder: `Maximum input of ${this.balance}`,
    }
  },
  computed: {
    //转账地址清空按钮
    clearSentAddressImg () {
      return this.sentAddress.length > 0 ? true : false
    },

    //保存私钥按钮是否可点击
    keystroeActive () {
      let pass = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,30}$/
      return this.walletNewPass.length > 7 && pass.test(this.walletNewPass) ? true : false
    },

    allAmountPlace () {
      return "Maximum input of " + this.balance
    },

    //转账按钮是否可点击
    sentActive () {
      let addressRgs = /^(0x)(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]+$/
      let walletAddress = '0x' + this.selectedWallet.walletAddress
      return this.sentAddress.length > 41 
              && Number(this.sentTradingAmount) > 0 
              && this.sentAddress !== walletAddress
              && Number(this.sentTradingAmount) <= Number(this.balance)
              && addressRgs.test(this.sentAddress) ? true : false
    },

    //转账金额清空按钮
    clearSentAmountImg () {
      return this.sentTradingAmount.length > 0 ? true : false
    },

  },
  watch:{
    receiveAmount(newVal,oldVal){
      this.qrcodeWalletAddress = this.selectedWallet.walletAddress + "###" +newVal
    }
  },
  created() {
    
  },
  mounted() {

  },
  destroyed() { },

  methods: {
    getCaption(obj) {
        var index=obj.lastIndexOf(".");
        obj=obj.substring(index+1,obj.length);
        return obj;
    },  

    //不能输入中文
    inputContent () {
      this.$nextTick(()=> {
        this.walletNewPass = this.walletNewPass.replace(/[\u4E00-\u9FA5]/g,'')
      })
    },

    isAddress () {
      if (!/^0x([a-z0-9]{40})$/.test(this.sentAddress))  {
        return false
      } else {
        return true;
      }
    },

    //关闭弹窗调用该组件
    clostMask () {
      this.receiveAmount = ''
      this.sentAddress = ''
      this.sentTradingAmount = ''
      this.walletNewPass = ''
      this.sentPages = 1
      this.$emit("changeClose","")
    },

    //确认转账页面
    sentConfirm () {
      this.sentPages = 2
      let amount = this.getCaption(this.sentTradingAmount)
      if (amount == "") {
        this.sentTradingAmount = this.sentTradingAmount + "0"
      }
    },

    //返回转账页面
    backSent () {
      this.sentPages = 1
      this._resetErrorText()
      this.sentAddress = ''
      this.sentTradingAmount = ''
      this.receiveAmount = ''
      //this.$emit("changeClose","")
    },
    
    _resetErrorText () {
      this.addressError = 'Addresses are generally 42-bit characters beginning with 0x'
      this.amountError = ''
      this.receiveError = ''
    },

    //转账
    sent () {
      let sendToAddress = ''

      if (!this.isAddress()) {
        this.addressError = "Invalid address formatt."
        return
      }

      if (this.sentAddress === this.selectedWallet.walletAddress || this.sentAddress.replace("0x", "") === this.selectedWallet.walletAddress) {
        this.addressError = "You can not tranfer to yourself."
        return
      }

      if (this.sentAddress.substring(0, 2) === '0x' && this.sentAddress.length === 42) {
        sendToAddress = this.sentAddress.substring(2, this.sentAddress.length)
      } else {
        sendToAddress = this.sentAddress
      }
      let encryptTransferData = WalletHandler.encryptTransaction(this.selectedWallet.privateKey, {
        walletAddress: this.selectedWallet.walletAddress,
        sendToAddress: sendToAddress,
        amount: this.sentTradingAmount + ''
      })
      this.$JsonRPCClient.sendTransactions(this.selectedWallet.walletAddress, encryptTransferData, (balance) => {
        this.$emit('updateWalletBalance', balance, this.selectedWallet.walletAddress)
      })

      this.clostMask()
      this.translucentShow = true
      this.translucentText = "Submitted successfully"
      setTimeout(() => {
        this.translucentShow = false
      }, 3000)
      
    },

    //导出keystroe文件
    importantKeystroe () {
      let keyDataJSON = {}
      keyDataJSON[this.selectedWallet.walletAddress] = this.walletData
      WalletHandler.saveKeyStore(`SEC${this.selectedWallet.walletAddress}`, keyDataJSON, this.walletNewPass)
      this.clostMask()
    },

    //导出助记词
    importantPhrase () {
      WalletHandler.savePhrase(`SEC${this.selectedWallet.walletAddress}`, this.selectedWallet.englishWords)
      this.clostMask()
    },

    //删除钱包
    deleteWallet () {
      WalletHandler.removeWalletFromFile(this.selectedWallet, (wallets) => {     
        this.$emit('updateWalletList', wallets)
      })
      this.clostMask ()
    },
    
    //二维码扫描只能输入金额
    clearNoNum () {
      console.log(this.receiveAmount)
      this.receiveAmount =  this.receiveAmount.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
      this.receiveAmount =  this.receiveAmount.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
      this.receiveAmount =  this.receiveAmount.replace(/^\.$/, ""); //只保留第一个. 清除多余的
      this.receiveAmount =  this.receiveAmount.replace(".","$#$").replace(/\./g,"").replace("$#$","."); 
      this.receiveAmount=  this.receiveAmount.replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d\d\d).*$/,'$1$2.$3');//只能输入两个小数  
      if( this.receiveAmount.indexOf(".") < 0 &&  this.receiveAmount !=""){ //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
          this.receiveAmount=  this.receiveAmount 
      }
    },

    //转账只能输入金额
    clearAmount () {
      this.sentTradingAmount =  this.sentTradingAmount.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
      this.sentTradingAmount =  this.sentTradingAmount.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
      this.sentTradingAmount =  this.sentTradingAmount.replace(/^\.$/, ""); //只保留第一个. 清除多余的
      this.sentTradingAmount =  this.sentTradingAmount.replace(".","$#$").replace(/\./g,"").replace("$#$","."); 
      this.sentTradingAmount=  this.sentTradingAmount.replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d\d\d).*$/,'$1$2.$3');//只能输入两个小数  
      if( this.sentTradingAmount.indexOf(".") < 0 &&  this.sentTradingAmount !=""){ //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
          this.sentTradingAmount= this.sentTradingAmount
      }
    },

    //复制私钥
    copyCnt () {
      var clipboard = new Clipboard('.copyButton')
      this.copySuccess = true
      clipboard.on('success', e => {
          clipboard.destroy()
          let clock = window.setInterval(() => {
            var x = this.copyTime--
            this.copyButtonText = "copy（"+ x +"）"
            if(this.copyTime < 0){ // = 0 就停止
              this.copyTime = 3  //恢复默认值
              this.copySuccess = false
              this.copyButtonText = "Copy"
              window.clearInterval(clock) //清空计时器
            }
          },1000)
      })
      clipboard.on('error', e => {
          let clock = window.setInterval(() => {
            var x = this.copyTime--
            this.copyButtonText = "Copy the failure("+ x +")"
            if(this.copyTime < 0){ // = 0 就停止
              this.copyTime = 5  //恢复默认值
              this.copySuccess = false
              this.copyButtonText = "Copy"
              window.clearInterval(clock) //清空计时器
            }
          },1000)
          clipboard.destroy()
      })
    },

    //清空转账地址
    clearSentAddress () {
      this._resetErrorText()
      this.sentAddress = ""
    },

    //清空转账金额
    clearSentAmount () {
      this._resetErrorText()
      this.sentTradingAmount = ""
    },

    //转出全部金额
    sentAllAmount () {
      this._resetErrorText()
      this.sentTradingAmount = this.balance
    }
  },
}
</script>

<style scoped>
  .wallet-mask {position: relative;}
  .closeImg {width: 16px;height: 16px;position: absolute;top: 12px;right: 20px;}

  .wallet-mask-sent {padding: 36px 32px;color: #252F33;font-size: 14px;font-weight: 500;}
  .wallet-mask-sent img {width: 16px;height: 16px;}
  .wallet-mask-sent h3 {font-size: 24px;color: #252F33;font-weight: 600;margin: 0;padding-bottom: 10px;
    font-family: Montserrat-SemiBold;}
  .wallet-mask-sent p {font-family: Lato-Bold;font-size: 16px;color: #839299;padding-top: 32px;}
  .wallet-mask-sent-from-address {display: block;padding-top: 12px;font-family: Lato-Medium;}
  .wallet-mask-sent-to-address,.wallet-mask-sent-amount {display: flex;align-items: center;height: 36px;border-bottom:1px solid rgba(229,229,229,1);}
  .wallet-mask-sent-to-address input,.wallet-mask-sent-amount input {flex: 1;border: 0;}
  .wallet-mask-sent-amount section {display: flex;align-items: center;}
  .wallet-mask-sent-amount section span {color: #839299;margin-left: 10px;}
  .wallet-mask-sent-amount section span:last-child {color: #29D893;margin-left: 10px;}
  .wallet-mask-sent-amount section span:last-child:hover {cursor: pointer;}
  
  .wallet-mask-sent button {margin-top: 36px;width:180px;height:48px;color: #F7FBFA;font-size: 16px;border-radius: 4px;
    border: 0;background:linear-gradient(90deg,rgba(66,145,255,1) 0%,rgba(11,127,230,1) 100%);}
  .wallet-mask-sent button:last-child {margin-left: 8px;background:linear-gradient(90deg,rgba(194,194,194,1) 0%,rgba(165,165,165,1) 100%);}
  
  
  .wallet-mask-receive {padding: 36px 32px 28px;}
  .wallet-mask-receive h3 {color: #252F33;font-size: 28px;margin: 0;padding-bottom: 28px;font-family: Montserrat-SemiBold;}
  .wallet-mask-receive p {color: #839299;font-size: 14px;margin: 0;padding-top: 24px;}
  .wallet-mask-receive span {color: #252F33;font-size: 14px;padding-top: 10px;display: block;
    font-weight: 500;font-family: Lato-Medium;}
  .wallet-mask-receive span:last-child {padding-top: 0;font-size: 12px;font-weight: 400;}
  .wallet-mask-receive section {display: flex;align-items: center;justify-content: space-between;
    color: #839299;font-size: 14px;height: 28px;border-bottom: 1px solid rgba(229,229,229,1);}
  .wallet-mask-receive section input {border: 0;flex: 1;}
  .wallet-mask-receive canvas {margin: 28px 0 7px;}


  .wallet-mask-priivate-key {padding: 32px 32px 28px;}
  .wallet-mask-priivate-key h3 {padding-bottom: 42px;}
  .wallet-mask-priivate-key section {padding: 24px;background:rgba(229,229,229,1);
    border-radius:4px;color: #42535B;font-size: 14px;word-wrap:break-word;margin: 16px 0 24px;}
  .wallet-mask-priivate-key .priivate-key-button {display: block;height:48px;background:linear-gradient(90deg,rgba(41,216,147,1) 0%,rgba(12,197,183,1) 100%);
    border-radius:4px;line-height: 48px;text-align: center;color: #fff;}

  .wallet-mask-keystroe .tips {text-align: left;}
  .wallet-mask-keystroe h3 {padding-bottom: 24px!important;}
  .wallet-mask-keystroe .wallet-button {width:108px;height:32px;line-height: 32px;margin-top: 24px;}
  .wallet-mask-keystroe .wallet-button {color: #388ED9;border:1px solid rgba(229,229,229,1);}
  .wallet-mask-keystroe .wallet-button:last-child {pointer-events: none;margin-left: 10px;color: #fff;
    background:linear-gradient(90deg,rgba(194,194,194,1) 0%,rgba(165,165,165,1) 100%);}


  .wallet-mask-phrase,.wallet-mask-keystroe {padding: 32px 32px 16px;text-align: right;}
  .wallet-mask-phrase h3,.wallet-mask-keystroe h3,.wallet-mask-priivate-key  h3 
    {font-size: 18px;font-family: Montserrat-SemiBold;color: #576066;margin: 0;padding-bottom: 12px;text-align: left;}
  .wallet-mask-phrase ul {display: flex;flex-wrap: wrap;}
  .wallet-mask-phrase ul li {padding: 8px 6px;background:rgba(242,242,242,1);border-radius: 4px;
    color: #42535B;font-size: 14px;margin-top: 12px;}
  .wallet-mask-phrase span {width:120px;background:linear-gradient(90deg,rgba(41,216,147,1) 0%,rgba(12,197,183,1) 100%);
    height:36px;line-height: 36px;color: #fff;font-size: 16px!important;margin-top: 24px;}

  .wallet-mask-delete {padding: 44px 20px 16px 24px;font-size: 14px;color: #576066;text-align: right;}
  .wallet-mask-delete p {text-align: left;}
  .wallet-mask-delete span {width:96px;background:linear-gradient(90deg,rgba(238,28,57,1) 0%,rgba(217,25,73,1) 100%);
    height:32px;line-height: 32px;color: #fff;margin-top: 40px;}

  .wallet-mask .wallet-button {text-align: center;font-size: 14px;display: inline-block;border-radius:4px;}

  input[type=number]::-webkit-inner-spin-button, 
  input[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none; 
    margin: 0; 
  }

.copySuccessBg {background: linear-gradient(90deg,rgba(194,194,194,1) 0%,rgba(165,165,165,1) 100%)!important;
  pointer-events: none;}

.keystroeActive {background:linear-gradient(90deg,rgba(41,216,147,1) 0%,rgba(12,197,183,1) 100%)!important;
  pointer-events: auto!important;color: #fff!important;}
</style>