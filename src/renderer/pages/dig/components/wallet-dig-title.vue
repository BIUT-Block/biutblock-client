<template>
  <section class="dig-body-title">
    <h3>Mining Record</h3>
    <section class="dig-body-title-list">
      <section>
        <span></span>
        <span>Number Of Mined：</span>
        <span>{{ getPointNum (this.number, 8) }}</span>
      </section>
      <section>
        <span></span>
        <span>Income of Mined：</span>
        <span>{{ getPointNum (this.income, 8) }}  TEC</span>
      </section>
      <section class="dig-more" v-show="digTitle" @click="digMore">More</section>
      <!-- <section class="dig-more" @click="digMore">More</section> -->
    </section>
  </section>
</template>

<script>
export default {
  name: '',
  components: {

  },
  props: {
    number: Number,
    income: String,
    selectedWallet: Object,
    selectedPrivateKey: String,
    wallets: Object
  },
  data() {
    return {
    }
  },
  computed: {
    digTitle: function(){
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
  .dig-body-title h3 {margin: 0;font-size: 14px;color: #F2F5FF;font-family: Montserrat-SemiBold;font-weight: 600;}
  .dig-body-title .dig-body-title-list section {color: #9097C7;font-family: Montserrat-Light;}
  .dig-body-title .dig-body-title-list section span:first-child {display: inline-block;width:6px;height:6px;
    background:rgba(245,166,35,1);border-radius:50%;margin-right: 10px;}
  .dig-body-title .dig-body-title-list section span:last-child {color: #F2F5FF;font-family: Lato-Medium;}
  .dig-body-title .dig-body-title-list section:nth-of-type(even) span:first-child {background:#FB8091;margin-left: 40px;}
  .dig-body-title .dig-body-title-list .dig-more {width:48px;height:24px;background:#404B8C;
    border-radius:2px;text-align: center;line-height: 24px;color: #fff;font-weight: 400;margin-left: 50px;}

</style>