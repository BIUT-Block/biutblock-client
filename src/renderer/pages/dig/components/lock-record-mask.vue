<template>
  <main class="mask">
    <section class="mask-container record-mask">
      <header class="record-head">
        <h2>Lock record</h2>
        <img src="../../../assets/images/closeMask.png" alt="" title="close" @click="cloasMask">
      </header>

      <ul>
        <li>
          <span>LOCK TIME</span>
          <span>LOCKED AMOUNT (BIUT)</span>
          <span>UNLOCK TIME</span>
        </li>
        <li v-for="(item, index) in itemList" :key="index">
          <span>{{ item.lockTime }}</span>
          <span>{{ item.lockMoney }}</span>
          <span>{{ item.unlockTime }}</span>
        </li>
      </ul>

      <wallet-pages 
        :total="total"
        @next="nextPage"
        @prev="prevPage"
        @goPage="goPage" />
    </section>
  </main>
</template>

<script>
import walletPages from '../../../components/wallet-pages'
export default {
  name: '',
  props: {itemList: Array},
  components: {
    walletPages
  },
  computed: {
    itemLists () {
      return Array(7).fill(this.itemList[0])  //每页显示七条数据
    }
  },
  data () {
    return {
      total: 20
    }
  },
  methods: {
    nextPage () {
      alert("下一页")
    },

    prevPage () {
      alert("上一页")
    },

    goPage (e) {
      alert("失去焦点跳转页面" + e)
    },

    cloasMask () {
      this.$emit('close')
    }
  },
}
</script>

<style scoped>
  .record-mask {width: 716px;padding: 30px 32px 0;flex-direction: column;}
  .record-head {position: relative;}
  .record-head h2 {margin: 0;padding-bottom: 20px;}
  .record-head img {position: absolute;top: -10px;right: -12px;cursor: pointer;}

  ul {padding-bottom: 20px;}
  ul li {height: 42px;line-height: 42px;color: #252F33;font-size: 13px;display: flex;align-items: center;}

  ul li span:first-child {width: 30%;display: inline-block;padding-left: 20px;}
  ul li span:nth-child(2) {width: 40%;display: inline-block;color: #0B7FE6;}
  ul li span:last-child {width: 30%;display: inline-block;}
  
  ul li:nth-child(even) {background: #fff;}
  ul li:nth-child(odd) {background:#f5f8fa;}

  ul li:first-child,ul li:first-child span:nth-child(2) {color: #99A1A6;}
  ul li:first-child {font-family: Lato-Bold;}
</style>