export default {
  namespaced: true,
  state: {
    token: null
  },
  getters: {
    getToken(state: any) {
      return state.token
    }
  },
  mutations: {
    setToken(state: any, token: string) {
      state.token = token
    }
  }
}
