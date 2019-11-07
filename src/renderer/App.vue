<template>
  <div id="app" class="home-app" :class="changeLanguage ? 'en' : ''">
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
        
      }
    },
    computed: {
      changeLanguage () {
        if (this.$i18n.locale == "zh") {
          return true
        }
      }
    },
    components: {
    
    },
    watch: {
      
    },
  }
</script>
<style scoped>
  .home-app {font-family: Lato-Regular;}
  .en {font-family: Source-Regular;}
</style>
