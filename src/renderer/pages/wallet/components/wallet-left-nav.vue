<template>
  <main>
    <ul>
      <li v-for="(item, index) in walletList"
          :class="navIdx == index ? 'checked-nav' : ''"
          @click="tabWallet(index)">
        <span :class="[bgColorArr[index%4], navIdx == index ? 'border-hidden' : '']"></span>
        <section>
          <p>{{item.name}}</p>  
          <p>{{item.address}}</p>  
        </section>
      </li>
    </ul>
    <wallet-button :text="createButtonText" :imgUrl="imgUrl" class="create-button" @click.native="createWallet"/>
  </main>
  
</template>

<script>
import walletButtonImg from '../../../components/wallet-button-img'
import imgUrl from '../../../assets/images/add.png'
export default {
  name: '',
  components: {
    walletButton: walletButtonImg
  },
  props: {},
  data () {
    return {
      bgColorArr: ['bgColor1','bgColor2','bgColor3','bgColor4'],
      navIdx: 0,
      createButtonText: "Create and Import Wallets",
      imgUrl: imgUrl,
      walletList: [
        {
          id: '01',
          name: 'wallet 01',
          address: '0x75f04e......b9449828'
        },
        {
          id: '01',
          name: 'wallet 01',
          address: '0x75f04e......b9449828'
        },
        {
          id: '01',
          name: 'wallet 01',
          address: '0x75f04e......b9449828'
        },
        {
          id: '01',
          name: 'wallet 01',
          address: '0x75f04e......b9449828'
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
    tabWallet (index) {
      this.navIdx = index
    },

    createWallet () {
      this.$router.push({ name: 'walletCreate', params: { createId: 0 }})
    }
  }
}
</script>

<style scoped>
  main {display: flex;flex-direction: column;align-items: center;position: relative;height: calc(100vh - 30px);}
  ul {padding-top: 24px;}
  ul li {width:170px;height:64px;background:rgba(255,255,255,1);opacity:1;border-radius:4px;
    margin: 0 auto;margin-bottom: 8px;display: flex;align-items: center;}
  ul li span {display: inline-block;height: 64px;width: 3px;
    border-top-left-radius: 4px;border-bottom-left-radius: 4px;margin-right: 20px;}
  ul li section p:first-child {color: #576066;font-size: 14px;font-family: Lato-Bold;}
  ul li section p {color: #839299;}
  ul li:hover {cursor: pointer;}
  .checked-nav {background:linear-gradient(90deg,rgba(41,216,147,1) 0%,rgba(12,197,183,1) 100%);
    box-shadow:0px 0px 10px rgba(41,216,147,0.5);padding-left: 23px;width:147px;}
  ul .checked-nav section p,ul .checked-nav section p:first-child {color: #fff;}
  .border-hidden {display: none;} 
  .bgColor1 {background:linear-gradient(180deg,rgba(152,169,210,1) 0%,rgba(157,152,210,1) 100%)!important;}
  .bgColor2 {background:linear-gradient(360deg,rgba(245,166,35,1) 0%,rgba(245,228,35,1) 100%)!important;}
  .bgColor3 {background:linear-gradient(180deg,rgba(66,145,255,1) 0%,rgba(11,127,230,1) 100%)!important;}
  .bgColor4 {background:linear-gradient(360deg,rgba(41,216,147,1) 0%,rgba(12,197,183,1) 100%)!important;}
  .create-button {width: 170px;position: absolute;bottom: 24px;}
</style>