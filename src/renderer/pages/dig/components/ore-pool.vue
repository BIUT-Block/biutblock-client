<template>
  <main class="ore-container">
    <!-- 条件不足、条件满足 -->
    <section class="ore-pool-conditions" v-show="pages == 1">
      <p>{{ $t(conditionsTips) }}</p>
      <button
        type="button"
        :class="orePoolTrue ? 'orePoolTrue' : ''"
        :disabled="!orePoolTrue"
        @click="maskShow = true">
        {{ $t(orePoolTxt) }}
      </button>
    </section>

    <!-- 申请中 -->
    <section class="ore-pool-apply" v-show="pages == 2">
      <section class="ore-pool-apply-list">
        <p>{{ $t('homeDig.hdNavPoolSuccessTit1') }}：<span>{{ poolName }}</span></p>
        <p>{{ $t('homeDig.hdNavPoolSuccessTit3') }}：<span>0x{{ walletAddress }}</span></p>
      </section>
      
      <p class="ore-pool-apply-tips">{{ $t('homeDig.hdNavPoolRes') }}</p>
    </section>

    <!-- 申请失败 -->
    <section class="ore-pool-error" v-show="pages == 3">
      <span></span>
      <button type="button">{{ $t('homeDig.hdNavPoolFailureTit') }}</button>
      <ul>
        <li>
          <p>
            {{ $t('homeDig.hdNavPoolFailureTxt1') }}
          </p>
          <p>
            {{ $t('homeDig.hdNavPoolFailureTxt2') }}
            <span>{{ poolApplyMoney }}</span>
          </p>
          <p>
            {{ $t('homeDig.hdNavPoolFailureTxt3') }}：
            <span>{{ poolApplyTime }}</span>
          </p>
          <p>
            {{ $t('homeDig.hdNavPoolFailureTxt4') }}： 
            <span>{{ $t('homeDig.hdNavPoolFailureTxt5') }}</span>
          </p>
        </li>
      </ul>
    </section>

    <!-- 申请成功 -->
    <section class="ore-pool-success" v-show="pages == 4">
      <section class="header-success-list">
        <section class="success-list1">
          <p>{{ $t('homeDig.hdNavPoolSuccessTit1') }}：<span>{{ poolName }}</span></p>
          <p>{{ $t('homeDig.hdNavPoolSuccessTit2') }}：<span>{{ poolApplyTime.substring(0,20) }}</span></p>
        </section>
        <section class="success-list2">
          <p>{{ $t('homeDig.hdNavPoolSuccessTit3') }}：<span>0x{{ walletAddress }}</span></p>
          <p>{{ $t('homeDig.hdNavPoolSuccessTit4') }}：<span>0x{{ contractAddress }}</span></p>
        </section>
      </section>
      <ul>
        <li v-for="(item, index) in successList" :key="index">
          <img :src="item.poolImg" alt="">
          <span class="pool-tit">{{ $t(item.poolTit) }}{{ item.poolType }}</span>
          <span class="pool-txt">{{ item.poolTxt }}</span>
        </li>
      </ul>
    </section>

    <!-- 申请矿池弹窗 -->
    <pool-mask
       v-show="maskShow"
       @appendContract="appendContractAddress"
       @close="closeMask"/>
  </main>
</template>

<script>
import applySuccess1 from '../../../assets/images/applySuccess1.png'
import applySuccess2 from '../../../assets/images/applySuccess2.png'
import applySuccess3 from '../../../assets/images/applySuccess3.png'
import applySuccess4 from '../../../assets/images/applySuccess4.png'

import poolMask from './ore-pool-mask'
export default {
  name: '',
  props: {
    pages: Number,
    // availableMoney: String,
    // freezeMoney: String,
    // walletAddress: String,
    // contractAddress: String,
    // privateKey: String,
    hasContract: Boolean,
    poolList: Array,
    poolName: String,
    poolNode: Number,
    poolAssets: Number,
    poolAllEarnings: String,
    poolMyEarnings: String,
    poolApplyTime: String,
    poolApplyMoney: Number,
    applyContract: Boolean
  },
  components: {
    poolMask
  },
  data() {
    return {
      //orePoolTrue: true, //挖矿是否可开启 默认 false
      orePoolTxt: 'homeDig.hdNavPoolBtn1', //矿池是否可开启的文本内容  如果满足条件 orePoolTrue = true  orePoolTxt = 'Apply for opening a mining pool'
      conditionsTips: 'homeDig.hdNavPoolTxt1', //可以开启挖矿 homeDig.hdNavPoolTxt2
      orePoolName: '矿池名称',//矿池名称
      applySuccess1,
      applySuccess2,
      applySuccess3,
      applySuccess4,
      maskShow: false,
    }
  },
  computed: {
    availibleMoney () {
      return this.$store.getters.miningWalletAvailibleMoney
    },
    freezeMoney () {
      return this.$store.getters.miningWalletFreezeMoney
    },

    contractAddress () {
      return this.$store.getters.miningWallet.ownPoolAddress[0]
    },

    walletAddress () {
      return this.$store.getters.miningWallet.walletAddress
    },

    orePoolTrue () {
      if (this.removeCommaNum(this.$store.getters.miningWalletAvailibleMoney) >= 500000 && this.applyContract) {//
        this.orePoolTxt = 'homeDig.hdNavPoolBtn2'
        this.conditionsTips = "homeDig.hdNavPoolTxt2"
        return true
      } else {
        this.orePoolTxt = 'homeDig.hdNavPoolBtn1'
        this.conditionsTips = "homeDig.hdNavPoolTxt1"
        return false
      }
    },

    successList () {
      return [
        {
          id: 0,
          poolImg: this.applySuccess1,
          poolTit: 'homeDig.hdNavPoolSuccessListTxt1',
          poolType: '(BIUT)',
          poolTxt: this.getPointNum(this.poolAssets) || 0,
        },
        {
          id: 1,
          poolImg: this.applySuccess2,
          poolType: '',
          poolTit: 'homeDig.hdNavPoolSuccessListTxt2',
          poolTxt: this.poolNode || 0,
        },
        {
          id: 2,
          poolImg: this.applySuccess3,
          poolType: '(BIU)',
          poolTit: 'homeDig.hdNavPoolSuccessListTxt3',
          poolTxt: this.getPointNum(this.poolAllEarnings || 0),
        },
        {
          id: 3,
          poolImg: this.applySuccess4,
          poolType: '(BIU)',
          poolTit: 'homeDig.hdNavPoolSuccessListTxt4',
          poolTxt: this.getPointNum(this.poolMyEarnings) || 0,
        }
      ]
    }
  },

  created () {
    console.log(this.pages)
  },

  methods: {
    //关闭弹窗
    closeMask () {
      this.maskShow = false
    },

    appendContractAddress (privateKey, poolName) {
      this.maskShow = false
      this.$emit('addContract', privateKey, poolName)
    }
    
  },
}
</script>

