<template>
  <main class="wallet-container">
    <!-- 钱包列表 -->
    <section class="wallet-list">
      <left-nav/>
    </section>

    <section class="wallet-content">
      <!-- 返回钱包首页 -->
      <section class="wallet-content-return">
        <img src="../../assets/images/returnImg.png" @click="returnWallet" title="return"/>
        <span>Transaction Details</span>
      </section>

      <!-- 图片 -->
      <section class="wallet-content-img">
        <img :src="stateImg" alt="" width="80px" height="66px">
        <h3>- 1000 sec</h3>
        <p>Successful</p>
      </section>

      <!-- 交易详情 -->
      <section class="wallet-content-list">
        <ul>
          <li v-for="item in tradingList" :key="item.id">
            <span>{{item.title}}</span>
            <span>{{item.cnt}}</span>
          </li>
          
        </ul>
      </section>

      <!-- 查看交易详情 -->
      <section class="wallet-content-footer">
        <img src="../../assets/images/tradingLogo.png" alt="">
        <span>See more details at SEC BLOCKCHAIN</span>
      </section>
    </section>
  </main>
</template>

<script>
import leftNav from './components/wallet-left-nav'
import tradingPacked from '../../assets/images/tradingPackeds.png'
import tradingSuccess from '../../assets/images/tradingSuccesss.png'
import tradingFailed from '../../assets/images/tradingFaileds.png'
import tradingMining from '../../assets/images/tradingMinings.png'
export default {
  name: 'walletTrading',
  components: {
    leftNav
  },
  props: {},

  data () {
    return {
      transactionNumber: '0x75f04e06b80b4b249a878000714e038fcc746ac54f',
      block: '01',
      time: '2018/11/08  21:03 UTC',
      beneficiary: '0x75f04e06b80b4b249a878000714e038fcc746ac548',
      party: '0x75f04e06b80b4b249a878000714e038fcc746ac548',
      cost: '8.89729807 sec',
      stateImg: tradingPacked //根据状态切换图片及颜色
    }
  },
  computed: {
    tradingList(){
      return [
          {
            id: '01',
            title: 'Transaction number',
            cnt: this.transactionNumber
          },
          {
            id: '02',
            title: 'Block',
            cnt: this.block
          },
          {
            id: '03',
            title: 'Creation time',
            cnt: this.time
          },
          {
            id: '04',
            title: 'Beneficiary',
            cnt: this.beneficiary
          },
          {
            id: '05',
            title: 'Sending party',
            cnt: this.party
          },
          {
            id: '06',
            title: 'Miner cost',
            cnt: this.cost
          },
      ]
    }
  },
  created () {

  },
  mounted () {

  },
  destroyed () {},
  methods: {
    returnWallet () {
      this.$router.push({ name: 'index'})
    }
  },
}
</script>

<style scoped>
  .wallet-content {margin: 24px 32px;box-shadow:0px 0px 6px rgba(37,47,51,0.16);padding: 16px 36px 20px 20px;}
  .wallet-content-return {display: flex;align-items: center;color: #839299;font-size: 14px}
  .wallet-content-return img {width: 24px;height: 24px;margin-right: 8px;}

  .wallet-content-img {text-align: center;color: #29D893;padding: 50px 0 56px;}
  .wallet-content-img h3 {font-weight: bold;font-size: 18px;margin: 6px 0 0;}

  .wallet-content-list {color: #252F33;font-size:14px;font-weight: 400;padding-bottom: 87px;
    padding-left: 36px;}
  .wallet-content-list ul li {display: flex;margin-bottom: 18px;}
  .wallet-content-list ul li:last-child {margin-bottom: 0;}
  .wallet-content-list ul li span:first-child {width: 155px;color: #576066;}

  .wallet-content-footer {color: #0B7FE6;text-align: center;}
  .wallet-content-footer img {width: 18px;height: 18px;margin-right: 8px;vertical-align: middle;}
</style>