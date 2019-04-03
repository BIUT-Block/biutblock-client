<template>
  <main class="wallet-container">
    <!-- 钱包列表 -->
     <section class="wallet-list">
      <left-nav :wallets="wallets" :selectedPrivateKey="selectedPrivateKey" createdId="walletIndex"/>
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
        <h3 :class="textStyle">{{amount}}</h3>
        <p :class="textStyle">{{status}}</p>
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
      <section class="wallet-content-footer" :class="{'hideLink':status==='Packed'}">
        <img src="../../assets/images/tradingLogo.png" alt="">
        <a :href="transactionLink" target="_blank">See more details at SEC BLOCKCHAIN</a>
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
      amount: '',
      status: '',
      wallets: {},
      selectedPrivateKey: '',
      textStyle: 'packed',
      stateImg: tradingPacked, //根据状态切换图片及颜色
      transactionLink: ''
      
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
            title: 'From',
            cnt: this.party
          },
          {
            id: '05',
            title: 'To',
            cnt: this.beneficiary
          },
          {
            id: '06',
            title: 'Cost',
            cnt: this.cost
          },
      ]
    }
  },
  created () {
    let trade = this.$route.query.trade
    this.wallets = this.$route.query.wallets
    this.selectedPrivateKey = this.$route.query.selectedPrivateKey
    this.transactionNumber = `0x${trade.id}`
    this.block = trade.blockNumber
    this.time = trade.listTime
    this.beneficiary = `0x${trade.listFrom}`
    this.party = `0x${trade.listTo}`
    this.amount = trade.listMoney
    this.cost = trade.listMinerCost
    this.status = trade.listState
    switch(trade.listState) {
      case 'Successful':
        this.stateImg = tradingSuccess
        this.textStyle = 'successful'
        this.transactionLink = `http://scan.secblock.io/search?search=${this.transactionNumber}`
        break
      case 'Packed':
        this.stateImg = tradingPacked
        this.textStyle = 'packed'
        break
      case 'Mining':
        this.stateImg = tradingMining
        this.textStyle = 'mining'
        this.transactionLink = `http://scan.secblock.io/search?search=${this.transactionNumber}`
        break
      default:
        break
    }

  },
  mounted () {

  },
  destroyed () {},
  methods: {
    returnWallet () {
      this.$router.push({ name: 'index', query: {wallets: this.$route.query.wallets, selectedPrivateKey: this.$route.query.selectedPrivateKey}})
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
  .wallet-content-list ul li span:last-child {flex: 1;word-break: break-all;}

  .wallet-content-footer {color: #0B7FE6;text-align: center;}
  .wallet-content-footer img {width: 18px;height: 18px;margin-right: 8px;vertical-align: middle;}

  .packed {color: #F5A623;}
  .successful {color: #29D893;}
  .mining {color: #388ED9;}
  .failed {color: #EE1C39;}

  .hideLink {display: none;}
</style>