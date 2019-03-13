<template>
  <main>
    <section class="dig-container">
      <!-- 挖矿头部 -->
      <section class="dig-header">
        <section class="dig-header-check">
          <h3>Mining</h3>
          <p>Wallet Account</p>
          <ul>
            <li @click="downCheckWallet">
              <span>wallet name</span>
              <img src="../../assets/images/moreDown.png" alt="">
            </li>
            <li v-show="checkWallet">
              <ul>
                <li @click="checkDigWallet">111111</li>
              </ul>
            </li>
          </ul>
          <wallet-button type="button" 
              :text="digButton"
              :class="[miningIn?'miningIn':'', checkedWallet?'passCorrect':'']"
              @click.native="beginDig"/>
        </section>
        <section class="dig-header-list">
          ss
        </section>
      </section>
      <wallet-margin/>
      <!-- 挖矿内容 -->
      <section class="dig-body">
         <!-- 挖矿内容-头部 -->
        <dig-title :digTitleShow="true" :number="digNumber" :income="digIncome"/>
        <!-- 挖矿内容-列表 -->
        <section>
          <dig-list :digLists="moreList"/>
        </section>
      </section>
      <wallet-margin/>
      <!-- 挖矿底部 -->
      <section class="dig-footer">
        <dig-footer/>
      </section>
    </section>
    <!-- 遮罩层 -->
    <section class="mask" v-show="maskShow">
      <section class="mask-container dig-mask">
        <img
          src="../../assets/images/closeMask.png"
          alt=""
          class="closeImg"
          title="close"
          @click="maskShow = false"
        />
        <section class="dig-mask-body">
          <p>{{maskText}}</p>
          <button type="button"  @click="maskShow = false">Confirm</button>
        </section>
      </section>
    </section>
  </main>
</template>

