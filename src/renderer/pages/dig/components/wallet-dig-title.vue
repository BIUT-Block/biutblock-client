<template>
  <section class="dig-body-title">
    <h3>{{ $t('homeDig.hdNavProfitListTit1') }}</h3>

    <section class="dig-body-title-list">
      <section>
        <span></span>
        <span>{{ $t('homeDig.hdNavProfitListTit2') }}：</span>
        <span>{{ this.number }}</span>
      </section>
      <section>
        <span></span>
        <span>{{ $t('homeDig.hdNavProfitListTit3') }}：</span>
        <span>{{ getPointNum(this.income) }}  BIU</span>
      </section>
      <span class="dig-more" v-show="digTitle" @click="digMore">{{ $t('homeDig.hdNavRecordMore') }}</span>
    </section>

  </section>
</template>

<script>
export default {
  name: '',
  components: {

  },
  props: {
  },
  data() {
    return {
    }
  },
  computed: {
    number () {
      return this.$store.getters.miningWalletDigNumber
    },
    income () {
      return this.$store.getters.miningWalletDigIncome
    },
    digTitle (){
      if (this.number === 0 || this.number < 6) {
        return false
      } else {
        return  true
      }
    }
  },
  created() {
    
  },
  mounted() {

  },
  destroyed() { },
  methods: {
    digMore () {
      this.$router.push({ path: '/walletDigMore', query: {wallets: this.wallets, selectedPrivateKey: this.selectedPrivateKey} })
    }
  },
}
</script>

<style scoped>
  .dig-body-title,.dig-body-title .dig-body-title-list {display: flex;justify-content: space-between;align-items: center;}
  .dig-body-title h3 {margin: 0;font-size: 14px;color: #839299;font-family: Montserrat-SemiBold;font-weight: 600;}
  .en .dig-body-title h3 {font-family: Source-Medium;color: #42535B;font-size: 16px;font-weight: 500;}
  .dig-body-title .dig-body-title-list section {color: #839299;font-family: Montserrat-Light;}
  .en .dig-body-title .dig-body-title-list section {color: #99A1A6;font-family: Source-Regular;}
  .dig-body-title .dig-body-title-list section span:first-child {display: inline-block;width:6px;height:6px;
    background:rgba(245,166,35,1);border-radius:50%;margin-right: 10px;}
  .dig-body-title .dig-body-title-list section span:last-child {color: #252F33;font-family: Lato-Bold;}
  .dig-body-title .dig-body-title-list section:nth-of-type(even) span:first-child {background:#388ED9;margin-left: 40px;}
  .dig-more {height:24px;background:rgba(255,255,255,1);padding: 0 10px;cursor: pointer;
    box-shadow:0px 0px 2px rgba(0,0,0,0.16);border-radius:2px;text-align: center;line-height: 24px;
    color: #29D893;font-weight: 400;margin-left: 50px;}
</style>