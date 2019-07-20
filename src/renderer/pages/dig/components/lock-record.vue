<template>
  <section>
    <ul v-show="idx == 0">
      <li>
        <span>锁仓时间</span>
        <span>锁仓金额（BIUT）</span>
        <span>解仓时间</span>
      </li>
      <li v-for="(item, index) in itemList" :key="index">
        <span>{{ item.lockTime }}</span>
        <span>{{ item.lockMoney }}</span>
        <span>{{ item.unlockTime }}</span>
      </li>
    </ul>

    <h4 v-show="idx == 1">暂无记录</h4>
  </section>
</template>

<script>
export default {
  name: '',
  props: {
    itemList: Array
  },
  data () {
    return {
      idx: 0
    }
  },
  created() {
    if (this.itemList.length === 0) {
      this.idx = 1
    }
  },
  methods: {

  },
}
</script>

<style scoped>
  section {padding: 20px;display: flex;align-items: center;justify-content: center;height: calc(100% - 40px);}
  ul {width: 100%;}
  ul li {display: flex;align-items: center;justify-content: space-between;height: 40px;
    border-bottom: 1px solid #e5e5e5;}
  ul li:first-child {color: #839299;font-family: Lato-Bold;border-bottom: 2px solid #e5e5e5;
    font-size: 16px;}
  ul li span:first-child {width: 35%;}
  ul li span:nth-child(2) {width: 30%;}
  ul li span:last-child {width: 35%;}

  h4 {font-size: 24px;}
</style>