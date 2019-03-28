<template>
  <main>
    <section class="dig-more-container">
      <!-- 头部 -->
      <section class="dig-more-header">
        <img src="../../assets/images/returnImg.png" @click="returnDig" title="return"/>
        <section class="dig-more-header-title">
          <section>
            <p>Wallet Name</p>
            <p>Wallet {{selectedWallet.walletName}}</p>
          </section>
          <section>
            <p>Wallet Account</p>
            <p>0x{{selectedWallet.walletAddress}}</p>
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
let updateListJob
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
      digNumber: '0',
      digIncome: '0',
      wallets: {},
      selectedPrivateKey: '',
      selectedWallet: {},
      moreList: [],
      updateListJob: ''
    }
  },
  computed: {

  },
  created () {
    this.wallets = this.$route.query.wallets
    this.selectedPrivateKey = this.$route.query.selectedPrivateKey
    if (this.wallets.hasOwnProperty(this.selectedPrivateKey)) {
      this.selectedWallet = this.wallets[this.selectedPrivateKey]
    }
    this.getMiningList()
    updateListJob = setInterval(this.getMiningList, 5000)
  },
  mounted () {

  },
  destroyed () {
    if (updateListJob) {
      clearInterval(updateListJob)
    }
  },
  methods: {
    getMiningList () {
      this.$JsonRPCClient.getWalletTransactions(this.selectedWallet.walletAddress, (history) => {
        this.digIncome = "0"
        this.moreList = []
        let miningHistory = history.filter((hist) => {
          return hist.listAddress === 'Mined' && hist.listState === 'Successful'
        })
        miningHistory.forEach((element, index) => {
          this.digIncome = (Number(this.digIncome) + Number(element.listMoney)).toString() 
          this.moreList.push({
            id: index,
            age: element.listTime,
            reward: `${element.listMoney} SEC`,
            blocknumber: element.blockNumber,
            blockhash: element.blockHash
          })
        })
      })
    },

    //返回挖矿页面
    returnDig () {
      this.$router.push({ path: '/walletDig', query: {wallets: this.wallets, selectedPrivateKey: this.selectedPrivateKey} })
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
  .dig-more-body::-webkit-scrollbar { width: 2px; height: 2px;}
  .dig-more-body::-webkit-scrollbar-thumb { -webkit-box-shadow: inset 0 0 1px #00D6B2;background: #00D6B2;border-radius: 1px;}
  .dig-more-body::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 1px #EDF5F4;border-radius: 0; background: #EDF5F4;}
  
  .dig-more-body-header {position: fixed;top: 157px;left: 126px;right: 56px;background: #fff;
    padding: 36px 0 13px;}
  .dig-more-body p {height: 40px;text-align: center;line-height: 40px;color: #839299;font-weight: 400;
    position: fixed;bottom: 24px;left: 94px;right: 24px;background: #fff;border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;}
  .dig-body-padding-bottom {padding-bottom: 40px;}
</style>