<script>
import digFooter from './components/wallet-dig-footer'
import digTitle from './components/wallet-dig-title'
import walletButton from '../../components/wallet-button'
import digList from './components/wallet-dig-list'
import walletMargin from '../../components/wallet-margin'
export default {
  name: 'walletDig',
  components: {
    digFooter,
    walletButton,
    digTitle,
    digList,
    walletMargin
  },
  props: {},
  data () {
    return {
      digButton: "Start Mining",
      digNumber: '1000',
      digIncome: '100',
      checkWallet: false,
      checkedWallet: false,
      miningIn: false, //挖矿中改变按钮样式
      moreList: [
        {
          id: '01',
          age: '3 days 4 hours 15 secs ago',
          reward: '+2.00 SEC',
          blicks: '155565',
          block: '0x75f04e06b80b4b249a878000714e038fcc746ac54f'
        },
        {
          id: '02',
          age: '3 days 4 hours 15 secs ago',
          reward: '+2.00 SEC',
          blicks: '155565',
          block: '0x75f04e06b80b4b249a878000714e038fcc746ac54f'
        },
        {
          id: '03',
          age: '3 days 4 hours 15 secs ago',
          reward: '+2.00 SEC',
          blicks: '155565',
          block: '0x75f04e06b80b4b249a878000714e038fcc746ac54f'
        },
        {
          id: '04',
          age: '3 days 4 hours 15 secs ago',
          reward: '+2.00 SEC',
          blicks: '155565',
          block: '0x75f04e06b80b4b249a878000714e038fcc746ac54f'
        },
        {
          id: '05',
          age: '3 days 4 hours 15 secs ago',
          reward: '+2.00 SEC',
          blicks: '155565',
          block: '0x75f04e06b80b4b249a878000714e038fcc746ac54f'
        },
        {
          id: '06',
          age: '3 days 4 hours 15 secs ago',
          reward: '+2.00 SEC',
          blicks: '155565',
          block: '0x75f04e06b80b4b249a878000714e038fcc746ac54f'
        },
        {
          id: '06',
          age: '3 days 4 hours 15 secs ago',
          reward: '+2.00 SEC',
          blicks: '155565',
          block: '0x75f04e06b80b4b249a878000714e038fcc746ac54f'
        }
      ],
      maskShow: false,
      maskText: ''
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
    //选择挖矿钱包
    downCheckWallet () {
      this.checkWallet = true
    },

    //选择钱包
    checkDigWallet () {
      this.checkWallet = false
      this.checkedWallet = true
    },
    
    //开启挖矿
    beginDig () {
      if (this.digButton == "Start Mining") {
        //开始挖矿
        this.digButton = "Stop Mining"
        this.maskText = "Mining will start soon, confirm using the wallet 3 binding?"
        this.maskShow = true
        this.miningIn = true
        this.checkedWallet = false
      } else {
        //停止挖矿
        this.digButton = "Start Mining"
        this.maskText = "Confirm to Stop Mining?"
        this.maskShow = true
        this.miningIn = false
        this.checkedWallet = false
      }
    }
  },
}
</script>

<style scoped>
  main {padding: 24px;background: #F4F5F5;height: calc(100vh - 78px);display: flex;
    align-content: stretch;display:-webkit-flex;}
  .dig-container {display: flex;flex-direction: column;box-shadow:0px 0px 3px rgba(0,0,0,0.16);
  border-radius:4px;flex: 1;background: #fff;}
  .dig-header {height: 140px;border-top-left-radius: 4px;
    border-top-right-radius: 4px;padding: 20px 22px 24px 32px;display: flex;align-items: center;
    justify-content: space-between;}
  .dig-header .dig-header-check {width: 308px;}
  .dig-header .dig-header-check button {width: 182px;height: 32px;margin-top: 14px;}
  .dig-header .dig-header-check h3 {margin: 0;font-size:18px;font-family: Montserrat-SemiBold;font-weight:600;
    color:rgba(37,47,51,1);}
  .dig-header .dig-header-check p {font-family: Montserrat-Light;color: #839299;margin-top: 22px;}
  .dig-header .dig-header-check ul {height: 33px;line-height: 33px;width: 182px;color:#252F33;
    border-bottom:1px solid rgba(229,229,229,1);font-size: 14px;}
  .dig-header .dig-header-check ul img {width: 16px;height: 16px;}
  .dig-header .dig-header-check ul li:first-child {display: flex;justify-content: space-between;
    align-items: center;}
  .dig-header .dig-header-check ul li {position: relative;}
  .dig-header .dig-header-check ul li ul {height: 158px;position: absolute;top: 0;left: 0;z-index: 8;
    overflow: auto;background: #fff;box-shadow:0px 0px 6px rgba(0,0,0,0.16);border-radius: 4px;}
  .dig-header .dig-header-check ul li ul li {height: 40px;padding-left:16px;}
  .dig-header .dig-header-check ul li ul li:first-child {border-top-left-radius: 4px;border-top-right-radius: 4px;}
  .dig-header .dig-header-check ul li ul li:last-child {border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;}
  .dig-header .dig-header-check ul li ul li:hover {cursor: pointer;background:rgba(237,242,241,1);}
  .dig-header .dig-header-list {flex: 1;height: 108px;background:rgba(247,247,247,1);border-radius: 4px;
    overflow: auto;color: #252F33;padding: 16px 14px;}

  .dig-body {padding: 22px 22px 0 32px;flex: 1;overflow: hidden;}
  
  .dig-footer {padding: 0 22px 0 32px;color: #839299;height: 45px;
    border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;}

  .miningIn {background:linear-gradient(90deg,rgba(238,28,57,1) 0%,rgba(217,25,73,1) 100%)!important;}
  .dig-mask {position: relative;font-size: 14px;font-weight: 400;color: #576066;}
  .closeImg {width: 16px;height: 16px;position: absolute;top: 12px;right: 20px;}
  .dig-mask-body {padding: 44px 20px 16px 24px;text-align: right;}
  .dig-mask-body p {text-align: left;margin-bottom: 58px;}
  .dig-mask-body button {color: #fff;width:97px;background:linear-gradient(90deg,rgba(41,216,147,1) 0%,rgba(12,197,183,1) 100%);
    height:32px;border: 0;border-radius: 4px;}
</style>