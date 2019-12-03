<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import jwt_decode from 'jwt-decode'
export default {
  name: 'app',
  created () {
    // 解析token
    const decode = jwt_decode(localStorage.eleToken)
    // 将token存储到vuex
    this.$store.dispatch('setAuthenticated', !this.isEmpty(decode))
    this.$store.dispatch('setUser', decode)
  },
  methods: {
    isEmpty (value) {
      value === undefined ||
      value === null ||
      (typeof value === 'object' && Object.keys(value).length === 0) ||
      (typeof value === 'string' && value.trim().length === 0)
    }
  }
}
</script>

<style scoped>
html,
body,
#id {
  width: 100%;
  height: 100%;
}
</style>
