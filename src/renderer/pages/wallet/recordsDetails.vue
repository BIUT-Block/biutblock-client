<template>
  <el-container>
    <el-row>
      <el-col :span="24">
        <left-nav></left-nav>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24" class="publicWalletP"> 
        <section class="publicWalletH">
          <section class="publicWalletHList">
            <router-link to="/wallet" class="publicWalletHListIcon">
              <i class="el-icon-arrow-left icon_nav"></i>
            </router-link>
            <span class="publicWalletHTit">Transaction Details</span>
          </section>

          <section class="recordsCnt">
            <figure>
              <img :src="detailsImg" alt="">
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
              See more details at SEC BLOCKCHAIN
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
export default {
  name: '',
  data () {
    return {
      detailsImg: successImg,
      detailsMoney: '+0.00000001 SEC',
      detailsNumber: '0x8eaa3534j3o4u937jof97r98dfe0wrewjroei0fe8r0ew343403806e0ad730',
      detailsBlock: '01',
      detailsTime: '2018/11/08 21:03 UTC',
      detailsBeneficiary: '0x80863e630c664c8761c71a8a9a5bccfaf008e33f2e04b1c4d76f61dd38b43832',
      detailsSending: '0x2c7ccfe69c645cc1362f35038a8beb5f843598842084c105adb4df1ca85622fb',
      detailsCost: '8.89729807 sec',
    }
  },
  components: {
    leftNav
  }
}
</script>

<style scoped>
.detailsList {height: 174px;display: flex;justify-content: space-between;flex-direction: column;
  margin:0 14px;color: #939CB2}

.recordsCnt {height: 170px;display: flex;justify-content: start;flex-direction: column;align-items: center;}
.recordsTit {font-size:18px;font-weight:400;color: #242E49;}

.detailsListTxt {display:inline-block;width: 115px;text-align: right;color:#C8D1DA;margin-right: 32px;}
.footerTxt {margin-top: 90px;text-align: center;color: #939CB2}
.footerImg {vertical-align: middle;margin-right: 10px;}
</style>