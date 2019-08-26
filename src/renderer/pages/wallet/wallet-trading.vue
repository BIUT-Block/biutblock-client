<template>
  <main class="wallet-container">
    <!-- 钱包列表 -->
     <section class="wallet-list">
      <left-nav :wallets="wallets" :selectedPrivateKey="selectedPrivateKey" createdId="walletIndex" />
    </section>

    <section class="wallet-content">
      <!-- 返回钱包首页 -->
      <section class="wallet-content-return">
        <img src="../../assets/images/returnImg.png" @click="returnWallet" title="return"/>
        <span>{{ $t('homeWalletDetails.hwdTit') }}</span>
      </section>

      <!-- 图片 -->
      <section class="wallet-content-img">
        <img :src="stateImg" alt="" width="80px" height="66px">
        <h3 :class="textStyle">{{amount}} {{moneyType}}</h3>
        <p :class="textStyle">{{status}}</p>
      </section>

      <!-- 交易详情 -->
      <section class="wallet-content-list">
        <ul>
          <li v-for="item in tradingList" :key="item.id">
            <span>{{ $t(item.title) }}</span>
            <span>{{item.cnt}}</span>
          </li>          
        </ul>
      </section>

      <!-- 查看交易详情 -->
      <section class="wallet-content-footer" :class="{'hideLink':status==='Packed'}">
        <img :src=" moneyType == 'BIUT' ? tradingLogo1 : tradingLogo2 " alt="">
        <a :href="transactionLink" target="_blank">{{ $t('homeWalletDetails.hwFootTxt1') }} {{moneyType}} {{ $t('homeWalletDetails.hwFootTxt2') }}</a>
      </section>
    </section>
  </main>
</template>

<script>
import leftNav from './components/wallet-left-nav'
import tradingPacked from '../../assets/images/tradingPackeds.png'  //转账中
import tradingSuccess from '../../assets/images/tradingSuccesss.png' //转账成功
import tradingMining from '../../assets/images/tradingMinings.png' //挖矿
import collectionImg from '../../assets/images/collectionImgs.png' //收款成功

import tradingLogo1 from '../../assets/images/tradingLogo.png' //BIUT 的logo
import tradingLogo2 from '../../assets/images/tradingLogo1.png' //BIU 的logo
export default {
  name: 'walletTrading',
  components: {
    leftNav
  },
  props: {},

  data () {
    return {
      tradingLogo1,
      tradingLogo2,
      transactionNumber: '',
      block: '01',
      time: '',
      beneficiary: '',
      party: '',
      cost: '',
      amount: '',
      status: '',
      wallets: {},
      selectedPrivateKey: '',
      textStyle: '',
      stateImg: tradingPacked, //根据状态切换图片及颜色
      transactionLink: '',
      fee: '', //转账手续费
      moneyType: ''
    }
  },
  computed: {
    tradingList(){
      return [
          {
            id: '01',
            title: 'homeWalletDetails.hwdListTxt1',
            cnt: this.transactionNumber
          },
          {
            id: '02',
            title: 'homeWalletDetails.hwdListTxt2',
            cnt: this.block
          },
          {
            id: '03',
            title: 'homeWalletDetails.hwdListTxt3',
            cnt: this.time
          },
          {
            id: '04',
            title: 'homeWalletDetails.hwdListTxt4',
            cnt: this.beneficiary
          },
          {
            id: '05',
            title: 'homeWalletDetails.hwdListTxt5',
            cnt: this.party
          },
          {
            id: '06',
            title: 'homeWalletDetails.hwdListTxt6',
            cnt: this.amount + ' '+ this.moneyType //携带  SEC、SEN 做页面展示
          },
          {
            id: '07',
            title: 'homeWalletDetails.hwdListTxt7',
            cnt: this.fee + ' BIU'
          }
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
    this.fee = trade.listMinerCost
    this.moneyType=trade.listUnit
    
    let address = 'http://scan.biut.io/sen/search?search='
    if (this.$JsonRPCClient.isTestNetwork()) {
      address = 'http://test.biut.io/search?search='
    }
    switch(trade.listState) {
      case 'Successful':
        if (trade.listMoney.indexOf('+') > -1) {
          this.stateImg = collectionImg
        } else if (trade.listMoney.indexOf('-') > -1) {
          this.stateImg = tradingSuccess
        } 
        this.textStyle = 'successful'
        this.transactionLink = `${address}${this.transactionNumber}`
        break
      case 'Packed':
        this.stateImg = tradingPacked
        this.textStyle = 'packed'
        break
      case 'Mining':
        this.stateImg = tradingMining
        this.textStyle = 'mining'
        this.transactionLink = `${address}${this.transactionNumber}`
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
  .wallet-list >>> ul {pointer-events: none;}
  .wallet-content {margin: 24px 32px;box-shadow:0px 0px 6px rgba(37,47,51,0.16);padding: 16px 36px 20px 20px;}
  .wallet-content-return {display: flex;align-items: center;color: #839299;font-size: 14px}
  .wallet-content-return img {width: 24px;height: 24px;margin-right: 8px;}

  .wallet-content-img {text-align: center;color: #29D893;padding: 50px 0 56px;}
  .wallet-content-img h3 {font-weight: bold;font-size: 18px;margin: 6px 0 0;}

  .wallet-content-list {color: #252F33;font-size:14px;font-weight: 400;padding-bottom: 49px;
    padding-left: 36px;}
  .wallet-content-list ul li {display: flex;margin-bottom: 18px;}
  .wallet-content-list ul li:last-child {margin-bottom: 0;}
  .wallet-content-list ul li span:first-child {width: 155px;color: #576066;}
  .wallet-content-list ul li span:last-child {flex: 1;word-break: break-all;font-family: Lato-Regular;}

  .wallet-content-footer {color: #0B7FE6;text-align: center;}
  .wallet-content-footer img {width: 18px;height: 18px;margin-right: 8px;vertical-align: middle;}

  .packed {color: #F5A623;}
  .successful {color: #29D893;}
  .mining {color: #388ED9;}
  .failed {color: #EE1C39;}

  .hideLink {display: none;}
  a {text-decoration: none;}
</style>