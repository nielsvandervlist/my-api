
<template>
  <div class="posts">
    <h1>Add Post to Profile {{ getUserName }}</h1>
      <div class="form">
        <div>
          <input type="text" name="title" placeholder="TITLE" v-model="title">
        </div>
        <div>
          <textarea rows="15" cols="15" placeholder="DESCRIPTION" v-model="description"></textarea>
        </div>
        <div>
          <input type="file" name="file" id="file">
        </div>
        <div>
          <button class="app_post_btn" @click="addPost">Add</button>
        </div>
      </div>
  </div>
</template>

<script>
import PostsService from '@/services/PostsService'
export default {
  name: 'NewPost',
  data () {
    return {
      title: '',
      description: '',
      username: '',
      file: ''
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    getUserName () {
      return this.$store.state.user.name
    }
  },
  methods: {
    async addPost () {
      const files = document.getElementById('file').files
      const formData = new FormData()
      formData.append('file', files[0])
      formData.append('postTitle', this.title)
      await Promise.all([PostsService.addFile(formData), PostsService.addPost({
        userid: this.user._id,
        user: this.user.name,
        title: this.title,
        description: this.description
      })], this.$router.push({ name: 'Posts' }))
    }
  }
}
</script>

<style type="text/css">
.form input, .form textarea {
  width: 500px;
  padding: 10px;
  border: 1px solid #e0dede;
  outline: none;
  font-size: 12px;
}
.form div {
  margin: 20px;
}
.app_post_btn {
  background: #4d7ef7;
  color: #fff;
  padding: 10px 80px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
  width: 520px;
  border: none;
  cursor: pointer;
}
</style>
