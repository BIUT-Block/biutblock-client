import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import 'normalize.css'
import './assets/css/public.css'
import './assets/common/font.css'


import { Slider,Progress } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import {currency} from './utils/currency'
Vue.filter("currency",currency)

Vue.use(Slider)
Vue.use(Progress)

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
Vue.prototype.getPointNum = function (num,n) {
  let str = String(num);
  let index = str.indexOf(".");
  let str1 = str.substring(0,index+n+1);
  str1 = Number(str1);
  return str1
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
  store,
  template: '<App/>'
})
