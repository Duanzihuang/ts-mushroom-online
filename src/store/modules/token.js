export default {
  namespaced: true,
  state: {
      token: null
  },
  getters: {
    getToken(state) {
        return state.token
    }
  },
  mutations: {
      setToken(state,token) {
          state.token = token
      }
  }
}
