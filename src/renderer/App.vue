<template>
  <div id="app" :class="changeLanguage ? 'en' : ''">
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
    data () {
      return {
        changeLanguage: false
      }
    },
    components: {
    
    },
    watch: {
      
    },
  }
</script>

