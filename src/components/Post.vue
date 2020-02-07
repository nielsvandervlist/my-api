<template>
  <div class="post">
    <ul v-for="(post, index) in posts" :key="index">
      <li>{{post.title}}</li>
      <li>{{post.user}}</li>
      <li>{{post.discription}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return{

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
    }
  }
}
</script>
