import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loggedInUser: {
      name: 'John',
      id: 'Admin'
    }
  },
  mutations: {
    setUser (state, nameUser) {
      state.loggedInUser.name = nameUser
    }
  },
  actions: {
    // put asynchronous functions that can call one or more mutation functions
  }
})
