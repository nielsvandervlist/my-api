const mongoose = require('mongoose')
var Schema = mongoose.Schema

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  posts: [
    {type: mongoose.Schema.Types.ObjectId, ref: 'Post'}
  ]
})

UserSchema.methods.validPassword = function (pwd) {
  // EXAMPLE CODE!
  console.log(pwd)
  return (this.password === pwd)
}

var User = mongoose.model('User', UserSchema)
module.exports = User
