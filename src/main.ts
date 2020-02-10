import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './utils/axios'

// vant全局组件注册
import { Toast } from 'vant'
Vue.use(Toast)

Vue.config.productionTip = false

// 屏幕适配
import 'amfe-flexible/index.js'

// 从本地获取token，然后赋值给store
const myToken = localStorage.getItem('my_token')
if (myToken) {
  store.commit('token/setToken',myToken)
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
