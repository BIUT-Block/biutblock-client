<template>
  <ul>
    <!-- 默认加载五条数据，点击查看更多就加载更多数据 -->
    <li @click="tradingDetails(item)" v-for="(item, index) in tradingList" v-if="index < tradingList.length">
      <section class="list-img">
        <img :src="item.listState | stateImg" alt="">
        <section>
          <p>{{item.listAddress}}</p>
          <p>{{item.listTime}}</p>
        </section>
      </section>
      <section class="list-amount" :class="item.listState | stateColor">
        <p>{{item.listMoney}} SEC</p>
        <p>{{item.listState}}</p>
      </section>
    </li>
  </ul>
</template>

<script>
import tradingPacked from '../../../assets/images/tradingPackeds.png'
import tradingSuccess from '../../../assets/images/tradingSuccesss.png'
import tradingFailed from '../../../assets/images/tradingFaileds.png'
import tradingMining from '../../../assets/images/tradingMinings.png'

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
        Failed: "mining",
        Mining: "failed",
      };
      return statusMap[status];
    },
    stateImg(status) {
      console.log(status)
      const statusMap = {
        Packed: tradingPacked,
        Successful: tradingSuccess,
        Failed: tradingFailed,
        Mining: tradingMining,
      };
      return statusMap[status];
    },
  }
}
</script>

<style scoped>
  ul li {display: flex;justify-content: space-between;height: 62px;align-items: center;margin: 0 32px;
    border-bottom: 1px solid #E6E6E6;font-size: 13px;color: #252F33;}
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