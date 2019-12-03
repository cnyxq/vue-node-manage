import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const types = {
  SET_AUTHENTICATED: 'SET_AUTHENTICATED', // 授权
  SET_USER: 'SET_USER'
}

// 存储状态（变量）
const state = {
  isAuthenticated: false,
  user: {}
}

// 对数据获取之前的再次编译，可以理解为state的计算属性
const getters = {
  isAuthenticated: state => state.isAuthenticated,
  user: state => state.user
}

// 修改状态，并且是同步的
const mutations = {
  [types.SET_AUTHENTICATED] (state, isAuthenticated) {
    if (isAuthenticated) state.isAuthenticated = true
    else state.isAuthenticated = false
  },
  [types.SET_USER] (state, user) {
    if (user) state.user = user
    else state.user = {}
  }
}

// 异步操作
const actions = {
  setAuthenticated: ({ commit }, isAuthenticated) => {
    commit(types.SET_AUTHENTICATED, isAuthenticated)
  },
  setUser: ({ commit }, user) => {
    commit(types.SET_USER, user)
  },
  clearCurrentState: ({ commit }) => {
    commit(types.SET_AUTHENTICATED)
    commit(types.SET_USER)
  }
}


export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
