<template>
  <!-- 遮罩层弹窗 -->
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
          <input type="text" v-model="sentAmount" placeholder="Maximum input of 1234.12345678" maxlength="42"/>
          <section>
            <img src="../../../assets/images/clearAddress.png" v-show="clearSentAmountImg" @click="clearSentAmount" alt="" />
            <span>SEC</span>
          </section>
        </section>
        <section class="wallet-mask-sent-amount-tips">
          <section>
            <span>Balance：{{allAmount}} SEC</span>
            <span @click="sentAllAmount">ALL</span>
          </section>
          <wallet-tips :tips="amountError"/>
        </section>

        <button type="button" @click="clostMask">Cancel</button>
        <button type="button" @click="sent">Sent</button>
      </section>

      <!-- 二维码 maskPages = 5 receive -->
      <section class="wallet-mask-receive" v-show="maskPages == 5">
        <h3>Receive</h3>
        <p>Account</p>
        <span>0x{{selectedWallet.walletAddress}}</span>
        <p>Account</p>
        <section>
          <input type="text" />
          <label>SEC</label>
        </section>
        <qrcode :value="selectedWallet.walletAddress" :options="{ size: 93 }"></qrcode>
        <span>Your address(QR Code)</span>
      </section>

      <!-- 导出私钥 maskPages = 0 Export Private key -->
      <section class="wallet-mask-priivate-key" v-show="maskPages == 0">
        <h3>Export Private key</h3>
        <wallet-tips :tips="privateKey" />
        <section id="priivateKey">
          {{selectedWallet.privateKey}}
        </section>
        <span class="priivate-key-button copyButton" @click="copyCnt" data-clipboard-target="#priivateKey">Copy</span>
      </section>

      <!-- 导出keyStore文件 maskPages = 1  Export Keystore -->
      <section class="wallet-mask-keystroe" v-show="maskPages == 1">
        <h3>Export Keystore</h3>
        <wallet-input-pass
          placeholder="Enter your new password"
          maxlength="30"
          v-model="walletNewPass"
        ></wallet-input-pass>
        <wallet-tips :tips="passFormat" class="tips" />
        <span class="wallet-button" @click="clostMask">Cancel</span>
        <span class="wallet-button" @click="importantKeystroe">Confirm</span>
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
    </section>
  </section>
</template>

