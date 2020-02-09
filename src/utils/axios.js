import Vue from 'vue'
import store from '../store/index'
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8080/api/'
// Add a request interceptor
axios.interceptors.request.use(
  function(config) {
    const token = store.getters['token/getToken']
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error)
  }
)
Vue.prototype.$axios = axios
