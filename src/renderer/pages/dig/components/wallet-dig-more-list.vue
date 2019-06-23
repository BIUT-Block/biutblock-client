<template>
  <section>
    <section class="list-header">
      <ul>
        <li style="width: 6%;"> &nbsp; </li>
        <li style="width: 24%;">AGE</li>
        <li style="width: 17%;">REWARD</li>
        <li style="width: 17%;">BLOCKS</li>
        <li style="width: 36%;">BLOCK HASH</li>
      </ul>
    </section>
    <section class="more-list">
      <ul v-for="(item, index) in moreList" v-if="index < moreList.length" :key="index">
      <!-- <ul v-for="(item, index) in moreLists" :key="index"> -->
          <li style="width: 6%;">{{index + 1}}</li>
          <li style="width: 24%;">{{item.age}}</li>
          <li style="width: 17%;">{{item.reward}}</li>
          <li style="width: 17%;">{{item.blocknumber}}</li>
          <li style="width: 36%;">{{item.blockhash}}</li>
      </ul>
    </section>
    
  </section>
</template>

<script>
export default {
  name: '',
  components: {

  },
  props: {
    moreList: Array
  },
  data() {
    return {
      // moreList: [
      //   {
      //     id: '0',
      //     age: '0',
      //     reward: '0',
      //     blocknumber: '0',
      //     blockhash: '00'
      //   }
      // ]
    }
  },
  computed: {
    // moreLists () {
    //   return Array(10).fill(this.moreList[0])
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
  section .more-list {overflow: auto;flex: 1;height: 302px;padding: 0 32px;}
  section .more-list ul {overflow: auto}
  section .list-header {padding: 0 32px;}
  section .list-header li {font-family: Lato-Bold;color: #9097C7;border-bottom:2px solid rgba(0,0,0,.2);}
  section ul li {float: left;height: 42px;display: flex;align-items: center;color: #BDC4F7;
    border-bottom:1px solid rgba(0,0,0,.3);word-break: break-all;}

 .more-list::-webkit-scrollbar { width: 2px; height: 2px;}
 .more-list::-webkit-scrollbar-thumb { -webkit-box-shadow: inset 0 0 1px #F66767;background: #F66767;border-radius: 1px;}
 .more-list::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 1px rgba(0,0,0,.1);border-radius: 0; background: rgba(0,0,0,.1);}
</style>