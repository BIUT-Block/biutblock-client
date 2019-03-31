<template>
  <section>
    <ul class="clearfix">
      <li style="width: 24%">AGE</li>
      <li style="width: 12%">REWARD</li>
      <li style="width: 14%">BLOCKS</li>
      <li style="width: 40%">BLOCK HASH</li>
    </ul>
    <ul class="clearfix" v-for="(item, index) in digLists">
      <li style="width: 24%">{{ item.age }}</li>
      <li style="width: 12%">{{ item.reward }}</li>
      <li style="width: 14%">{{ item.blocknumber }}</li>
      <li style="width: 40%">{{ item.blockhash.substring(0, 20) }}......{{item.blockhash.substring(44, item.blockhash.length)}}</li>
    </ul>
    <!-- <h4 v-show="digListShow">No mining records yet</h4> -->
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
      digListShow: true
    }
  },
  computed: {

  },
  created() {
    if (this.digLists.length > 0) {
      this.digListShow = false
    }
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
  section ul {display: block;}
  section .dig-list {padding-top: 13px;}
  section ul li {float: left;height: 42px;color: #252F33;display: flex;align-items: center;
    border-bottom:1px solid rgba(229,229,229,1);}
  section ul:last-child li {border: 0;}
  section .dig-list li {font-family: Lato-Bold;color: #839299;
    border-bottom:2px solid rgba(229,229,229,1)!important;}
  
  h4 {height: 220px;line-height: 220px;margin: 0;font-size: 14px;color: #839299;
    text-align: center;font-weight: normal;}
</style>