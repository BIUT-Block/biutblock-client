<template>
  <!-- 遮罩层弹窗 -->
  <main>
      <section class="mask" v-show="maskShow" @click="closeAmountList">
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
            <wallet-tips :tips="addressError" v-show="addresErrorShow"/>

            <p>AMOUNT</p>
            <section class="wallet-mask-sent-amount">
              <input type="numer" 
                maxlength="19"
                placeholder="Amount" 
                v-model="sentTradingAmount" 
                @input="clearAmount"
                onpaste="return false"/>
              <section>
                <img src="../../../assets/images/clearAddress.png" v-show="clearSentAmountImg" @click="clearSentAmount" alt="" />
                <section>
                  <span @click="openTradingList" id="amountListImg1">{{tradingText}} <img src="../../../assets/images/amountDown.png"/></span>
                  <ul class="trading-list" v-show="tradingShow">
                    <li v-for="(item, index) in itemList" 
                        :key="index"
                        :class="tradingIdx == index ? 'list-active' : ''"
                        @click="tabTrading(index, item.cnt)">
                      <span>{{item.cnt}}</span>
                      <img :src="tradingIdx == index ? ''+ imgUrl +'' : ''" v-show="tradingIdx == index" alt="">
                    </li>
                  </ul>
                </section>     
              </section>
            </section>
            
            <section class="all-amount-list">
              <span>Balance：</span>
              <span>{{tradingIdx === 0 ? allAmount : allfeeVal}} {{tradingText}}</span>
              <span @click="sentAllAmount">All</span>
            </section>
            <wallet-tips :tips="moneyShowText" v-if="moneyShow"/>

          <p class="trading-title">FEE</p>
          <section class="transfer-slider">
            <el-slider v-model="feeVal"
              :show-tooltip="false"
              :step="stepFee"
              :max="maxFee"
              :min="minFee"></el-slider>
            <section>
              <span :class="slowTips ? 'slow-color': ''">Slow</span>
              <span>{{feeVal}} SEN</span>
              <span :class="fastTips ? 'fast-color' : ''">Fast</span>
            </section>
          </section>
          
          <wallet-tips :tips="feeErrorText" v-if="feeValError"/>

          <button type="button" @click="clostMask">Cancel</button>
          <button type="button"
              :disabled="!sentActive"
              :class="sentActive ? 'passCorrect' : ''"
              @click="sentConfirm">Sent</button>
          </section>

          <!-- 确认转账 -->
          <section v-show="sentPages == 2" class="wallet-mask-sent-confirm">
            <h3>{{ confirmTitle }}</h3>
            <wallet-tips :tips="sessionAddress" style="font-size: 14px;"/>
            <p>FROM</p>
            <span class="wallet-mask-sent-from-address">0x{{selectedWallet.walletAddress}}</span>
            <p>TO</p>
            <span class="wallet-mask-sent-from-address">{{sentAddress}}</span>
            <p>AMOUNT</p>
            <span class="wallet-mask-sent-from-address">{{sentTradingAmount}} {{ tradingText }}</span>
            <p>FEE</p>
            <span class="wallet-mask-sent-from-address">{{feeVal}} SEN</span>

            <section v-show="!networkError">
              <button type="button" @click="backSent">Back</button>
              <button type="button" class="passCorrect" @click="sent">Confirm</button>
            </section>

            <section class="network-error" v-show="networkError">
              <wallet-tips :tips="networkErrorText" v-show="networkError"/>
              <button type="button" @click="backSent">Resubmit</button>
            </section>
          </section>
        </section>

        <!-- 二维码 maskPages = 5 receive -->
        <section class="wallet-mask-receive" v-show="maskPages == 5">
          <h3>Receive</h3>
          <p>Account</p>
          <span>0x{{selectedWallet.walletAddress}}</span>
          <p>Amount</p>
          <section>
            <input type="numer" 
              maxlength="19"
              v-model="receiveAmount" 
              @input="clearNoNum" 
              onpaste="return false"/>
            <label @click="openQrcodeList" id="amountListImg2">{{qrcodeText}} <img src="../../../assets/images/amountDown.png" /></label>

            <ul class="qrcode-list" v-show="qrcodeShow">
              <li v-for="(item, index) in itemList" 
                  :key="index"
                  :class="qrcodeIdx == index ? 'list-active' : ''"
                  @click="tabQrcode(index, item.cnt)">
                <span>{{item.cnt}}</span>
                <img :src="qrcodeIdx == index ? ''+ imgUrl +'' : ''" alt="">
              </li>
            </ul>

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

