<template>
  <el-container>
     <el-row>
      <el-col :span="24">
        <left-nav :wallet-address="walletAddress" :wallet-name="walletName" :wallets-arr="walletsArr" :wallet-pwd="walletPwd"
        :wallet-private-key="privateKey" :wallet-public-key="publicKey" :wallet-balance="walletMoney"></left-nav>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24" class="publicWalletP"> 
        <section class="publicWalletH publicWalletHF">

          <section class="publicWalletHList">
            <router-link :to="{name: 'wallet', 
            query: {walletAddress: this.walletAddress, walletPrivateKey: this.privateKey, 
            walletPublicKey: this.publicKey, walletName:this.walletName, walletsArr: this.walletsArr,
             walletPwd: this.walletPwd, walletBalance: this.walletMoney}}" class="publicWalletHListIcon">
              <i class="el-icon-arrow-left icon_nav"></i>
            </router-link>
            <span class="publicWalletHTit">Receipt</span>
          </section>
          
          <section class="receiptCnt">
            <p class="receiptCntAddress" id="address">
              {{walletAddress}}
            </p>
            <el-input v-model="money" id="money" placeholder="Payee wallet address" class="moneyIpt" @keypress.native="isNumber">
              <template slot="append">SEC</template>
            </el-input>
            
            <!-- <figure class="receiptCntImg">
              <img src="../../assets/image/receiptImg.png" alt="">
            </figure> -->

            <qr-code :value="walletAddress,money" :size="170" class="receiptCntImg">
            </qr-code>
    
            <button data-clipboard-target="#address" class="publicBtn publicBtnAcitve" @click="copyCnt">Copy payment address</button>
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

export default {
  name: '',
  data () {
    return {
      money: 0,
      walletAddress: this.$route.query.walletAddress,
      privateKey: this.$route.query.walletPrivateKey,
      publicKey: this.$route.query.walletPublicKey,
      walletMoney: this.$route.query.walletMoney,
      walletsArr: this.$route.query.walletsArr,
      walletPwd: this.$route.query.walletPwd,
      walletName: this.$route.query.walletName
    }
  },
  methods: {
    copyCnt () {
      var clipboard = new Clipboard('.publicBtn')
        clipboard.on('success', e => {
          this.$alert('Copy success', 'Warm prompt', {
            confirmButtonText: 'determine',
            callback: action => {}
          });
          clipboard.destroy()
        })
        clipboard.on('error', e => {
          this.$alert('Automatic replication is not supported', 'Warm prompt', {
            confirmButtonText: 'determine',
            callback: action => {}
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
  components: {
    leftNav,
    qrCode
  }
}
</script>

<style scoped>
.moneyIpt {width:434px;height:36px;margin-bottom: 8px;}

.receiptCnt {display: flex;justify-content: center;flex-direction: column;align-items: center;flex: 1;}
.receiptCntAddress {margin:75px 0 11px;color: #657292;text-align: left;width: 434px;}

.receiptCntImg {margin: 36px auto;}

section >>> .el-input-group__append {background: #fff;color: #657292;border-color:#c8d1da;}
section >>> .el-input__inner {border-right: none;border-color:#c8d1da;}
section >>> .el-input__inner:focus {border-color: #c8d1da;}
</style>