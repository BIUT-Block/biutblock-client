<template>
  <section>
    <ul>
      <li>
        <span>LOCK  RECORD</span>
        <span>LOCKED AMOUNT (BIUT)</span>
        <p>
          UNLOCK TIME
          <span @click="maskShow = true" v-show="itemList.length > 0">More</span>
        </p>
      </li>
      <li v-for="(item, index) in itemList" v-if="itemList.length > 0 && index < 5" :key="index" v-show="itemList.length > 0">
        <span>{{ item.lockTime }}</span>
        <span>{{ item.lockMoney }}</span>
        <span>{{ item.unlockTime }}</span>
      </li>
    </ul>
    <section class="list-null" v-show="itemList.length === 0">
      <img src="../../../assets/images/wallet-null.png" alt="">
      <p>No record</p>
    </section>

    <record-mask @close = 'closeMask' :itemList="itemList" v-show="maskShow"/>
  </section>
</template>

<script>
import recordMask from './lock-record-mask'
export default {
  name: '',
  components: {
    recordMask
  },
  props: {
    itemList: Array
  },
  data () {
    return {
      maskShow: false
    }
  },
  created() {
    
  },
  methods: {
    closeMask () {
      this.maskShow = false
    }
  },
}
</script>

<style scoped>
  section {display: flex;flex-direction: column;height: 100%;}
  ul {width: 100%;}
  ul li {display: flex;align-items: center;justify-content: space-between;height: 42px;box-sizing: border-box;
    border-bottom: 1px solid #e5e5e5;}
  ul li:first-child {color: #99A1A6;border-bottom: 2px solid #E6E6E6;box-sizing: border-box;height: 34px;}

  ul li span:first-child {width: 35%;}
  ul li span:nth-child(2) {width: 30%;color: #0B7FE6;}

  ul li:first-child span:nth-child(2) {color: #99A1A6;}
  ul li p {width: 35%;display: flex;align-items: center;justify-content: space-between;}
  ul li p span {width:48px!important;height:24px;background:#ffffff;box-shadow:0px 0px 2px rgba(0,0,0,0.16);
    border-radius:2px;text-align: center;line-height: 24px;color: #29D893;cursor: pointer;}
  
  .list-null {flex: 1;display: flex;align-items: center;justify-content: center;flex-direction: column;}
  .list-null p {color: #99A1A6;font-size: 14px;padding-top: 16px;width: 71px;text-align: center;}
</style>