<template>
  <section>
    <ul>
      <li>
        <p>{{ $t('homeDig.hdNavRecordListTxt1') }}</p>
        <p>{{ $t('homeDig.hdNavRecordListTxt2') }}</p>
        <p class="last-more">
          {{ $t('homeDig.hdNavRecordListTxt3') }}
          <span @click="maskShow = true" v-show="itemList.length > 5" class="more">{{ $t('homeDig.hdNavRecordMore') }}</span>
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
      <p>{{ $t('homeDig.hdNavRecordListNull') }}</p>
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
  ul li {display: flex;align-items: center;justify-content: space-between;height: 42px;box-sizing: border-box;font-family: Lato-Regular;
    border-bottom: 1px solid #e5e5e5;}
  ul li:first-child {color: #99A1A6;border-bottom: 2px solid #E6E6E6;box-sizing: border-box;height: 34px;}
  .en ul li:first-child {font-family: Source-Regular;}

  ul li:first-child p:first-child,ul li span:first-child {width: 35%;}
  ul li:first-child p:nth-child(2),ul li span:nth-child(2) {width: 30%;}
  ul li:first-child p:last-child,ul li span:nth-child(3) {width: 35%;}

  ul li span:nth-child(2) {color: #0B7FE6;}
  
  

  .last-more {display: flex;align-items: center;justify-content: space-between;}

  .last-more .more {height:24px;background:#ffffff;box-shadow:0px 0px 2px rgba(0,0,0,0.16);padding: 0 9px;width: auto;
    border-radius:2px;text-align: center;line-height: 24px;color: #29D893;cursor: pointer;}
  
  .list-null {flex: 1;display: flex;align-items: center;justify-content: center;flex-direction: column;}
  .list-null p {color: #99A1A6;font-size: 14px;padding-top: 16px;width: 71px;text-align: center;}
</style>