<template>
  <section>
    <ul class="dig-list">
      <li style="width: 24%">AGE</li>
      <li style="width: 18%">REWARD</li>
      <li style="width: 18%">BLOCKS</li>
      <li style="width: 40%">BLOCK HASH</li>
    </ul>
    <ul v-for="(item, index) in digLists">
      <li style="width: 24%">{{ item.age }}</li>
      <li style="width: 12%">{{ item.reward }}</li>
      <li style="width: 14%">{{ item.blocknumber }}</li>
      <li style="width: 40%">{{ item.blockhash.substring(0, 20) }}......{{item.blockhash.substring(44, item.blockhash.length)}}</li>
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
    }
  },
  computed: {
    digListShow () {
      if (this.digLists.length > 0) {
        return false
      } else {
        return true
      }
    }
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
  section {height: 267px;}
  section ul {display: flex;}
  section .dig-list {padding-top: 13px;}
  section ul li {height: 42px;color: #252F33;display: flex;align-items: center;
    border-bottom:1px solid rgba(229,229,229,1);}
  section ul:last-child li {border: 0;}
  section .dig-list li {font-family: Lato-Bold;color: #839299;
    border-bottom:2px solid rgba(229,229,229,1)!important;}
  
  .dig-body {flex: 1;align-items: center;justify-content: center;display: flex;}
  h4 {margin: 0;font-size: 14px;color: #839299;font-weight: normal;}
</style>