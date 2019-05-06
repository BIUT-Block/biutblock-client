import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import 'normalize.css'
import './assets/css/public.css'
import './assets/common/font.css'

import { Slider } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Slider)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

const {ipcRenderer: ipc} = require('electron')

Vue.prototype.navMin = function () {
  ipc.send('min')
}
Vue.prototype.navMax = function () {
  ipc.send('max')
}
Vue.prototype.navClose = function () {
  ipc.send('close')
}

Vue.prototype.getPointNum = function (num,n) {
  let str = String(num);
  let index = str.indexOf(".");
  let str1 = str.substring(0,index+n+1);
  str1 = Number(str1);
  return str1
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  router,
  store,
  template: '<App/>'
})
