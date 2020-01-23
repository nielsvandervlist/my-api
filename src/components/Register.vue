<template>
  <div class="register">
      <h2>New user</h2>
      <label for="name">Username</label>
      <input type="text" name="name" id="name" v-model="name">
      <label for="email">Email</label>
      <input type="email" name="email" id="email" v-model="email">
      <label for="pass">Password</label>
      <input type="password" name="pass" id="pass" v-model="pass">
      <button @click="Authenticate()">Register</button>
  </div>
</template>

<script>

import PostsService from '@/services/PostsService'

export default {
  data () {
    return {
      name: '',
      email: '',
      pass: ''
    }
  },
  methods: {
    async Authenticate () {
      await PostsService.Auth({
        name: this.name,
        email: this.email,
        password: this.pass
      }).then(function (results) {
        console.log(results)
        this.$router.push({ name: 'Posts' })
      }, function (err) {
        console.log(err)
      })
    }
  }
}
</script>
