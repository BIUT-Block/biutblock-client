<template>
  <main class="mask">
    <section class="mask-container record-mask">
      <header class="record-head">
        <h2>{{ $t('homeDigMask.hdMaskRecordTit') }}</h2>
        <img src="../../../assets/images/closeMask.png" alt="" title="close" @click="cloasMask">
      </header>

      <ul>
        <li>
          <span>{{ $t('homeDigMask.hdMaskRecordListTxt1') }}</span>
          <span>{{ $t('homeDigMask.hdMaskRecordListTxt2') }}</span>
          <span>{{ $t('homeDigMask.hdMaskRecordListTxt3') }}</span>
        </li>
        <li v-for="(item, index) in itemList" :key="index">
          <span>{{ item.lockTime.substring(0,20) }}</span>
          <span>{{ getPointNum(item.lockMoney) }}</span>
          <span>{{ item.unlockTime.substring(0,20) }}</span>
        </li>
      </ul>

      <!-- <wallet-pages 
        :total= itemList.length
        @next="nextPage"
        @prev="prevPage"
        @goPage="goPage" /> -->
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
  .record-head h2 {margin: 0;padding-bottom: 24px;font-family: Montserrat-SemiBold;font-size: 24px;color: #252F33;}
  .en .record-head h2 {font-family: Source-Medium;font-size: 22px;}
  .record-head img {position: absolute;top: -10px;right: -12px;cursor: pointer;}

  ul {padding-bottom: 20px;height: 394px;overflow: auto;}
  ul::-webkit-scrollbar { width: 2px; height: 2px;}
  ul::-webkit-scrollbar-thumb { -webkit-box-shadow: inset 0 0 1px #00D6B2;background: #00D6B2;border-radius: 1px;}
  ul::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 1px #EDF5F4;border-radius: 0; background: #EDF5F4;}
  ul li {height: 42px;line-height: 42px;color: #252F33;font-size: 13px;display: flex;align-items: center;font-family: Lato-Regular;}

  ul li span:first-child {width: 30%;display: inline-block;padding-left: 20px;}
  ul li span:nth-child(2) {width: 40%;display: inline-block;color: #0B7FE6;}
  ul li span:last-child {width: 30%;display: inline-block;}
  
  ul li:nth-child(even) {background: #fff;}
  ul li:nth-child(odd) {background:#f5f8fa;}

  ul li:first-child,ul li:first-child span:nth-child(2) {color: #99A1A6;}
  ul li:first-child {font-family: Lato-Bold;}
  .en ul li:first-child {font-family: Source-Medium;}
</style>