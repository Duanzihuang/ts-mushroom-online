import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './utils/axios'

import { Toast } from 'vant'
Vue.use(Toast)

Vue.config.productionTip = false

// 从本地获取token，然后赋值给store
const my_token = localStorage.getItem('my_token')
if (my_token) {
  store.commit('token/setToken',my_token)
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
