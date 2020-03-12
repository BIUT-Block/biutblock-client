/** 
 * QM is bitch.
*/

import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'

import 'normalize.css'
import './assets/css/public.css'
import './assets/common/font.css'

import i18n from './utils/index'

import cal from './utils/calculation'
Vue.prototype.cal = cal


import Element from 'element-ui'

Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
})

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

//小数点保留位数
Vue.prototype.getPointNum = function (num) {
  let str = String(num);
  return str.split('.').map((item, idx) => idx === 0 ? item.replace(/\B(?=(\d{3})+$)/g, ',') : item.substring(0, 8)).join('.').replace(/(?:(\.\d*[1-9])0+|\.0*)$/, '$1')
}
Vue.prototype.removeCommaNum = function (value) {
  return Number(value.split(',').join(''))
}
//获取input输入框判断长度
Vue.prototype.getBLen = function(str) {  
  if (str == null) return 0;  
  if (typeof str != "string"){  
      str += "";  
  }  
  return str.replace(/[^\x00-\xff]/g,"01").length;  
}

//input输入框不能输入空格跟中文
Vue.prototype.inputNull = function (ipt) {
  let ipts = ipt.replace(/[\u4E00-\u9FA5]/g, '').replace(/\s+/g, '')
  return ipts
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  router,
  i18n,
  store,
  template: '<App/>'
}).$mount('#app')