import amountChecked from '../../../assets/images/amountChecked.png'
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
    balance: String,
    balanceSEN: String
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
      //allAmount: this.balance,//总金额 SEC
      moneyShow: false,//金额错误
      moneyShowText: 'Transfer amount must be less than balance',//金额错误
      confirmTitle: 'Confirm The Following information', //没网络的时候 Submission Failed
      networkError: false, //没有网络的时候 设置 成true
      networkErrorText: 'No network connection',
      addresErrorShow: false,//地址错误

      translucentShow: false, //弹窗
      translucentText: 'Copy success',

      copyButtonText: 'copy',
      copySuccess: false,
      copyTime: 3,
      receiveAmount: '',//二维码收款金额
      amountPlaceHolder: `Maximum input of ${this.balance}`,

      qrcodeIdx: 0, //二维码切换 币种显示 下标
      qrcodeText: 'BIUT', //二维码切换 币种显示
      qrcodeShow: false,//二维码切换 列表
      tradingIdx: 0, //交易
      tradingText: 'BIUT',
      tradingShow: false,
      imgUrl: amountChecked, //选中的图片
      itemList: [
        {
          id: '01',
          cnt: 'BIUT'
        },
        {
          id: '02',
          cnt: 'BIU'
        }
      ],

      feeVal: 0.02, //初始值
      minFee: 0.01,//最小值
    //  allfeeVal: Number(this.balanceSEN), //所有的SEN
    //  maxFee: Number(this.balanceSEN), //最大值
      stepFee: 0.00818182, //步长
      slowTips: false, //小于默认值 color 改变
      fastTips: false, //大于默认值 color 改变
      feeErrorText: 'Fee cannot be greater than SEN balance',
      feeValError: false
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
      let addressReg = /^(0x)(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]+$/
      let address = this.sentAddress.replace(/\s+/g, "")
      let amount = this.sentTradingAmount.replace(/\s+/g, "")
      let walletAddress = '0x' + this.selectedWallet.walletAddress
      let allNumber = (this.allfeeVal - this.feeVal).toFixed(3) // SEN可转账金额  addresErrorShow

      if (this.feeVal > this.allfeeVal) {
        this.feeErrorText = 'Fee cannot be greater than SEN balance'
        this.feeValError = true
      } else if (this.feeVal === 0) {
        this.feeErrorText = 'Fee Cannot be zero'
        this.feeValError = true
      } else {
        this.feeValError = false
      }

      if (address.length > 0 && address.length < 42) {
        this.addresErrorShow = true
        this.addressError = 'Addresses are generally 42-bit characters beginning with 0x'
        return false
      } else if (!(addressReg.test(address)) && address.length == 42) {
        this.addresErrorShow = true
        this.addressError = 'This is not a valid address'
        return false
      } else if (addressReg.test(address) && address == walletAddress) {
        this.addresErrorShow = true
        this.addressError = 'The same address cannot be transferred'
        return false
      } else {
        this.addresErrorShow = false
        //转账 BIUT
        if (this.tradingIdx == 0) {
          if (amount.length > 0 && Number(amount) > Number(this.balance)) {
            this.moneyShow = true
            return false
          } else {
            this.moneyShow = false
            return address.length == 42
              && amount > 0
              && address != walletAddress
              && Number(amount) <= Number(this.balance)
              && addressReg.test(address)
              && 0 < this.feeVal
              && this.feeVal < this.allfeeVal ? true : false
          }
        } else {
          //转账 BIU
          if (amount.length > 0 &&  Number(amount) >  Number(allNumber)) {
            this.moneyShow = true
            return false
          } else {
            this.moneyShow = false
            return address.length == 42
                && amount > 0
                && address != walletAddress
                && Number(amount) <= Number(allNumber)
                && addressReg.test(address)
                && 0 < this.feeVal ? true : false
          }
        }
      }

      return true
    },

    //转账金额清空按钮
    clearSentAmountImg () {
      return this.sentTradingAmount.length > 0 ? true : false
    },

    allAmount() {
      return this.balance
    },
    allfeeVal() {
      return Number(this.balanceSEN)
    },
    maxFee() {
      return Number("0.1")
    }

  },

  watch:{
    //监听输入金额的变化
    receiveAmount(newVal,oldVal){
      let parm = {
        address: this.selectedWallet.walletAddress,
        value: Number(newVal.replace(/^0+/,"")),
        type: this.qrcodeIdx
      }
      this.qrcodeWalletAddress = JSON.stringify(parm)
    },

    //监听滚动条变化
    feeVal (newFee, oldFee) {
      if (Number(newFee) > 0.02636364) {
        this.fastTips = true
        this.slowTips = false
      } else if (Number(newFee) < 0.02636364) {
        this.slowTips = true
        this.fastTips = false
      } else {
        this.fastTips = false
        this.slowTips = false
      }
    },

    //监听SEN的变化
    qrcodeIdx (newIdx, oldIdx) {
      let parm = {
        address: this.selectedWallet.walletAddress,
        value: Number(this.receiveAmount.replace(/^0+/,"")),
        type: newIdx
      }
      this.qrcodeWalletAddress = JSON.stringify(parm)
    }
  },
  created() {
    //二维码初始字符串
    let parm = {
        "address": this.selectedWallet.walletAddress,
        "value": Number(this.receiveAmount.replace(/^0+/,"")),
        "type": this.qrcodeIdx
    }
    this.qrcodeWalletAddress = JSON.stringify(parm)

  },
  mounted() {

  },
  destroyed() { },

  methods: {
    formatTooltip(val) {
      return val / 11
    },

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
      this.tradingText = 'BIUT'
      this.qrcodeText = 'BIUT'
      this.qrcodeIdx = 0
      this.tradingIdx = 0
      this.feeVal=0.02
      this.$emit("changeClose","")
    },

    //确认转账页面
    sentConfirm () {
      this.sentPages = 2
      if (!navigator.onLine) {
        this.confirmTitle = 'Submission Failed'
        this.networkError = true
        return 
      }
      this.sentTradingAmount = parseFloat(this.sentTradingAmount)
	    this.sentTradingAmount = this._checkValueFormat(this.sentTradingAmount)
      //x.
      // let amount = this.getCaption(this.sentTradingAmount).replace(/\b(0+)/gi,"")
      // console.log(amount)
      // if (amount == "") {
      //   this.sentTradingAmount = this.sentTradingAmount + "0"
      // } else {
      //   this.sentTradingAmount = amount
      // }
    },
	
	  _checkValueFormat (value) {
      let val = String(value)
      let splitValue = val.split("e-")
      if (splitValue.length > 1) {
        return Number(val).toFixed(Number(splitValue[1])).toString()
      } else {
        return val
      }
    },

    //返回转账页面
    backSent () {
      this.sentPages = 1
      this._resetErrorText()
      //$this.sentAddress = ''
      //this.sentTradingAmount = ''
      //this.receiveAmount = ''
      //this.$emit("changeClose","")
    },
    
    _resetErrorText () {
      this.addressError = 'Addresses are generally 42-bit characters beginning with 0x'
      this.confirmTitle = 'Confirm The Following information'
      this.amountError = ''
      this.receiveError = ''
      this.networkError = false
    },

    //转账
    sent () {
      if (!navigator.onLine) {
        this.confirmTitle = 'Submission Failed'
        this.networkError = true
        return 
      }
      
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
        amount: this.sentTradingAmount + '',
        txFee: this.feeVal.toString()
      })

      if (this.tradingText === 'BIUT') {
        this.$JsonRPCClient.sendTransactions(this.selectedWallet.walletAddress, encryptTransferData, (balance) => {
        this.$emit('updateWalletBalance', balance, this.selectedWallet.walletAddress)
        }, (balance) => {
          this.$emit('updateWalletBalanceSEN', balance, this.selectedWallet.walletAddress)
        })
      } else {
        this.$JsonRPCClient.sendTransactionsSEN(this.selectedWallet.walletAddress, encryptTransferData, (balance) => {
          this.$emit('updateWalletBalance', balance, this.selectedWallet.walletAddress)
        }, (balance) => {
        this.$emit('updateWalletBalanceSEN', balance, this.selectedWallet.walletAddress)
        })
      }
      

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
      WalletHandler.saveKeyStore(`SEC${this.selectedWallet.walletAddress}`, keyDataJSON, (this.walletNewPass).replace(/\s+/g, ""))
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
      if (this.receiveAmount.length > 10 && this.receiveAmount.indexOf(".") < 0) {
        //只能输入10位整数
        this.receiveAmount = String(this.receiveAmount).substring(0,10)
      } else if (this.receiveAmount.indexOf(".") == 0) {
        this.receiveAmount = String(this.receiveAmount).substring(0,9)
      } else {
        this.receiveAmount =  this.receiveAmount.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
        this.receiveAmount =  this.receiveAmount.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        //this.receiveAmount =  this.receiveAmount.replace(/^\.$/, ""); //不能.开头
        //this.receiveAmount =  this.receiveAmount.replace(/^0$/, ""); //不能0开头
        this.receiveAmount =  this.receiveAmount.replace(".","$#$").replace(/\./g,"").replace("$#$","."); 
        this.receiveAmount =  this.receiveAmount.replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d\d\d).*$/,'$1$2.$3');//只能输入两个小数
      }
    },

    //转账只能输入金额
    clearAmount () {
      //console.log(this.sentTradingAmount.length)
      if (this.sentTradingAmount.length > 10 && this.sentTradingAmount.indexOf(".") < 0) {
        //只能输入10位整数
        this.sentTradingAmount = String(this.sentTradingAmount).substring(0,10)
      } else if (this.sentTradingAmount.indexOf(".") == 0) {
        this.sentTradingAmount = String(this.sentTradingAmount).substring(0,9)
      } else {
        this.sentTradingAmount =  this.sentTradingAmount.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
        this.sentTradingAmount =  this.sentTradingAmount.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        //this.sentTradingAmount =  this.sentTradingAmount.replace(/^\.$/, ""); //不能.开头
        //this.sentTradingAmount =  this.sentTradingAmount.replace(/^0$/, ""); //不能0开头
        this.sentTradingAmount =  this.sentTradingAmount.replace(".","$#$").replace(/\./g,"").replace("$#$","."); 
        this.sentTradingAmount =  this.sentTradingAmount.replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d\d\d).*$/,'$1$2.$3');//只能输入两个小数  
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
      //this._resetErrorText()
      
      if (this.tradingIdx === 0) {
        this.sentTradingAmount = this.balance
      } else {
        this.sentTradingAmount = (this.allfeeVal - this.feeVal).toFixed(3)
      }
    },

    //二维码切换 币种显示
    tabQrcode (index, cnt) {
      this.qrcodeIdx = index
      this.qrcodeText = cnt
      this.qrcodeShow = false
    },

    //点击其他地方关闭sec、sen选择
    closeAmountList (event) {
      let amountList1 = document.getElementById('amountListImg1')
      let amountList2 = document.getElementById('amountListImg2')
      if (this.tradingShow && !amountList1.contains(event.target) || this.qrcodeShow && !amountList2.contains(event.target)) {
        if (this.tradingShow) {
          this.tradingShow = false
        } else {
           this.qrcodeShow = false
        }
      }
    },

    openQrcodeList() {
      this.qrcodeShow = !this.qrcodeShow
    },

    tabTrading (index, cnt) {
      this.tradingIdx = index
      this.tradingText = cnt
      this.tradingShow = false
    },

    openTradingList() {
      this.tradingShow = !this.tradingShow
    },
  },
}
</script>

