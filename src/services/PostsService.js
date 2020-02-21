import Api from '@/services/Api'

export default {
  fetchPosts () {
    return Api().get('posts')
  },

  addPost (params) {
    return Api().post('posts', params)
  },

  updatePost (params) {
    return Api().put('posts/' + params.id, params)
  },

  addComment (params) {
    return Api().post('posts/' + params.id, params)
  },

  getPost (params) {
    return Api().get('post/' + params.id)
  },

  getMyPost (params) {
    return Api().post('posts/user', params)
  },

  deletePost (id) {
    return Api().delete('posts/' + id)
  },

  deleteComment (params) {
    return Api().post('posts/' + params.id, params)
  },

  Auth (params) {
    return Api().post('users/create', params)
  },

  login (params) {
    return Api().post('users/login', params)
  }
}
