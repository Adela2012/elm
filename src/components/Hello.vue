<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div class="b">
      <div class="ib" v-for="i in 10"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .b{
    border-radius:30px;
    border:1px solid #aaa;
    height:300px;
    display:flex;
    .ib{
      width:30px;
      height:30px;
      background: #eee;
      border:1px solid #aaa;

    }
  }
</style>
