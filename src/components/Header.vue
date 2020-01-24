<template>
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
</template>

<style scoped>
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

<script>

export default {
  data () {
    return {
    }
  },
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
  }
}
</script>
