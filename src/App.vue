<template>
  <div id="app">
     <div class="navigation">
    <ul>
      <li>
        <router-link to="/hello"></router-link>
      </li>
      <li>
        <router-link to="/posts">Posts</router-link>
        <span v-if="isLoggedIn"> | <a @click="logout">Logout</a></span>
      </li>
      <li>
        <router-link to="/login">Login</router-link>
      </li>
      <li>
        <router-link to="/register">Register</router-link>
      </li>
    </ul>
  </div>
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App',
  computed: {
    isLoggedIn: function () { return this.$store.getters.isLoggedIn }
  },
  methods: {
    logout: function () {
      this.$store.dispatch('logout')
        .then(() => {
          this.$router.push('/login')
        })
    }
  },
  created: function () {
    this.$http.interceptors.response.use(undefined, function (err) {
      return new Promise(function (resolve, reject) {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch('logout')
        }
        throw err
      })
    })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.navigation{
  width: 100%;
  display: flex;
  justify-content: right;
}
.navigation ul{
  display: flex;
}
li{
  display: block;
  margin-right: 20px;
}
</style>
