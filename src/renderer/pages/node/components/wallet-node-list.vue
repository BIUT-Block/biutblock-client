<template>
  <section>
    <ul class="test">
      <li>NODE IP</li>
      <li>COUNTRY</li>
      <li>CITY</li>
      <li>NODE TIME</li>
    </ul>
    <section class="list-node">
      <ul v-for="item in nodeList">
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

    }
  },
  computed: {

  },
  created () {

  },
  mounted () {

  },
  destroyed () {},
  methods: {

  },
}
</script>

<style scoped>
  .list-node {overflow: auto;flex: 1;height: calc(100vh - 350px);padding-right: 32px;}
  .list-node::-webkit-scrollbar { width: 2px; height: 2px;}
  .list-node::-webkit-scrollbar-thumb { -webkit-box-shadow: inset 0 0 1px #00D6B2;background: #00D6B2;border-radius: 1px;}
  .list-node::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 1px #EDF5F4;border-radius: 0; background: #EDF5F4;}
  
  section ul {height: 40px;border-bottom: 1px solid rgba(229,229,229,1);color: #252F33;
    display: flex;align-items: center;}
  section ul li{width: 25%;}
  .test {border-bottom: 2px solid rgba(229,229,229,1);font-family: Lato-Bold;
    color: #839299;margin-right: 32px;}
</style>