var mongoose = require('mongoose')
var Schema = mongoose.Schema

var PostSchema = new Schema({
  user: String,
  title: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  }
})

var Post = mongoose.model('Post', PostSchema)
module.exports = Post
