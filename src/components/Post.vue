<template>
  <div class="post">
    <h3>{{title}} by: {{user}}</h3><span></span>
    <ul>
      <li>{{description}}</li>
    </ul>

    <h3>Comments</h3>
    <ul v-for="(comment, index) in comments" :key="index">
      <li>{{comment.user}}</li>
      <li>{{comment.text}}</li>
    </ul>

    <input type="text" name="comment" id="comment" v-model="comments">
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
      comments: ''
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
      this.comments = response.data.comments
      console.log(response.data)
    },
    async addComment () {
      console.log(this.$route.params.id)
      await PostsService.addComment({
        id: this.$route.params.id,
        comment: {
          user: this.user,
          text: this.comments
        }
      })
    }
  }
}
</script>
