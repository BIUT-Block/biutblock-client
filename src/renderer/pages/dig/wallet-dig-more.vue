<template>
  <main>
    <section class="dig-more-container">
      <!-- 头部 -->
      <section class="dig-more-header">
        <img src="../../assets/images/returnImg.png" @click="returnDig" title="return"/>
        <section class="dig-more-header-title">
          <section>
            <p>Wallet Name</p>
            <p>Wallet 01</p>
          </section>
          <section>
            <p>Wallet Account</p>
            <p>0x75f04e06b80b4b249a878000714e038fcc746ac54f</p>
          </section>
        </section>
      </section>

      <!-- 内容 -->
      <section class="dig-more-body" :class="loadMoren?'dig-body-padding-bottom':''">
        <dig-title :digTitleShow="false" class="dig-more-body-header" :number="digNumber" :income="digIncome"/>
        <dig-list :moreList="moreList"/>
        <p v-show="loadMoren">Click to load more</p>
      </section>
    </section>
  </main>
</template>

<script>
import digTitle from './components/wallet-dig-title'
import digList from './components/wallet-dig-more-list'
export default {
  name: '',
  components: {
    digTitle,
    digList
  },
  props: {},
  data () {
    return {
      loadMoren: true, //加载更多按钮
      digNumber: '1000',
      digIncome: '100',
      moreList: [
        {
          id: '01',
          age: '3 days 4 hours 15 secs ago',
          reward: '+2.00 SEC',
          blicks: '155565',
          block: '0x75f04e06b80b4b249a878000714e038fcc746ac54f'
        },
        {
          id: '01',
          age: '3 days 4 hours 15 secs ago',
          reward: '+2.00 SEC',
          blicks: '155565',
          block: '0x75f04e06b80b4b249a878000714e038fcc746ac54f'
        },
        {
          id: '01',
          age: '3 days 4 hours 15 secs ago',
          reward: '+2.00 SEC',
          blicks: '155565',
          block: '0x75f04e06b80b4b249a878000714e038fcc746ac54f'
        },
        {
          id: '01',
          age: '3 days 4 hours 15 secs ago',
          reward: '+2.00 SEC',
          blicks: '155565',
          block: '0x75f04e06b80b4b249a878000714e038fcc746ac54f'
        },
        {
          id: '01',
          age: '3 days 4 hours 15 secs ago',
          reward: '+2.00 SEC',
          blicks: '155565',
          block: '0x75f04e06b80b4b249a878000714e038fcc746ac54f'
        },
        {
          id: '01',
          age: '3 days 4 hours 15 secs ago',
          reward: '+2.00 SEC',
          blicks: '155565',
          block: '0x75f04e06b80b4b249a878000714e038fcc746ac54f'
        },
        {
          id: '01',
          age: '3 days 4 hours 15 secs ago',
          reward: '+2.00 SEC',
          blicks: '155565',
          block: '0x75f04e06b80b4b249a878000714e038fcc746ac54f'
        },
        {
          id: '01',
          age: '3 days 4 hours 15 secs ago',
          reward: '+2.00 SEC',
          blicks: '155565',
          block: '0x75f04e06b80b4b249a878000714e038fcc746ac54f'
        },
        {
          id: '01',
          age: '3 days 4 hours 15 secs ago',
          reward: '+2.00 SEC',
          blicks: '155565',
          block: '0x75f04e06b80b4b249a878000714e038fcc746ac54f'
        },
        {
          id: '01',
          age: '3 days 4 hours 15 secs ago',
          reward: '+2.00 SEC',
          blicks: '155565',
          block: '0x75f04e06b80b4b249a878000714e038fcc746ac54f'
        }
      ]
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
    //返回挖矿页面
    returnDig () {
      this.$router.push({ path: '/walletDig' })
    }
  },
}
</script>

<style scoped>
  main {padding: 24px;background: #F4F5F5;height: calc(100vh - 78px);display: flex;
    align-content: stretch;display:-webkit-flex;}
  .dig-more-container {display: flex;flex-direction: column;box-shadow:0px 0px 3px rgba(0,0,0,0.16);
    border-radius:4px;flex: 1;}

  .dig-more-header {height: 102px;border-bottom:1px solid rgba(229,229,229,1);background: #fff;
    border-top-left-radius: 4px;border-top-right-radius: 4px;}
  .dig-more-header img {width: 24px;height: 24px;margin: 7px 0 14px 12px;}
  .dig-more-header .dig-more-header-title {display: flex;padding-left: 32px;color: #839299;}
  .dig-more-header .dig-more-header-title section p:last-child {color: #252F33;font-weight: 500;
    font-size: 14px;padding-top: 6px;font-family: Lato-Medium;}
  .dig-more-header .dig-more-header-title section:last-child {padding-left: 203px;}


  .dig-more-body {background: #fff;padding: 67px 32px 0;border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;overflow: auto;flex: 1;position: relative;}
  .dig-more-body-header {position: fixed;top: 157px;left: 126px;right: 56px;background: #fff;
    padding: 36px 0 13px;}
  .dig-more-body p {height: 40px;text-align: center;line-height: 40px;color: #839299;font-weight: 400;
    position: fixed;bottom: 24px;left: 94px;right: 24px;background: #fff;border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;}
  .dig-body-padding-bottom {padding-bottom: 40px;}
</style>