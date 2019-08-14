<template>
  <main class="ore-container">
    <!-- 条件不足、条件满足 -->
    <section class="ore-pool-conditions" v-show="pages == 1">
      <p>Only more than 500,000 you  can apply for opening the mining pool!</p>
      <button
        type="button"
        :class="orePoolTrue ? 'orePoolTrue' : ''"
        :disabled="!orePoolTrue"
        @click="maskShow = true">
        {{ orePoolTxt }}
      </button>
    </section>

    <!-- 申请中 -->
    <section class="ore-pool-apply" v-show="pages == 2">
      <img src="../../../assets/images/ongoingImg.png" alt="" />
      <p>
        You have applied for starting the mining pool(
        <span>{{ poolName }} Mine PooL</span>),please wait for 3~5 days.
      </p>
    </section>

    <!-- 申请失败 -->
    <section class="ore-pool-error" v-show="pages == 3">
      <span></span>
      <button type="button">Create my mine pool</button>
      <ul>
        <li>
          <p>
            Application record
          </p>
          <p>
            Application Amount：
            <span>{{ poolApplyMoney }}</span>
          </p>
          <p>
            Time：
            <span>{{ poolApplyTime }}</span>
          </p>
          <p>
            Status：
            <span>Refuse</span>
          </p>
        </li>
      </ul>
    </section>

    <!-- 申请成功 -->
    <section class="ore-pool-success" v-show="pages == 4">
      <section class="header-success-list">
        <p>{{ poolName }} Mine Pool</p>
        <p>start time：{{ poolApplyTime }}</p>
      </section>
      <ul>
        <li v-for="(item, index) in successList" :key="index">
          <img :src="item.poolImg" alt="">
          <span class="pool-tit">{{ item.poolTit }}</span>
          <span class="pool-txt">{{ item.poolTxt }}</span>
        </li>
      </ul>
    </section>

    <!-- 申请矿池弹窗 -->
    <pool-mask
       v-show="maskShow"
       :walletAddress="walletAddress"
       :privateKey="privateKey"
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
    availableMoney: Number,
    freezeMoney: Number,
    walletAddress: String,
    privateKey: String,
    hasContract: Boolean,
    poolList: Array,
    poolName: String,
    poolNode: Number,
    poolAssets: Number,
    poolAllEarnings: Number,
    poolMyEarnings: Number,
    poolApplyTime: String,
    poolApplyMoney: Number
  },
  components: {
    poolMask
  },
  data() {
    return {
      //orePoolTrue: true, //挖矿是否可开启 默认 false
      orePoolTxt: 'Unable to open mining pool', //矿池是否可开启的文本内容  如果满足条件 orePoolTrue = true  orePoolTxt = 'Apply for opening a mining pool'
      orePoolName: '矿池名称',//矿池名称
      applySuccess1,
      applySuccess2,
      applySuccess3,
      applySuccess4,
      maskShow: false  
    }
  },
  computed: {
    orePoolTrue () {
      if (this.freezeMoney >= 500000) {//
        this.orePoolTxt = 'Apply for opening a mining pool'
        return true
      } else {
        this.orePoolTxt = 'Unable to open mining pool'
        return false
      }
    },

    successList () {
      return [
        {
          id: 0,
          poolImg: this.applySuccess1,
          poolTit: 'My pool assets',
          poolTxt: this.poolAssets.toLocaleString('en-US') + " BIUT",
        },
        {
          id: 1,
          poolImg: this.applySuccess2,
          poolTit: 'Number of pool nodes',
          poolTxt: this.poolNode.toLocaleString('en-US') + " BIUT",
        },
        {
          id: 2,
          poolImg: this.applySuccess3,
          poolTit: 'Total pool profit',
          poolTxt: this.poolAllEarnings.toLocaleString('en-US') + " BIU",
        },
        {
          id: 3,
          poolImg: this.applySuccess4,
          poolTit: 'My profit',
          poolTxt: this.poolMyEarnings.toLocaleString('en-US') + " BIU",
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

    appendContractAddress (privateKey, contractAddress) {
      this.maskShow = false
      this.$emit('addContract', privateKey, {contractAddress: contractAddress, status: 'pending'})
    }
    
  },
}
</script>

<style scoped>
  .ore-container {height: 100%;}
  .ore-pool-conditions,.ore-pool-apply {height: 100%;display: flex;justify-content: center;align-items: center;flex-direction: column;}
  .ore-pool-conditions p {padding-bottom: 40px;color: #99A1A6;font-size: 14px;width: 342px;text-align: center;line-height: 1.5;}
  .ore-pool-conditions button {width:210px;height:48px;background:#fff;border-radius:4px;color: #99A1A6;
    border: 1px solid #E6E6E6;box-sizing: border-box;}
  .ore-pool-conditions .orePoolTrue {color: #29D893;border-color: #29D893;}

  .ore-pool-apply p {padding-top: 32px;width: 410px;text-align: center;color: #99A1A6;font-size: 14px;line-height: 1.5;}
  .ore-pool-apply p span {color: #252F33;font-family: Lato-Medium;}


  .ore-pool-error {height: 100%;display: flex;justify-content: space-between;align-items: center;flex-direction: column;}
  .ore-pool-error button {width:210px;height:48px;background:linear-gradient(90deg,#4291ff 0%,#0b7fe6 100%);border-radius:4px;
    color: #fff;border: 0;}
  .ore-pool-error ul {border: 0;width: 100%;padding: 0;}
  .ore-pool-error ul li {display: flex;align-items: center;justify-content: space-between;line-height: 1;height: 50px;
    width: 100%;cursor: default;font-size: 13px;color: #99A1A6;}
  .ore-pool-error ul li span {color: #252F33;}


  .ore-pool-success {height: 100%;}
  .header-success-list {display: flex;align-items: center;justify-content: space-between;}
  .header-success-list p:first-child {color: #252F33;font-size: 13px;}
  .header-success-list p:last-child {color: #99A1A6;}
  
  .ore-pool-success ul {display: flex;height: auto;border: 0;padding: 40px 0 0;}
  .ore-pool-success ul li {display: flex;flex-direction: column;flex: 1;align-items: center;height: auto;margin: 0;
    border-right: 1px solid #E6E6E6;height: 112px;}
  .ore-pool-success ul li:last-child {border: 0;}
  .ore-pool-success ul li .pool-tit {padding: 14px 0 12px;font-size: 13px;}
  .ore-pool-success ul li .pool-txt {font-size: 18px;color: #252F33;font-family: Lato-Medium;}

  .ore-pool-success ul li:first-child .pool-tit {color: #98A9D2;}
  .ore-pool-success ul li:nth-child(2) .pool-tit {color: #0B7FE6;}
  .ore-pool-success ul li:nth-child(3) .pool-tit {color: #F5A623;}
  .ore-pool-success ul li:last-child .pool-tit {color: #29D893;}
</style>