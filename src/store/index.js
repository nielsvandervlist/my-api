import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      key: 'store',
      paths: []
    })
  ],
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    user: {}
  },
  mutations: {
    auth_request (state) {
      state.status = 'loading'
    },
    auth_success (state, {token, user}) {
      state.status = 'success'
      state.token = token
      state.user = user
    },
    auth_error (state) {
      state.status = 'error'
    },
    logout (state) {
      state.status = ''
      state.token = ''
    }
  },
  actions: {
    login ({commit}, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios({url: 'http://localhost:8081/users/login', data: user, method: 'POST'})
          .then(resp => {
            const token = resp.data.token
            const user = resp.data.user
            localStorage.setItem('token', token)
            axios.defaults.headers.common['Authorization'] = token
            commit('auth_success', {token, user})
            resolve(resp)
          })
          .catch(err => {
            commit('auth_error')
            localStorage.removeItem('token')
            reject(err)
          })
      })
    },
    register ({commit}, user) {
      return new Promise((resolve, reject) => {
        console.log(user)
        commit('auth_request')
        // eslint-disable-next-line standard/object-curly-even-spacing
        axios({url: 'http://localhost:8081/users/create', data: user, method: 'POST' })
          .then(resp => {
            // Set custom response here this is now redirecting to login
            resolve(resp)
          })
          .catch(err => {
            commit('auth_error', err)
            reject(err)
          })
      })
    },
    logout ({commit}) {
      return new Promise((resolve, reject) => {
        commit('logout')
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
        resolve()
      })
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status
  }
})
