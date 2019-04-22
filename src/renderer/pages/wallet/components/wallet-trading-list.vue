<template>
  <ul>
    <!-- 默认加载五条数据，点击查看更多就加载更多数据 -->
    <li @click="tradingDetails(item)" v-for="(item, index) in tradingList" v-if="index < tradingList.length && tradingList.length > 0">
      <section v-if="item" class="list-img">
        <img :src="item.listState | stateImg(item.listMoney)" alt="">
        <section>
          <p>{{item.listAddress}}</p>
          <p>{{item.listTime}}</p>
        </section>
      </section>
      <section class="list-amount" :class="item.listState | stateColor">
        <p>{{item.listMoney}} {{item.listUnit}}</p>
        <p>{{item.listState}}</p>
      </section>
    </li>
  </ul>
</template>

<script>
import tradingPacked from '../../../assets/images/tradingPackeds.png'  //转账中
import tradingSuccess from '../../../assets/images/tradingSuccesss.png' //转账成功
import tradingFailed from '../../../assets/images/tradingFaileds.png'  //转账失败
import tradingMining from '../../../assets/images/tradingMinings.png'  //挖矿
import collection from '../../../assets/images/collectionImg.png'  //收款成功

export default {
  name: '',
  components: {
     
  },
  props: {
    tradingList: Array,
    wallets: Object,
    selectedPrivateKey: String
  },
  data () {
    return {

    }
  },
  computed: {

  },
  created () {

  },
  mounted () {

  },
  destroyed () {},
  methods: {
    tradingDetails (item) {
      this.$router.push({ name: 'walletTrading', query: {trade: item, wallets: this.wallets, selectedPrivateKey: this.selectedPrivateKey}})
    }
  },
  filters: {
    stateColor(status) {
      const statusMap = {
        Packed: "packed",
        Successful: "successful",
        Failed: "failed",
        Mining: "mining",
      };
      return statusMap[status];
    },
    stateImg(status, value) {
      switch(status) {
      case 'Successful':
        if (value.indexOf('+') > -1) {
          return collection
        } else if (value.indexOf('-') > -1) {
          return tradingSuccess
        } 
        break
      case 'Packed':
        return tradingPacked
      case 'Mining':
        return tradingMining
        break
      default:
        break
      }
      // const statusMap = {
      //   Packed: tradingPacked,
      //   Successful: tradingSuccess,
      //   Failed: tradingFailed,
      //   Mining: tradingMining,
      // };
      // return statusMap[status];
    },
  }
}
</script>

<style scoped>
  ul li {display: flex;justify-content: space-between;height: 62px;align-items: center;margin: 0 32px;
    border-bottom: 1px solid #E6E6E6;font-size: 13px;color: #252F33;box-sizing: border-box;}
  ul li .list-img {display: flex;}
  ul li .list-img section p:last-child {color: #576066;font-size: 11px;}
  ul li .list-img img {width: 40px;height: 33px;margin-right: 13px;}
  ul li .list-amount {text-align: right;}
  ul li .list-amount p:last-child {font-size: 11px;}

  ul li:hover {cursor: pointer;}

  .packed {color: #F5A623;}
  .successful {color: #29D893;}
  .mining {color: #388ED9;}
  .failed {color: #EE1C39;}
</style>