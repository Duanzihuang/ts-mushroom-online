import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// 导入store
import store from '../store/index'

// 导入子组件
/*
import Login from '../views/login/index.vue'
import PhoneLogin from '../views/phone-login/index.vue'
import Layout from '../views/layout/index.vue'
import Home from '../views/home/index.vue'
import Course from '../views/course/index.vue'
import Search from '../views/search/index.vue'
import Study from '../views/study/index.vue'
import My from '../views/my/index.vue'
import CourseDetail from '../views/course-detail/index.vue'
import Play from '../views/play/index.vue'
import Pay from '../views/pay/index.vue'
*/
const Login = () => import(/* webpackChunkName: "login" */ '../views/login/index.vue')
const PhoneLogin = () => import(/* webpackChunkName: "login" */ '../views/phone-login/index.vue')
const Layout = () => import(/* webpackChunkName: "layout" */ '../views/layout/index.vue')
const Home = () => import(/* webpackChunkName: "layout" */ '../views/home/index.vue')
const Course = () => import(/* webpackChunkName: "layout" */ '../views/course/index.vue')
const Search = () => import(/* webpackChunkName: "layout" */ '../views/search/index.vue')
const Study = () => import(/* webpackChunkName: "layout" */ '../views/study/index.vue')
const My = () => import(/* webpackChunkName: "layout" */ '../views/my/index.vue')
const CourseDetail = () => import(/* webpackChunkName: "course-detail" */ '../views/course-detail/index.vue')
const Play = () => import(/* webpackChunkName: "play" */ '../views/play/index.vue')
const Pay = () => import(/* webpackChunkName: "pay" */ '../views/pay/index.vue')

const routes = [
  {
    path: '/',
    name: 'Login',
    meta: {
      needAuth: false
    },
    component: Login
  },
  {
    path: '/phone-login',
    name: 'PhoneLogin',
    meta: {
      needAuth: false
    },
    component: PhoneLogin
  },
  {
    path: '/layout',
    name: 'Layout',
    component: Layout,
    children: [
      {
        path: 'home',
        name: 'Home',
        component: Home
      },
      {
        path: 'course',
        name: 'Course',
        component: Course
      },
      {
        path: 'study',
        name: 'Study',
        component: Study
      },
      {
        path: 'my',
        name: 'My',
        component: My
      }
    ]
  },
  {
    path: '/search',
    name: 'Search',
    component: Search
  },
  {
    path: '/course-detail/:id',
    name: 'CourseDetail',
    component: CourseDetail
  },
  {
    path: '/play/:id',
    name: 'Play',
    component: Play
  },
  {
    path: '/pay',
    name: 'Pay',
    component: Pay
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 权限控制
router.beforeEach((to, from, next) => {
  // 不需要授权的页面，直接进入
  if (to.meta.needAuth === false) {
    next()
  } else {
    // 需要授权的页面
    if (store.getters['token/getToken']) {
      next()
    } else {
      next('/')
    }
  }
})

export default router
