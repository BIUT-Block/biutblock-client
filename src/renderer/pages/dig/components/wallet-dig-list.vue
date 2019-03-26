<template>
  <section>
    <ul class="clearfix">
      <li style="width: 26%">AGE</li>
      <li style="width: 18%">REWARD</li>
      <li style="width: 18%">BLOCKS</li>
      <li style="width: 38%">BLOCK HASH</li>
    </ul>
    <ul class="clearfix" v-for="(item, index) in digLists">
      <li style="width: 26%">{{ item.age }}</li>
      <li style="width: 18%">{{ item.reward }}</li>
      <li style="width: 18%">{{ item.blocknumber }}</li>
      <li style="width: 38%">{{ item.blockhash }}</li>
    </ul>
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

  },
  created() {
    console.log(this.digLists)
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
  section ul:first-child {padding-top: 13px;}
  section ul:first-child li {font-family: Lato-Bold;color: #839299;border-bottom:2px solid rgba(229,229,229,1);}
  section ul li {float: left;height: 42px;color: #252F33;display: flex;align-items: center;
    border-bottom:1px solid rgba(229,229,229,1);}
  section ul:last-child li {border: 0;}
</style>