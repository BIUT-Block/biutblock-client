<template>
  <section class="container">
    <ul class="dig-list">
      <li style="width: 24%;">{{ $t('homeDig.hdNavProfitListTxt1') }}</li>
      <li style="width: 18%;">{{ $t('homeDig.hdNavProfitListTxt2') }}</li>
      <li style="width: 18%;">{{ $t('homeDig.hdNavProfitListTxt3') }}</li>
      <li style="width: 40%;">{{ $t('homeDig.hdNavProfitListTxt4') }}</li>
    </ul>
    <ul v-for="(item, index) in digLists" v-if ="index < 4">
      <li style="width: 24%;">{{ item.age }}</li>
      <li style="width: 18%;color: #F5A623;">{{ item.reward }}</li>
      <li style="width: 18%;">{{ item.blocknumber }}</li>
      <li style="width: 40%;color: #388ED9;">{{ item.blockhash.replace(/(.{10}).+(.{12})/,'$1......$2') }}</li>
    </ul>
    <section class="dig-body">
     <h4 v-show="digListShow">{{ $t('homeDig.hdNavProfitListNull') }}</h4>
    </section>
  </section>
</template>

<script>
export default {
  name: '',
  components: {
    
  },
  props: {
    digLists: Array
  },
  data() {
    return {
      // digList: [
      //   {
      //     id: '0',
      //     age: '2019/01/24 11:01:25',
      //     reward: '+2.00 BIU',
      //     blocknumber: '10',
      //     blockhash: '0x20b07c1e93d7237650e35751604333517883cdf80b07c1e93d7237650e35751604333517883c'
      //   }
      // ]
    }
  },
  computed: {
    digListShow () {
      if (this.digLists.length > 0) {
        return false
      } else {
        return true
      }
    },

    // digLists () {
    //   return Array(10).fill(this.digList[0])
    // }
  },
  created() {
    
  },
  mounted() {

  },
  destroyed() { },
  methods: {

  },
}
</script>

<style scoped>
  .container {overflow: hidden;height: 100%;display: flex;flex-direction: column;}
  .container ul {display: flex;}
  .container .dig-list {padding-top: 26px;height: 32px;}
  .container ul li {height: 42px;color: #252F33;display: flex;align-items: center;box-sizing: border-box;font-family: Lato-Regular;
    border-bottom:1px solid rgba(229,229,229,1);}
  .container ul li:first-child {padding-left: 18px;}
  .container ul:last-child li {border: 0;}

  .container .dig-list li {font-family: Lato-Bold;color: #99A1A6;background:#f7fbfa;height: 32px;border: 0;}
  .en .container .dig-list li {font-family: Source-Regular;}
  
  .dig-body {flex: 1;align-items: center;justify-content: center;display: flex;}
  h4 {margin: 0;font-size: 14px;color: #839299;font-weight: normal;}
</style>