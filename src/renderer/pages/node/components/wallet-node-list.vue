<template>
  <section>
    <ul class="clearfix">
      <li>NODE IP</li>
      <li>COUNTRY</li>
      <li>CITY</li>
      <li>NODE TIME</li>
    </ul>
    <ul v-for="item in nodeList" class="clearfix">
      <li>{{item.nodeIp}}</li>
      <li>{{item.nodeCountry}}</li>
      <li>{{item.nodeCity}}</li>
      <li>{{item.nodeTime}}</li>
    </ul>
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
  section ul {width:100%;height: 40px;border-bottom: 1px solid rgba(229,229,229,1);color: #252F33;
    display: flex;align-items: center;}
  section ul li{width: 25%;float: left;}
  section ul:first-child {border-bottom: 2px solid rgba(229,229,229,1);font-family: Lato-Bold;
    color: #839299;}
</style>