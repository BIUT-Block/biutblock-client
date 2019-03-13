<template>
  <section>
    <section class="more-list">
      <ul class="clearfix">
        <li style="width: 4%"> &nbsp; </li>
        <li style="width: 20%">AGE</li>
        <li style="width: 19%">REWARD</li>
        <li style="width: 19%">BLICKS</li>
        <li style="width: 38%">BLOCK HASH</li>
      </ul>
      <ul class="clearfix" v-for="(item, index) in moreList">
        <li style="width: 4%">{{index + 1}}</li>
        <li style="width: 20%">{{item.age}}</li>
        <li style="width: 19%">{{item.reward}}</li>
        <li style="width: 19%">{{item.blicks}}</li>
        <li style="width: 38%">{{item.block}}</li>
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
    if (this.moreList.length > 7) {
      this.loadMoren = true
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
  section .more-list {overflow: auto;}
  section .more-list ul {display: block;}
  section .more-list ul:first-child li {font-family: Lato-Bold;color: #839299;border-bottom:2px solid rgba(229,229,229,1);}
  section .more-list ul li {float: left;height: 44px;display: flex;align-items: center;color: #252F33;
    border-bottom:1px solid rgba(229,229,229,1);}
  
  
</style>