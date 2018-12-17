<template>
  <el-container>
    <el-row>
      <el-col :span="24">
        <left-nav :wallet-address="walletAddress" :wallet-name="walletName" :wallets-arr="walletsArr" :wallet-pwd="walletPwd"
        :wallet-private-key="privateKey" :wallet-public-key="publicKey" :wallet-balance="walletBalance" :color-arr="colorArr"></left-nav>
      </el-col>
    </el-row>

    <el-row style="margin-left: 38px;">
      <el-col :span="24" class="publicWalletP"> 
        <section class="publicWalletH">
          <section class="publicWalletHList">
            <router-link :to="{name: 'wallet', 
            query: {walletAddress: this.walletAddress, walletPrivateKey: this.privateKey, walletName:this.walletName, walletsArr: this.walletsArr, 
            walletPwd: this.walletPwd, walletPublicKey: this.publicKey, walletBalance: this.walletBalance, colorArr: this.colorArr,pageId: 1}}" 
            class="publicWalletHListIcon">
              <i class="el-icon-arrow-left icon_nav"></i>
            </router-link>
            <span class="publicWalletHTit">Transaction Details</span>
          </section>

          <section class="recordsCnt">
            <figure>
              <img :src="detailsImg" alt="" width="56px" height="56px">
            </figure>
            <h2 class="recordsTit">{{detailsMoney}}</h2>
          </section>

          <section class="detailsList">
             <section>
               <span class="detailsListTxt">Transaction number</span>
                {{detailsNumber}}
             </section>

             <section>
               <span class="detailsListTxt">Block</span>
                {{detailsBlock}}
             </section>
             <section>
               <span class="detailsListTxt">Creation time</span>
                {{detailsTime}}
             </section>

             <section>
               <span class="detailsListTxt">Beneficiary</span>
                {{detailsBeneficiary}}
             </section>

             <section>
               <span class="detailsListTxt">Sending party</span>
                {{detailsSending}}
             </section>

             <section>
               <span class="detailsListTxt">Miner cost</span>
                {{detailsCost}}
             </section>
             
          </section>

          <section class="footerTxt">
            <p>
              <img src="../../assets/image/detailsLogo.png" alt="" class="footerImg">
              <a v-bind:href="detailsLink" target="_blank">See more details at SEC BLOCKCHAIN</a>
            </p>
          </section>
        </section>
      </el-col>
    </el-row>
  </el-container>

</template>

<script>
import leftNav from './components/leftNav'
import successImg from '../../assets/image/detailsSuccess.png'
import detailsLoadingImg from '../../assets/image/detailsLoading.png'
import {EventBus} from '../../lib/EventBus.js'
export default {
  name: '',
  data () {
    return {
      detailsImg: successImg,
      privateKey: this.$route.query.privateKey,
      publicKey: this.$route.query.publicKey,
      walletAddress: this.$route.query.walletAddress,
      walletBalance: this.$route.query.walletBalance,
      walletsArr: this.$route.query.walletsArr,
      walletPwd: this.$route.query.walletPwd,
      walletName: this.$route.query.walletName,
      detailsMoney: this.$route.query.detailsMoney,
      detailsNumber: this.$route.query.detailsNumber,
      detailsBlock: this.$route.query.detailsBlock,
      detailsTime: this.$route.query.detailsTime,
      detailsBeneficiary: this.$route.query.detailsBeneficiary,
      detailsSending: this.$route.query.detailsSending,
      detailsCost: this.$route.query.detailsCost,
      detailsState: this.$route.query.detailsState,
      colorArr: this.$route.query.colorArr,
      detailsLink: `http://scan.secblock.io/tokentxdetails?hash=${this.$route.query.detailsNumber}`
    }
  },
  created () {
    EventBus.$emit('changeSetVisibil', {
      isVisible: false,
      from: 'wallet'
    })
    switch(this.detailsState) {
      case 'Packed':
        this.detailsImg = detailsLoadingImg
        break
      case 'Successful':
        this.detailsImg = successImg
        break
      default:
        break
    }
  },
  components: {
    leftNav
  }
}
</script>

<style scoped>
.detailsList {height: 174px;display: flex;justify-content: space-between;flex-direction: column;
  margin: 46px 14px 76px;color: #939CB2;}

.recordsCnt {display: flex;justify-content: start;flex-direction: column;
  align-items: center;margin-top: 50px;}
.recordsTit {font-size:18px;font-weight:400;color: #242E49;margin: 0;margin-top: 18px;}

.detailsListTxt {display:inline-block;width: 115px;text-align: right;color:#C8D1DA;margin-right: 32px;}
.footerTxt {margin-top: 10px;text-align: center;color: #939CB2}
.footerImg {vertical-align: middle;margin-right: 10px;}
</style>