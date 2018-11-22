const state = {
  loginToken: ''
}

const mutations = {
  getTokenFromLocalStorage (state) {
    let token = window.localStorage.getItem('loginToken')
    if (token === '' || token === null) {
      state.loginToken = ''
    } else {
      state.loginToken = token
    }
  }
}

const getters = {
  token: function (state) {
    return state
  }
}

export default {
  state,
  mutations,
  getters
}
