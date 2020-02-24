<template>
  <div class="post">
    <h3>{{title}} by: {{user}}</h3><span></span>
    <ul>
      <li>{{description}}</li>
    </ul>

    <h3>Comments</h3>
    <ul v-for="(comment, index) in comments" :key="index">
      <li><b>{{comment.user}}</b> : {{comment.text}}</li>
      <a href="#" @click="removeComment(comment._id)">Delete</a>
    </ul>

    <ul v-for="(comment, index) in newcomment" :key="index">
      <li>{{comment}}</li>
    </ul>

    <input type="text" name="comment" id="comment" v-model="addcomment">
    <button class="btn" @click="postComment">Add Comment</button>
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
      comments: '',
      addcomment: '',
      comment: '',
      newcomment: []
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
    },
    async postComment () {
      this.newcomment.push(this.addcomment)

      await PostsService.addComment({
        id: this.$route.params.id,
        comment: {
          user: this.user,
          text: this.addcomment
        }
      })
    },
    async removeComment (getID) {
      await PostsService.deleteComment({
        comment: {
          postID: this.$route.params.id,
          commentID: getID
        }
      })
    }
  }
}
</script>
