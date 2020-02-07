import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// 导入子组件
import Login from '../views/login/index.vue'
import PhoneLogin from '../views/phone-login/index.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/phone-login',
    name: 'PhoneLogin',
    component: PhoneLogin
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
