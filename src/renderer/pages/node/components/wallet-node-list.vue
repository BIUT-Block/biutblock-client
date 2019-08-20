<template>
  <section>
    <ul class="list-node-head">
      <li>{{ $t('homeNode.hnListTxt1') }}</li>
      <li>{{ $t('homeNode.hnListTxt2') }}</li>
      <li>{{ $t('homeNode.hnListTxt3') }}</li>
      <li>{{ $t('homeNode.hnListTxt4') }}</li>
    </ul>
    <section class="list-node">
      <h4 v-show="listContent">{{ $t('homeNode.hnNetwork') }}</h4>
      <ul v-for="(item, index) in nodeList" :key="index" v-show="!listContent">
        <li>{{item.nodeIp}}</li>
        <li>{{item.nodeCountry}}</li>
        <li>{{item.nodeCity}}</li>
        <li>{{item.nodeTime}}</li>
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
    nodeList: Array
  },
  data () {
    return {
      listContent: false
    }
  },
  computed: {

  },
  created () {
    if (!navigator.onLine) {
      this.listContent = true
      return 
    }
  },
  mounted () {

  },
  destroyed () {},
  methods: {

  },
}
</script>

<style scoped>
  .list-node {overflow: auto;flex: 1;height: calc(100vh - 300px);padding-right: 32px;}
  .list-node::-webkit-scrollbar { width: 2px; height: 2px;}
  .list-node::-webkit-scrollbar-thumb { -webkit-box-shadow: inset 0 0 1px #00D6B2;background: #00D6B2;border-radius: 1px;}
  .list-node::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 1px #EDF5F4;border-radius: 0; background: #EDF5F4;}
  
  .list-node h4 {height: calc(100vh - 350px);font-size: 16px;color: #839299;font-weight: normal;
    display: flex;align-items: center;justify-content: center;}
  
  section ul {height: 40px;border-bottom: 1px solid rgba(229,229,229,1);color: #252F33;
    display: flex;align-items: center;}
  section ul li{width: 25%;}
  .list-node-head {border-bottom: 2px solid rgba(229,229,229,1);font-family: Lato-Bold;color: #839299;margin-right: 32px;}

  .en .list-node-head {font-family: Source-Medium;color: #99A1A6;font-weight: 500;}
</style>