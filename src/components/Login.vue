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

import PostsService from '@/services/PostsService'
// import {AUTH_REQUEST} from '../store/actions/auth'

export default{
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    login: async function () {
      await PostsService.login({
        name: this.name,
        email: this.email,
        password: this.password
      })
      this.$router.push({ name: 'Posts' })
    }
  }
}
</script>
