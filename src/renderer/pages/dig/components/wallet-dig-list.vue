<template>
  <section class="container">
    <ul class="dig-list">
      <li style="width: 24%;">AGE</li>
      <li style="width: 18%;">REWARD</li>
      <li style="width: 18%;">BLOCKS</li>
      <li style="width: 40%;">BLOCK HASH</li>
    </ul>
    <ul v-for="(item, index) in digLists" v-if ="index < digLists.length">
      <li style="width: 24%;">{{ item.age }}</li>
      <li style="width: 18%;color: #EB9F34;">{{ item.reward }}</li>
      <li style="width: 18%;">{{ item.blocknumber }}</li>
      <li style="width: 40%;color: #FB8091;">{{ item.blockhash.substring(0, 20) }}......{{item.blockhash.substring(44, item.blockhash.length)}}</li>
    </ul>
    <section class="dig-body">
     <h4 v-show="digListShow">No mining records yet</h4>
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
      //     age: '0',
      //     reward: '0',
      //     blocknumber: '0',
      //     blockhash: '00'
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
  .container {height: 260px;overflow: hidden;box-sizing: border-box;}
  .container ul {display: flex;}
  .container .dig-list {padding-top: 16px;}
  .container ul li {height: 41px;color: #BDC4F7;display: flex;align-items: center;box-sizing: border-box;
    border-bottom:1px solid rgba(0,0,0,.15);}
  .container ul:last-child li {border: 0;}
  .container .dig-list li {font-family: Lato-Bold;color: #9097C7;box-sizing: border-box;
    border-bottom:2px solid  rgba(0,0,0,.15)!important;}
  
  .dig-body {flex: 1;align-items: center;justify-content: center;display: flex;height: 220px;}
  h4 {margin: 0;font-size: 14px;color: #BDC4F7;font-weight: normal;}
</style>