<template>
  <div class="index">
    <head-nav></head-nav>
    <nav-menu></nav-menu>
    <div class="rightContainer">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import HeadNav from '../components/HeadNav'
import NavMenu from '../components/NavMenu'
export default {
  name: 'index',
  components: {
    HeadNav,
    NavMenu
  }
}
</script>

<style scoped>
.index {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
.rightContainer{
  position: relative;
  top: 0;
  left: 180px;
  width: calc(100% - 180px);
  height: calc(100% - 71px);
  overflow: auto;
}
</style>