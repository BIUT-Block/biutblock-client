import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import JWT from './lib/jwt-auth'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(JWT)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  router,
  store,
  template: '<App/>'
})
