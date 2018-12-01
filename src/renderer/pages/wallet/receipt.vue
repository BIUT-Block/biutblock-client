<template>
  <el-container>
     <el-row>
      <el-col :span="24">
        <left-nav :wallet-address="walletAddress" wallet-name="wallet 01"></left-nav>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24" class="publicWalletP"> 
        <section class="publicWalletH publicWalletHF">

          <section class="publicWalletHList">
            <router-link :to="{name: 'wallet', query: {walletAddress: this.walletAddress, walletPrivateKey: this.privateKey, walletPublicKey: this.publicKey, walletBalance: this.walletMoney}}" class="publicWalletHListIcon">
              <i class="el-icon-arrow-left icon_nav"></i>
            </router-link>
            <span class="publicWalletHTit">Receipt</span>
          </section>

          <section class="receiptCnt">
            <p class="receiptCntAddress" id="address">
              {{walletAddress}}
            </p>
            <el-input v-model="money" id="money" placeholder="Payee wallet address" class="ipt">
              <template slot="append">SEC</template>
            </el-input>
            
            <!-- <figure class="receiptCntImg">
              <img src="../../assets/image/receiptImg.png" alt="">
            </figure> -->

            <qr-code value="privateKey" :size="170">
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
      money: '0',
      walletAddress: this.$route.query.walletAddress,
      privateKey: this.$route.query.walletPrivateKey,
      publicKey: this.$route.query.walletPublicKey,
      walletMoney: this.$route.query.walletMoney
    }
  },
  methods: {
    copyCnt () {
      var clipboard = new Clipboard('.publicBtn')
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
    }
  },
  components: {
    leftNav,
    qrCode
  }
}
</script>

<style scoped>
.ipt {width:434px;height:36px;margin-bottom: 8px;}

.receiptCnt {display: flex;justify-content: center;flex-direction: column;align-items: center;flex: 1;}
.receiptCntAddress {margin-bottom: 11px;color: #657292;}

.receiptCntImg {margin: 36px auto;}

section >>> .el-input-group__append {background: #fff;color: #657292;}
section >>> .el-input__inner {border-right: none}
</style>