<style scoped>
  .ore-container {height: 100%;}
  .ore-pool-conditions {height: 100%;display: flex;justify-content: center;align-items: center;flex-direction: column;}
  .ore-pool-conditions p {padding-bottom: 40px;color: #99A1A6;font-size: 14px;width: 342px;text-align: center;line-height: 1.5;}
  .ore-pool-conditions button {width:210px;height:48px;background:#fff;border-radius:4px;color: #99A1A6;
    border: 1px solid #E6E6E6;box-sizing: border-box;}
  .ore-pool-conditions .orePoolTrue {color: #29D893;border-color: #29D893;}
   
  .ore-pool-apply {height: 100%;}
  .ore-pool-apply-list {display: flex;align-items: center;justify-content: space-between;width: 100%;padding-top: 10px;font-size: 13px;}

  .ore-pool-apply-list p:last-child span,.ore-pool-apply-list p:first-child span {font-family: Lato-Regular;}

  .ore-pool-apply-list p:first-child {color: #6D7880;}
  .en .ore-pool-apply-list p:first-child {font-family: Source-Medium;}

  .en .ore-pool-apply-list p:last-child {font-family: Source-Regular;color: #99A1A6;}
  .ore-pool-apply-list p:last-child span {color: #6D7880;}

  .ore-pool-apply-tips {width: 281px;color: #F5A623;height:48px;background:#fbfaf7;border-radius:4px;
    margin: 85px auto 0;display: flex;align-items: center;justify-content: center;padding: 0 25px 0 30px;font-family: Lato-Regular;
    font-size: 14px;}
  .en .ore-pool-apply-tips {font-size: 16px;font-family: Source-Regular;}



  .ore-pool-error {height: 100%;display: flex;justify-content: space-between;align-items: center;flex-direction: column;}
  .ore-pool-error button {width:210px;height:48px;background:linear-gradient(90deg,#4291ff 0%,#0b7fe6 100%);border-radius:4px;
    color: #fff;border: 0;}
  .ore-pool-error ul {border: 0;width: 100%;padding: 0;}
  .ore-pool-error ul li {display: flex;align-items: center;justify-content: space-between;line-height: 1;height: 50px;
    width: 100%;cursor: default;font-size: 13px;color: #99A1A6;}
  .ore-pool-error ul li span {color: #252F33;}


  .ore-pool-success {height: 100%;}
  .header-success-list {display: flex;align-items: center;justify-content: space-between;font-family: Lato-Regular;padding-top: 10px;}
  .en .header-success-list {font-family: Source-Medium;}

  .success-list1 p:first-child,.success-list1 p:first-child span {color: #252F33!important;font-family: Lato-Regular;font-size: 13px;}


  .success-list1 p:last-child {color: #99A1A6;font-size: 12px;}
  .success-list2 p {color: #99A1A6;font-size: 13px;font-family: Lato-Regular;}
  .success-list2 p span,.success-list1 p span {font-family: Lato-Regular;color: #6D7880;}
  .en .success-list1 p,.en .success-list2 p {font-family: Source-Regular;}
  .success-list1 p:first-child,.success-list2 p:first-child {margin-bottom: 8px;}
  
  .ore-pool-success ul {display: flex;height: auto;border: 0;padding: 46px 0 0;}
  .ore-pool-success ul li {display: flex;flex-direction: column;flex: 1;align-items: center;height: auto;margin: 0;
    border-right: 1px solid #E6E6E6;height: 112px;}
  .ore-pool-success ul li:last-child {border: 0;}
  .ore-pool-success ul li .pool-tit {padding: 14px 0 12px;font-size: 13px;font-family: Lato-Regular;}
  .en .ore-pool-success ul li .pool-tit {font-family: Source-Regular;}
  .ore-pool-success ul li .pool-txt {font-size: 18px;color: #252F33;font-family: Lato-Medium;}

  .ore-pool-success ul li:first-child .pool-tit {color: #98A9D2;}
  .ore-pool-success ul li:nth-child(2) .pool-tit {color: #0B7FE6;}
  .ore-pool-success ul li:nth-child(3) .pool-tit {color: #F5A623;}
  .ore-pool-success ul li:last-child .pool-tit {color: #29D893;}
</style>