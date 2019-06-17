<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import Vue from 'vue'
  import walletsHandler from './lib/WalletsHandler'
  import JsonRPCClient from './lib/jayson-rpc-vue'

  Vue.use(JsonRPCClient)
  
  export default {
    name: 'wallet',
    components: {
    }
  }
</script>

