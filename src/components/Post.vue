<template>
  <div class="post">
    <ul>
      <li>{{title}}</li>
      <li>{{user}}</li>
      <li>{{description}}</li>
    </ul>
  </div>
</template>

<script>

import PostsService from '@/services/PostsService'

export default {
  name: 'Post',
  data () {
    return {
      title: '',
      description: '',
      user: ''
    }
  },
  computed: {

  },
  mounted () {
    this.getPost()
  },
  methods: {
    async getPost () {
      const response = await PostsService.getPost({
        id: this.$route.params.id
      })
      this.title = response.data.title
      this.description = response.data.description
      this.user = response.data.user
      console.log(response.data)
    }
  }
}
</script>
