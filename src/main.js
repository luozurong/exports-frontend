import Vue from 'vue'

import 'babel-polyfill'
import 'url-search-params-polyfill'  //解决ie兼容

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/cn' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

// 以 plugin 形式使用时，请在入口处引入：
import { DatetimePlugin } from 'vux'
import { AlertPlugin } from 'vux'
import { LoadingPlugin } from 'vux'
import { Group, XInput,Datetime } from 'vux'

Vue.use(AlertPlugin)
Vue.use(DatetimePlugin)
Vue.use(LoadingPlugin)
Vue.component('group', Group)
Vue.component('x-input', XInput) //输入框
Vue.component('datetime', Datetime) //日期组件

const FastClick = require('fastclick')
FastClick.attach(document.body)

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
