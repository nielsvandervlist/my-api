var mongoose = require('mongoose')
var Schema = mongoose.Schema

var PostSchema = new Schema({
  title: String,
  description: String,
  user: {type: String, ref: 'User'},
  userid: {type: Schema.ObjectId, ref: 'User'}
})

var Post = mongoose.model('Post', PostSchema)
module.exports = Post
