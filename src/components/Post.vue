<template>
  <div class="post">
    <ul>
      <li>{{title}}</li>
      <li>{{user}}</li>
      <li>{{description}}</li>
    </ul>

    <div class="comment-text">{{comment}}</div>

    <input type="text" name="comment" id="comment" v-model="comment">
    <button class="btn" @click="addComment">Add Comment</button>
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
      user: '',
      comment: ''
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
      this.comment = response.data.comment
      console.log(response.data)
    },
    async addComment () {
      console.log(this.$route.params.id)
      await PostsService.addComment({
        id: this.$route.params.id,
        comment: {
          user: this.user,
          text: this.comment
        }
      })
    }
  }
}
</script>
