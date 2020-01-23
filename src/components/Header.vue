<template>
  <div class="navigation">
    <ul>
      <li>
        <router-link to="/hello"></router-link>
      </li>
      <li>
        <span class="logout">Logout</span>
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
  }
}
</script>
