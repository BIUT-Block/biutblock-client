<template>
  <el-container>
    <el-row>
      <el-col :span="24">
        <left-nav :wallet-address="walletAddress" :wallet-name="walletName" :wallets-arr="walletsArr" :wallet-pwd="walletPwd"
        :wallet-private-key="privateKey" :wallet-public-key="publicKey" :wallet-balance="walletBalance" :color-arr="colorArr"></left-nav>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24" class="publicWalletP"> 
        <section class="publicWalletH">
          <section class="publicWalletHList">
            <router-link :to="{name: 'wallet', 
            query: {walletAddress: this.walletAddress, walletPrivateKey: this.privateKey, walletName:this.walletName, walletsArr: this.walletsArr, 
            walletPwd: this.walletPwd, walletPublicKey: this.publicKey, walletBalance: this.walletBalance, colorArr: this.colorArr,pageId: 1}}" 
            class="publicWalletHListIcon">
              <i class="el-icon-arrow-left icon_nav"></i>
            </router-link>
            <span class="publicWalletHTit">Wallet Details</span>
          </section>

          <section class="recordsCnt">
            <figure>
              <img :src="detailsImg" alt="" width="56px" height="56px">
            </figure>
            <h2 class="recordsTit">{{walletBalance + ' SEC Token'}}</h2>
          </section>

          <section class="detailsList">
             <section>
               <span class="detailsListLabel">wallet name</span>
               <span class="detailsListTxt">{{walletName}}</span>                  
             </section>
             <section>
               <span class="detailsListLabel">wallet address</span>
               <span class="detailsListTxt">{{walletAddress}}</span>               
             </section>
             <section>
               <span class="detailsListLabel">public key</span>
               <span class="detailsListTxt">{{publicKey}}</span>               
             </section>
             
          </section>
        </section>
      </el-col>
    </el-row>
  </el-container>

</template>

<script>
import leftNav from './components/leftNav'
import successImg from '../../assets/image/detailsSuccess.png'
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
      colorArr: this.$route.query.colorArr
    }
  },
  components: {
    leftNav
  }
}
</script>

<style scoped>
.detailsList {height: 174px;display: flex;flex-direction: column;margin:0 14px;color: #939CB2}

.detailsList section{margin-top:10px;}


.recordsCnt {display: flex;justify-content: start;flex-direction: column;align-items: center;margin-top: 50px;}
.recordsTit {font-size:18px;font-weight:400;color: #242E49;margin: 18px 0 46px;}

.detailsListTxt {display:inline-block;width: 400px;text-align: left;color:#939CB2; word-wrap:break-word; vertical-align: top;line-height: 1.5;}
.detailsListLabel {display:inline-block;width: 115px;text-align: right;color:#C8D1DA;margin-right: 32px; word-wrap:break-word;}
.footerTxt {margin-top: 90px;text-align: center;color: #939CB2}
.footerImg {vertical-align: middle;margin-right: 10px;}
</style>