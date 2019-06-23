<template>
  <section>
    <ul class="test">
      <li>NODE IP</li>
      <li>COUNTRY</li>
      <li>CITY</li>
      <li>NODE TIME</li>
    </ul>
    <section class="list-node">
      <h4 v-show="listContent">Please check for network failure</h4>
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
  .list-node::-webkit-scrollbar-thumb { -webkit-box-shadow: inset 0 0 1px #F66767;background: #F66767;border-radius: 1px;}
  .list-node::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 1px rgba(0,0,0,.1);border-radius: 0; background: rgba(0,0,0,.1);}
  
  .list-node h4 {height: calc(100vh - 350px);font-size: 16px;color: #9097C7;font-weight: normal;
    display: flex;align-items: center;justify-content: center;}
  
  section ul {height: 40px;border-bottom: 1px solid rgba(0,0,0,.2);color: #BDC4F7;
    display: flex;align-items: center;}
  section ul li{width: 25%;}
  .test {border-bottom: 2px solid rgba(0,0,0,.2);font-family: Lato-Bold;
    color: #9097C7;margin-right: 32px;}
</style>