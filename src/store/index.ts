import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import token from './modules/token'

export default new Vuex.Store({
  modules: {
    token
  }
})
