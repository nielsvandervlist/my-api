<template>
 <div>
   <form class="login" @submit.prevent="login">
     <h1>Sign in</h1>
     <label>User name</label>
     <input required v-model="email" type="text" placeholder="Snoopy"/>
     <label>Password</label>
     <input required v-model="password" type="password" placeholder="Password"/>
     <hr/>
     <button type="submit">Login</button>
   </form>
 </div>
</template>

<script>

// import PostsService from '@/services/PostsService'
// import {AUTH_REQUEST} from '../store/actions/auth'

export default{
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    login: function () {
      // Set vars
      let email = this.email
      let password = this.password
      this.$store.dispatch('login', { email, password })
        .then(function (results) {
          this.$router.push({ name: 'Posts' })
          console.log(results)
        }, function (err) {
          console.log(err)
        })
      // Push router to posts
      // Post login to API
      // await PostsService.login({
      //   name: email,
      //   email: email,
      //   password: password
      //   // Results are fine
      // }).then(function (results) {
      //   console.log(results)
      // }, function (err) {
      //   // Error handeling here
      //   console.log(err)
      // })
    }
  }
}
</script>
