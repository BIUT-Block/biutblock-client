<template>
  <section>
    <section class="list-header">
      <ul>
        <li style="width: 4%"> &nbsp; </li>
        <li style="width: 22%">AGE</li>
        <li style="width: 18%">REWARD</li>
        <li style="width: 18%">BLOCKS</li>
        <li style="width: 38%">BLOCK HASH</li>
      </ul>
    </section>
    <section class="more-list">
      <ul  v-for="(item, index) in moreList" v-if="index < moreList.length" :key="index">
          <li style="width: 4%">{{index + 1}}</li>
          <li style="width: 22%">{{item.age}}</li>
          <li style="width: 18%">{{item.reward}}</li>
          <li style="width: 18%">{{item.blocknumber}}</li>
          <li style="width: 38%">{{item.blockhash}}</li>
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
      
    }
  },
  computed: {
    
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
  section .more-list {overflow: auto;flex: 1;max-height: 345px;padding: 0 32px;}
  section  .more-list ul {overflow: auto}
  section  .list-header {padding: 0 32px;}
  section  .list-header li {font-family: Lato-Bold;color: #839299;border-bottom:2px solid rgba(229,229,229,1);}
  section  ul li {float: left;height: 47px;display: flex;align-items: center;color: #252F33;
    border-bottom:1px solid rgba(229,229,229,1);word-break: break-all;}

 .more-list::-webkit-scrollbar { width: 2px; height: 2px;}
 .more-list::-webkit-scrollbar-thumb { -webkit-box-shadow: inset 0 0 1px #00D6B2;background: #00D6B2;border-radius: 1px;}
 .more-list::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 1px #EDF5F4;border-radius: 0; background: #EDF5F4;}
</style>