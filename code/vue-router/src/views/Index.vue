<template>
  <div class="home">
    <div id="nav">
      <router-link to="/Details?id=1">Detail</router-link>
      <router-link to="/login">Login</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  methods: {
    replace () {
      this.$router.replace('/login')
    },
    goDetail () {
      this.$router.push({ name: 'Detail', params: { id: 1 } })
    }
  }
}
</script>
