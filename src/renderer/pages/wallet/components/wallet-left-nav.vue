<template>
  <main>
    <ul>
      <li v-for="(item, index) in walletList"
          :class="navIdx === item.privateKey ? 'checked-nav' : ''"
          @click="tabWallet(item, index)">
        <span :class="[bgColorArr[index%4], navIdx == item.privateKey ? 'border-hidden' : '']"></span>
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
  props: {wallets: Object, selectedPrivateKey: String, createdId: String},
  data () {
    return {
      bgColorArr: ['bgColor1','bgColor2','bgColor3','bgColor4'],
      navIdx: 0,
      createButtonText: "Create and Import Wallets",
      imgUrl: imgUrl
    }
  },
  computed: {
    walletList: function () {
      let list = []
      let selectedWallet
      Object.keys(this.wallets).forEach( (privateKey) => {
      list.push({
        id: '01',
        name: this.wallets[privateKey].walletName,
        address: `0x${this.wallets[privateKey].walletAddress.substring(0, 6)}......${this.wallets[privateKey].walletAddress.substring(32, 41)}`,
        walletAddress: this.wallets[privateKey].walletAddress,
        privateKey: privateKey,
        publicKey: this.wallets[privateKey].publicKey,
        englishWords: this.wallets[privateKey].englishWords
        })
        if (privateKey === this.selectedPrivateKey) {
          selectedWallet = {
            id: '01',
            name: this.wallets[privateKey].walletName,
            address: `0x${this.wallets[privateKey].walletAddress.substring(0, 6)}......${this.wallets[privateKey].walletAddress.substring(32, 41)}`,
            walletAddress: this.wallets[privateKey].walletAddress,
            privateKey: privateKey,
            publicKey: this.wallets[privateKey].publicKey,
            englishWords: this.wallets[privateKey].englishWords
          }
        }
      })
      if (selectedWallet) {
        this.navIdx = selectedWallet.privateKey
      } else {
        this.navIdx = list[0].privateKey
      }
      this.$emit("walletSelectionChanged", selectedWallet || list[0])
      return list
    }
  },
  created () {   
    
  },
  mounted () {
    this.navIdx = this.selectedPrivateKey
    if (this.createdId === 'walletIndex') {
      this.$emit("walletSelectionChanged", {
        id: '01',
        name: this.wallets[this.selectedPrivateKey].walletName,
        address: `0x${this.wallets[this.selectedPrivateKey].walletAddress.substring(0, 6)}......${this.wallets[this.selectedPrivateKey].walletAddress.substring(32, 41)}`,
        walletAddress: this.wallets[this.selectedPrivateKey].walletAddress,
        privateKey: this.selectedPrivateKey,
        publicKey: this.wallets[this.selectedPrivateKey].publicKey,
        englishWords: this.wallets[this.selectedPrivateKey].englishWords
      })
    }  
  },
  destroyed () {},
  methods: {
    tabWallet (item, index) {
      this.navIdx = item.privateKey
      this.$emit("walletSelectionChanged", item)
    },

    createWallet () {
      this.$router.push({ name: 'walletCreate', query: { wallets: this.wallets, selectedPrivateKey: this.navIdx, createId: 1 }})
    }
  }
}
</script>

<style scoped>
  main {display: flex;flex-direction: column;align-items: center;position: relative;height: 100vh;}
  ul {margin-top: 24px;overflow: auto;height: calc(100vh - 128px);width: 100%;}
  ul::-webkit-scrollbar { width: 2px; height: 2px;}
  ul::-webkit-scrollbar-thumb { -webkit-box-shadow: inset 0 0 1px #00D6B2;background: #00D6B2;border-radius: 1px;}
  ul::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 1px #EDF5F4;border-radius: 0; background: #EDF5F4;}
  
  ul li {width:170px;height:64px;background:rgba(255,255,255,1);border-radius:4px;
    margin: 0 auto;margin-bottom: 8px;display: flex;align-items: center;}
  ul li span {display: inline-block;height: 64px;width: 3px;
    border-top-left-radius: 4px;border-bottom-left-radius: 4px;}
  ul li section {margin-left: 20px;}
  ul li section p:first-child {color: #576066;font-size: 14px;font-family: Lato-Bold;}
  ul li section p {color: #839299;}
  ul li:hover,.create-button:hover {cursor: pointer;}
  .checked-nav {background:linear-gradient(90deg,rgba(41,216,147,1) 0%,rgba(12,197,183,1) 100%);
    box-shadow:0px 0px 10px rgba(41,216,147,0.5);flex: 1;}
  ul .checked-nav section {margin-left: 23px;}
  ul .checked-nav section p,ul .checked-nav section p:first-child {color: #fff;}
  .border-hidden {display: none;} 
  .bgColor1 {background:linear-gradient(180deg,rgba(152,169,210,1) 0%,rgba(157,152,210,1) 100%)!important;}
  .bgColor2 {background:linear-gradient(360deg,rgba(245,166,35,1) 0%,rgba(245,228,35,1) 100%)!important;}
  .bgColor3 {background:linear-gradient(180deg,rgba(66,145,255,1) 0%,rgba(11,127,230,1) 100%)!important;}
  .bgColor4 {background:linear-gradient(360deg,rgba(41,216,147,1) 0%,rgba(12,197,183,1) 100%)!important;}
  .create-button {width: 170px;position: absolute;bottom: 24px;}
</style>