<script>
import walletTips from '../../../components/wallet-tips'
import walletInputPass from '../../../components/wallet-input-pass'
import Qrcode from '@xkeshi/vue-qrcode'
import Clipboard from 'clipboard'
import WalletHandler from '../../../lib/WalletsHandler';
export default {
  name: 'walletMask',
  components: {
    qrcode: Qrcode,
    walletInputPass,
    walletTips,
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
      addressError: 'Addresses are generally 42-bit characters beginning with 0x',
      amountError: '',
      passFormat: 'your password must be at least 9 characters.Password should not start or end with space',
      privateKey: 'Security Warning: The private key is not encrypted and the export is risky. Here recommend to backup with mnemonic and Keystore.',
      walletAddress: '0x27e7192fdbe340c8bc9569bb4bf2f15e76e9fed3',
      walletNewPass: '',

      sentAddress: '',//转账地址
      sentAmount: '',//转账金额
      allAmount: this.balance,//总金额
    }
  },
  computed: {
    //转账地址清空按钮
    clearSentAddressImg () {
      return this.sentAddress.length > 0 ? true : false
    },

    //转账金额清空按钮
    clearSentAmountImg () {
      return this.sentAmount.length > 0 ? true : false
    }
  },
  created() {

  },
  mounted() {

  },
  destroyed() { },
  methods: {
    //关闭弹窗调用该组件
    clostMask () {
      this.$emit("changeClose","")
    },
    
    //转账
    sent () {
      let sendToAddress = ''
      if (this.sentAddress.substring(0, 2) === '0x' && this.sentAddress.length === 42) {
        sendToAddress = this.sentAddress.substring(2, this.sentAddress.length)
      } else {
        sendToAddress = this.sentAddress
      }
      let encryptTransferData = WalletHandler.encryptTransaction(this.selectedWallet.privateKey, {
        walletAddress: this.selectedWallet.walletAddress,
        sendToAddress: sendToAddress,
        amount: this.sentAmount
      })
      this.$JsonRPCClient.sendTransactions(this.selectedWallet.walletAddress, encryptTransferData, (balance) => {
        this.$emit('updateWalletBalance', balance)
      })
      this.clostMask()
    },

    //导出keystroe文件
    importantKeystroe () {
      WalletHandler.saveKeyStore(this.walletData, this.walletNewPass)
      this.clostMask()
    },

    //导出助记词
    importantPhrase () {
      WalletHandler.savePhrase(this.selectedWallet.englishWords)
      this.clostMask()
    },

    //删除钱包
    deleteWallet () {
      WalletHandler.removeWalletFromFile(this.selectedWallet, (wallets) => {
        this.$emit('updateWalletList', wallets)
      })
      this.clostMask ()
    },

    //复制私钥
    copyCnt () {
      this.clostMask ()
      var clipboard = new Clipboard('.copyButton')
      clipboard.on('success', e => {
          clipboard.destroy()
          alert("复制成功")
      })
      clipboard.on('error', e => {
          alert("复制失败")
          clipboard.destroy()
      })
    },

    //清空转账地址
    clearSentAddress () {
      this.sentAddress = ""
    },

    //清空转账金额
    clearSentAmount () {
      this.sentAmount = ""
    },

    //转出全部金额
    sentAllAmount () {
      this.sentAmount = this.allAmount
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
  .wallet-mask-sent-amount-tips {display: flex;justify-items: center;align-items: center;
    justify-content: space-between;margin: 6px 0 36px;}
  .wallet-mask-sent-amount-tips span {padding-top: 0;}
  .wallet-mask-sent-amount-tips section span {font-size: 12px;color: #839299;}
  .wallet-mask-sent-amount-tips section span:last-child {color: #29D893;margin-left: 12px;}
  .wallet-mask-sent button {width:180px;height:48px;color: #F7FBFA;font-size: 16px;border-radius: 4px;
    border: 0;background:linear-gradient(90deg,rgba(194,194,194,1) 0%,rgba(165,165,165,1) 100%);}
  .wallet-mask-sent button:last-child {background:linear-gradient(90deg,rgba(41,216,147,1) 0%,rgba(12,197,183,1) 100%);
    margin-left: 8px;}
  

  .wallet-mask-receive {padding: 36px 32px 28px;}
  .wallet-mask-receive h3 {color: #252F33;font-size: 28px;margin: 0;padding-bottom: 28px;font-family: Montserrat-SemiBold;}
  .wallet-mask-receive p {color: #839299;font-size: 14px;margin: 0;padding-top: 24px;}
  .wallet-mask-receive span {color: #252F33;font-size: 14px;padding-top: 10px;display: block;
    font-weight: 500;font-family: Lato-Medium;}
  .wallet-mask-receive span:last-child {padding-top: 0;font-size: 12px;font-weight: 400;}
  .wallet-mask-receive section {display: flex;align-items: center;justify-content: space-between;
    color: #839299;font-size: 14px;height: 28px;border-bottom: 1px solid rgba(229,229,229,1);}
  .wallet-mask-receive section input {border: 0;}
  .wallet-mask-receive canvas {margin: 28px 0 7px;}


  .wallet-mask-priivate-key {padding: 32px 32px 28px;}
  .wallet-mask-priivate-key h3 {padding-bottom: 42px;}
  .wallet-mask-priivate-key section {padding: 24px;background:rgba(229,229,229,1);
    border-radius:4px;color: #42535B;font-size: 14px;word-wrap:break-word;margin: 16px 0 24px;}
  .wallet-mask-priivate-key .priivate-key-button {display: block;height:48px;background:linear-gradient(90deg,rgba(41,216,147,1) 0%,rgba(12,197,183,1) 100%);
    border-radius:4px;line-height: 48px;text-align: center;color: #fff;}

  .wallet-mask-keystroe .tips {text-align: left;}
  .wallet-mask-keystroe h3 {padding-bottom: 24px!important;}
  .wallet-mask-keystroe .wallet-button {width:108px;height:32px;line-height: 32px;}
  .wallet-mask-keystroe .wallet-button {color: #388ED9;border:1px solid rgba(229,229,229,1);}
  .wallet-mask-keystroe .wallet-button:last-child {color: #F7FBFA;
    background:linear-gradient(90deg,rgba(41,216,147,1) 0%,rgba(12,197,183,1) 100%);}


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
</style>