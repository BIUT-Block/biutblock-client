<template>
  <el-container>
     <el-row>
      <el-col :span="24">
        <left-nav :wallet-address="walletAddress" :wallet-name="walletName" :wallets-arr="walletsArr" :wallet-pwd="walletPwd"
        :wallet-private-key="privateKey" :wallet-public-key="publicKey" :wallet-balance="walletMoney" :color-arr="colorArr"></left-nav>
      </el-col>
    </el-row>

    <el-row style="margin-left: 32px;">
      <el-col :span="24" class="publicWalletP"> 
        <section class="publicWalletH publicWalletHF">

          <section class="publicWalletHList">
            <router-link :to="{name: 'wallet', 
            query: {walletAddress: this.walletAddress, walletPrivateKey: this.privateKey, 
            walletPublicKey: this.publicKey, walletName:this.walletName, walletsArr: this.walletsArr,
             walletPwd: this.walletPwd, walletBalance: this.walletMoney, colorArr: this.colorArr,pageId: 1 }}" class="publicWalletHListIcon">
              <i class="el-icon-arrow-left icon_nav"></i>
            </router-link>
            <span class="publicWalletHTit">Receive</span>
          </section>
          
          <section class="receiptCnt">
            <p class="receiptCntAddress" id="address">
              0x{{walletAddress}}
            </p>
            <el-input v-model="money" id="money" placeholder="Payee wallet address" class="moneyIpt" @keypress.native="isNumber">
              <template slot="append">SEC</template>
            </el-input>
            
            <!-- <figure class="receiptCntImg">
              <img src="../../assets/image/receiptImg.png" alt="">
            </figure> -->

            <qr-code :value="walletAddress,money" :size="170" class="receiptCntImg">
            </qr-code>
    
            <button data-clipboard-target="#address" class="publicBtn" :class="isCopied==true?'':'publicBtnAcitve'" @click="copyCnt">{{copyBtnText}}</button>
          </section>
        </section>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>
import leftNav from './components/leftNav'
import qrCode from './components/qrCode'
import Clipboard from 'clipboard'
import {EventBus} from "../../lib/EventBus.js"

export default {
  name: '',
  data () {
    return {
      money: 0,
      walletAddress: this.$route.query.walletAddress,
      privateKey: this.$route.query.privateKey,
      publicKey: this.$route.query.publicKey,
      walletMoney: this.$route.query.walletMoney,
      walletsArr: this.$route.query.walletsArr,
      walletPwd: this.$route.query.walletPwd,
      walletName: this.$route.query.walletName,
      colorArr: this.$route.query.colorArr,
      copyBtnText: 'Copy Receipt address',
      isCopied: false,
      total: 5
    }
  },
  methods: {
    copyCnt () {
      var clipboard = new Clipboard('.publicBtn')
        this.isCopied = true
        this.copyBtnText = 'Copied'
       
        clipboard.on('success', e => {
          // this.$alert('Copy success', 'Warm prompt', {
          //   confirmButtonText: 'Confirm',
          // });
          clipboard.destroy()
          
          let clock = window.setInterval(() => {
            var x = this.total--
            if(this.total<0){
              this.total = 5
              this.copyBtnText = 'Copy Receipt address'
              this.isCopied = false
              window.clearInterval(clock)
            }
          },1000)
        })
        clipboard.on('error', e => {
          this.$alert('Automatic replication is not supported', 'Warm prompt', {
            confirmButtonText: 'Confirm',
          });
          clipboard.destroy()
        })
    },
    isNumber (evt) {
      evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault();;
      } else {
        return true;
      }
    }
  },
  created() {
    EventBus.$emit('changeSetVisibil', {
        isVisible: false,
        from: 'wallet'
    })
  },
  components: {
    leftNav,
    qrCode
  }
}
</script>

<style scoped>
.moneyIpt {width:434px;height:36px;margin-bottom: 8px;}

.receiptCnt {display: flex;justify-content: center;flex-direction: column;align-items: center;flex: 1;
  box-shadow:0px 0px 15px rgba(0,91,76,0.05);}
.receiptCntAddress {margin:25px 0 11px;color: #657292;text-align: left;width: 434px;}

.receiptCntImg {margin: 36px auto;}

section >>> .el-input-group__append {background: #fff;color: #657292;border-color:#c8d1da;}
section >>> .el-input__inner {border-right: none;border-color:#c8d1da;}
section >>> .el-input__inner:focus {border-color: #c8d1da;}
</style>