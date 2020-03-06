var mongoose = require('mongoose')
const Schema = mongoose.Schema

const Image = new Schema({
  filename: {
    type: String,
    required: true
  },
  originalname: {
    type: String,
    required: true
  },
  post: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
}, {timestamps: true})

module.exports = mongoose.model('Image', Image)