<style scoped>
  .wallet-mask {position: relative;}
  .closeImg {width: 16px;height: 16px;position: absolute;top: 12px;right: 20px;}

  .wallet-mask-sent {color: #252F33;font-size: 14px;font-weight: 500;height: 516px;padding: 28px 32px 0;}
  .wallet-mask-sent img {width: 16px;height: 16px;}
  .wallet-mask-sent h3 {font-size: 24px;color: #252F33;font-weight: 600;margin: 0;padding-bottom: 4px;
    font-family: Montserrat-SemiBold;}
  .wallet-mask-sent p {font-family: Lato-Bold;font-size: 16px;color: #839299;padding-top: 24px;}

  .wallet-mask-sent .wallet-mask-sent-confirm p {padding-top: 20px;}
  .wallet-mask-sent .wallet-mask-sent-confirm h3 {padding-bottom: 22px;}
  .wallet-mask-sent-from-address {display: block;padding-top: 12px;font-family: Lato-Medium;}
  .wallet-mask-sent-to-address,.wallet-mask-sent-amount {display: flex;align-items: center;height: 36px;border-bottom:1px solid rgba(229,229,229,1);}
  .wallet-mask-sent-to-address input,.wallet-mask-sent-amount input {flex: 1;border: 0;}
  .wallet-mask-sent-amount section {display: flex;align-items: center;}
  .wallet-mask-sent-amount section span {color: #839299;margin-left: 10px;}
  .wallet-mask-sent-amount section span:hover {cursor: pointer;}
  .wallet-mask-sent-amount section span img {vertical-align: middle;margin-left: 4px;}
  
  .wallet-mask-sent-amount {position: relative;}
  .wallet-mask-sent-amount section .trading-list {position: absolute;right: 0;top: 37px;z-index: 9;border-radius: 4px;
    box-shadow:0px 1px 6px rgba(37,47,51,0.16);width:90px;height:72px;padding: 0 10px;}
  .wallet-mask-sent-amount section .trading-list li {display: flex;align-items: center;justify-content: space-between;height: 36px;}
  .wallet-mask-sent-amount section .trading-list li span {color: #576066;}
  .wallet-mask-sent-amount section .trading-list li:hover {cursor: pointer;}
  
  .wallet-mask-sent button {margin-top: 40px;width:180px;height:48px;color: #F7FBFA;font-size: 16px;border-radius: 4px;
    border: 0;background:linear-gradient(90deg,rgba(66,145,255,1) 0%,rgba(11,127,230,1) 100%);}
  .wallet-mask-sent button:last-child {margin-left: 8px;background:linear-gradient(90deg,rgba(194,194,194,1) 0%,rgba(165,165,165,1) 100%);}
  
  .wallet-mask-sent .trading-title {color: #839299;font-size: 16px;padding: 24px 0 10px;}
  .transfer-slider section {display: flex;justify-content: space-between;align-items: center;font-size: 14px;}
  .transfer-slider section span:first-child,.transfer-slider section span:last-child {color: #839299;}
  .transfer-slider >>> .el-slider__runway {height: 2px;margin: 10px 0;}
  .transfer-slider >>> .el-slider__bar {background-color: #00D86D;height: 2px;}
  .transfer-slider >>> .el-slider__button {border-color: #00D86D;}
  .transfer-slider >>> .el-slider__button-wrapper {width: 24px;height: 24px;top: -12px;}

  .all-amount-list {color: #839299;font-size: 14px;padding-top: 8px;}
  .all-amount-list span:last-child {color: #29D893;margin-left: 10px;}
  .all-amount-list span:last-child:hover {cursor: pointer;}

  .wallet-mask-receive {padding: 36px 32px 28px;}
  .wallet-mask-receive h3 {color: #252F33;font-size: 28px;margin: 0;padding-bottom: 28px;font-family: Montserrat-SemiBold;}
  .wallet-mask-receive p {color: #839299;font-size: 14px;margin: 0;padding-top: 24px;}
  .wallet-mask-receive span {color: #252F33;font-size: 14px;padding-top: 10px;display: block;
    font-weight: 500;font-family: Lato-Medium;}
  .wallet-mask-receive span:last-child {padding-top: 0;font-size: 12px;font-weight: 400;}
  .wallet-mask-receive section {display: flex;align-items: center;justify-content: space-between;position: relative;
    color: #839299;font-size: 14px;height: 28px;border-bottom: 1px solid rgba(229,229,229,1);}
  .wallet-mask-receive section input {border: 0;flex: 1;}
  .wallet-mask-receive canvas {margin: 28px 0 7px;}
  .wallet-mask-receive section label img {vertical-align: middle;margin-left: 4px;}
  .wallet-mask-receive section label:hover {cursor: pointer;}
  .wallet-mask-receive .qrcode-list {position: absolute;top: 28px;right: 0;z-index: 9;border-radius: 4px;
    box-shadow:0px 1px 6px rgba(37,47,51,0.16);width:90px;height:72px;padding: 0 10px;}
  .wallet-mask-receive .qrcode-list li {display: flex;align-items: center;justify-content: space-between;height: 36px;}
  .wallet-mask-receive .qrcode-list li span {color: #576066;}
  .wallet-mask-receive .qrcode-list li:hover {cursor: pointer;}

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

.network-error span {padding-top: 36px;}
.network-error button {display: block;width: 100%;margin-top: 20px;
  background:linear-gradient(90deg,rgba(41,216,147,1) 0%,rgba(12,197,183,1) 100%)!important;}

.list-active span {color: #29D893!important;}

.slow-color {color: #0B7FE6!important;}
.fast-color {color: #F5A623!important;}
</style>