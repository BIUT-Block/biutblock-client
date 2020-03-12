<template>
  <ul>
    <!-- 默认加载五条数据，点击查看更多就加载更多数据 -->
    <li
      @click="tradingDetails(item)"
      v-for="(item, index) in tradingList"
      v-if="index < tradingList.length && tradingList.length > 0"
    >
      <section v-if="item" class="list-img">
        <img :src="item.listState | stateImg(item.listMoney)" alt="" />
        <section>
          <p>{{ item.listAddress }}</p>
          <span>{{ item.listTime }}</span>
        </section>
      </section>
      <section class="list-amount" :class="item.listState | stateColor">
        <p>{{ getPointNum(item.listMoney) }} {{ item.listUnit }}</p>
        <span>{{ item.listState | state(item.listState, i18Ens) }}</span>
      </section>
    </li>
  </ul>
</template>

<script>
import tradingPacked from '../../../assets/images/tradingPacked.png'  //转账中
import tradingSuccess from '../../../assets/images/tradingSuccess.png' //转账成功
import tradingMining from '../../../assets/images/tradingMining.png'  //挖矿
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
  data() {
    return {

    }
  },
  computed: {
    i18Ens() {
      let flg = this.$i18n.locale
      if (flg === 'zh') {
        return 0
      } else {
        return 1
      }
    }
  },
  created() {

  },
  mounted() {

  },
  destroyed() { },
  methods: {
    tradingDetails(item) {
      this.$router.push({ name: 'walletTrading', query: { trade: item } })
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
      switch (status) {
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
    },

    state(status1, status2, status3) {
      if (status3 === 0) {
        switch (status1) {
          case 'Successful':
            return '成功'
            break
          case 'Packed':
            return '打包中'
          case 'Mining':
            return '挖矿收益'
            break
          default:
            break
        }
      } else {
        switch (status1) {
          case 'Successful':
            return 'Successful'
            break
          case 'Packed':
            return 'Packed'
          case 'Mining':
            return 'Mining'
            break
          default:
            break
        }
      }
    }
  }
}
</script>

<style scoped>
ul li {
  display: flex;
  justify-content: space-between;
  height: 62px;
  align-items: center;
  margin: 0 32px;
  border-bottom: 1px solid #e6e6e6;
  color: #252f33;
  box-sizing: border-box;
}
ul li .list-img {
  display: flex;
}
ul li .list-img section p:last-child {
  color: #576066;
}

ul li .list-img section p,
ul li .list-img section span {
  font-family: Lato-Regular;
}
.en ul li .list-img section span {
  font-family: Source-Regular;
}
ul li .list-img img {
  width: 40px;
  height: 33px;
  margin-right: 13px;
}
ul li .list-amount {
  text-align: right;
}

ul li .list-img section p {
  font-size: 13px;
  padding-bottom: 2px;
}
ul li .list-img section span {
  font-size: 12px;
  color: #839299;
  padding-top: 2px;
}

ul li:hover {
  cursor: pointer;
}

.packed {
  color: #f5a623;
}
.successful {
  color: #29d893;
}
.mining {
  color: #388ed9;
}
.failed {
  color: #ee1c39;
}
</style>