<template>
  <div id="app">
    <index v-if="this.$store.state.userName!==''"></index>
    <longin v-else></longin>
  </div>
</template>

<script>
  import index from './view/index'
  import longin from './view/longin'
export default {
  components: {
    index,
    longin
  },
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body{
  margin:0;
  padding:0;
}
</style>
