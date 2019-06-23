<template>
  <main>
    <section class="dig-more-container">
      <!-- 头部 -->
      <section class="dig-more-header">
        <img src="../../assets/images/returnImg.png" @click="returnDig" title="return"/>
        <section class="dig-more-header-title">
          <section>
            <p>Wallet Name</p>
            <p>{{selectedWallet.walletName}}</p>
          </section>
          <section>
            <p>Wallet Account</p>
            <p>0x{{selectedWallet.walletAddress}}</p>
          </section>
        </section>
      </section>

      <!-- 内容 -->
      <section class="dig-more-body" :class="loadMore?'dig-body-padding-bottom':''">
          
          <section class="dig-body-title">
            <h3>Mining Record</h3>
            <section class="dig-body-title-list">
              <section>
                <span></span>
                <span>Number Of Mined：</span>
                <span>{{this.digNumber}}</span>
              </section>
              <section>
                <span></span>
                <span>Income of Mined：</span>
                <span>{{this.digIncome}} TEC</span>
              </section>
            </section>
          </section>

        <section class="dig-more-lists">
          <dig-list :moreList="moreList"/>
        </section>

        <p v-show="loadMore" class="load-more" @click="onClickLoadMore">Click to load more</p>
      </section>
    </section>
  </main>
</template>

<script>
import digList from './components/wallet-dig-more-list'
let updateListJob
export default {
  name: '',
  components: {
    digList
  },
  props: {},
  data () {
    return {
      loadMore: false, //加载更多按钮
      digNumber: 0,
      digIncome: '0',
      wallets: {},
      selectedPrivateKey: '',
      selectedWallet: {},
      moreList: [],
      moreListSkip: 7,
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
    //console.log(this.wallets.length)
    this._startUpdateHisotryJob()
  },
  mounted () {

  },
  destroyed () {
    if (updateListJob) {
      clearInterval(updateListJob)
    }
  },
  methods: {
    onClickLoadMore () {
      this.moreListSkip = this.moreListSkip + 10
      if (updateListJob) {
        clearInterval(updateListJob)
      }
      this._startUpdateHisotryJob()
    },

    getMiningList () {
      this.$JsonRPCClient.getWalletTransactionsSEN(this.selectedWallet.walletAddress, (history) => {
        this.digIncome = "0"
        this.digNumber = 0
        this.moreList = []
        let miningHistory = history.filter((hist) => {
          return hist.listAddress === 'Mined' && hist.listState === 'Mining' && hist.listInputData.indexOf('Mining reward') > -1
        })
        let skip = 0
        if (this.moreListSkip >= miningHistory.length) {
          skip = miningHistory.length
          this.loadMore = false
        } else {
          skip = this.moreListSkip
        }
        miningHistory.forEach((element, index) => {
          let moneyValue = element.listMoney.length > 10 && element.listMoney.indexOf('.') > 0 ? Number(element.listMoney).toFixed(8) : element.listMoney
          this.digIncome = (Number(this.digIncome) + Number(moneyValue)).toString()
          this.digNumber = this.digNumber + 1
          console.log(index)
          console.log(skip)
          if (index > skip - 1) {
            this.loadMore = true
            return
          }
          this.moreList.push({
            id: index,
            age: element.listTime,
            reward: `${moneyValue} DEFI`,
            blocknumber: element.blockNumber,
            blockhash: element.blockHash
          })
        })
      })
    },

    _startUpdateHisotryJob () {
      if (updateListJob) {
        clearInterval(updateListJob)
      }
      this.getMiningList()
      updateListJob = setInterval(this.getMiningList, 5000)
    },

    //返回挖矿页面
    returnDig () {
      this.$router.push({ path: '/walletDig', query: {wallets: this.wallets, selectedPrivateKey: this.selectedPrivateKey} })
    }
  },
}
</script>

<style scoped>
  main {padding: 24px;background:linear-gradient(162deg,rgba(51,58,108,1) 0%,rgba(34,39,78,1) 100%);
    height: calc(100vh - 48px);display: flex;align-content: stretch;display:-webkit-flex;}
  .dig-more-container {display: flex;flex-direction: column;border-radius:4px;flex: 1;
    background:linear-gradient(138deg,rgba(59,70,119,1) 0%,rgba(38,43,87,1) 100%);}

  .dig-more-header {height: 102px;border-bottom:1px solid rgba(0,0,0,.2);
    border-top-left-radius: 4px;border-top-right-radius: 4px;}
  .dig-more-header img {width: 24px;height: 24px;margin: 7px 0 14px 12px;}
  .dig-more-header .dig-more-header-title {display: flex;padding-left: 32px;color: #9097C7;}
  .dig-more-header .dig-more-header-title section p:last-child {color: #F2F5FF;font-weight: 500;
    font-size: 14px;padding-top: 6px;font-family: Lato-Medium;}
  .dig-more-header .dig-more-header-title section:last-child {padding-left: 203px;}


  .dig-more-body {padding-top: 36px;border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;flex: 1;}

  .dig-more-lists {flex: 1;}
  
  
  .dig-more-body-header {position: fixed;top: 157px;left: 126px;right: 56px;background: #fff;
    padding: 36px 0 13px;}
  .dig-more-body p {height: 40px;text-align: center;line-height: 40px;color: #9097C7;font-weight: 400;
    position: fixed;bottom: 24px;left: 94px;right: 24px;border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;}
  .dig-body-padding-bottom {padding-bottom: 0px;}

  .load-more:hover {cursor: pointer;}


  .dig-body-title {margin: 0 32px;padding-bottom: 13px;} 
  .dig-body-title,.dig-body-title .dig-body-title-list {display: flex;justify-content: space-between;align-items: center;}
  .dig-body-title h3 {margin: 0;font-size: 14px;color: #F2F5FF;font-family: Montserrat-SemiBold;font-weight: 600;}
  .dig-body-title .dig-body-title-list section {color: #9097C7;font-family: Montserrat-Light;}
  .dig-body-title .dig-body-title-list section span:first-child {display: inline-block;width:6px;height:6px;
    background:rgba(245,166,35,1);border-radius:50%;margin-right: 10px;}
  .dig-body-title .dig-body-title-list section span:last-child {color: #F2F5FF;font-family: Lato-Medium;}
  .dig-body-title .dig-body-title-list section:nth-of-type(even) span:first-child {background:#388ED9;margin-left: 40px;}
</style>