
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const bcrypt = require('bcrypt')
const config = require('./config')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const saltRounds = 10

let mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/posts')
mongoose.set('useFindAndModify', false)

let db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error'))
db.once('open', function (callback) {
  console.log('Connection Succeeded')
})

// Files
let Image = require('../models/image')
const multer = require('multer')
const path = require('path')
const UPLOAD_PATH = path.resolve(__dirname, '../uploads')

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png']
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error('incorrect file type')
    error.code = 'INCORRECT_FILETYPE'
    // error ocurred
    return cb(error, false)
  }
  // nothing went wrong
  cb(null, true)
}

const upload = multer({
  dest: UPLOAD_PATH,
  fileFilter,
  limits: {fileSize: 1000000, files: 5}
})

let Post = require('../models/post')
let User = require('../models/user')

let myImg

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

// upload image
app.post('/upload', upload.array('file', 5), (req, res, next) => {
  const images = req.files.map((file) => {
    return {
      filename: file.filename,
      originalname: file.originalname
    }
  })

  Image.insertMany(images, (err, result) => {
    if (err) return res.sendStatus(404)
    res.send({
      success: true,
      message: 'Image loaded succesfully'
    })
  })
})

// app.use((err, req, res, next) => {
//   if (err.code === 'INCORRECT_FILETYPE') {
//     res.status(422).json({ error: 'Only images are allowed' })
//   }
// })

// Get all images
app.get('/upload', (req, res) => {
  Image.find({}, '_id', function (error, images) {
    if (error) { console.error(error) }
    res.send({
      images: images
    })
  }).sort({_id: -1})
})

// get image with id
app.get('upload/:id', (req, res, next) => {
  Image.findOne({_id: req.params.id}, (err, image) => {
    if (err) return res.sendStatus(404)
    fs.createReadStream(path.resolve(UPLOAD_PATH, image.filename)).pipe(res)
  })
})

// Add new post
app.post('/posts', (req, res) => {
  db = req.db
  let user = req.body.user
  let title = req.body.title
  let description = req.body.description

  const image = new Image({
    _id: new mongoose.Types.ObjectId()
  })

  // eslint-disable-next-line camelcase
  let new_post = new Post({
    title: title,
    description: description,
    user: user,
    comment: 'No comments',
    image: image._id
  })

  new_post.save(function (error) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      message: 'Post saved successfully!'
    })
  })
})

// Post.findOne({ title: 'Casino Royale' }).populate('image').exec(function (err, Post) {
//   if (err) { console.log(err) }
//   console.log('The author is %s', Post.image._id)
//   // prints "The author is Ian Fleming"
// })

// Fetch all posts
app.get('/posts', (req, res) => {
  Post.find({}, 'title description user comments image', function (error, posts) {
    if (error) { console.error(error) }
    res.send({
      posts: posts
    })
  }).sort({_id: -1})
})

// Fetch single post
app.get('/post/:id', (req, res) => {
  db = req.db
  Post.findById(req.params.id, 'title description user comments', function (error, post) {
    if (error) { console.error(error) }
    res.send(post)
  })
})

// Get user posts
app.post('/posts/user', (req, res) => {
  Post.find({user: req.body.user.name}, 'title description user', function (error, posts) {
    if (error) { console.log(error) }
    res.send({
      posts: posts
    })
  })
})

// Delete comment
app.post('/posts/comments', (req, res) => {
  db = req.db
  Post.findOneAndUpdate({_id: req.body.comment.postID}, {$pull: {comments: {_id: req.body.comment.commentID}}}, false, (error, doc) => {
    if (error) { console.log(error) }
    res.send({
      succes: true
    })
  })
})

// Set comment
app.post('/posts/:id', (req, res) => {
  Post.findOneAndUpdate({_id: req.params.id}, {$push: {comments: req.body.comment}}, {new: true}, (error, doc) => {
    if (error) { console.log(error) }
    console.log(doc)
  })
})

// Update a post
app.put('/posts/:id', (req, res) => {
  db = req.db
  Post.findById(req.params.id, 'title description user', function (error, post) {
    if (error) { console.error(error) }

    post.title = req.body.title
    post.description = req.body.description
    post.save(function (error) {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })
})

// Delete a post
app.delete('/posts/:id', (req, res) => {
  db = req.db
  Post.remove({
    _id: req.params.id
  }, function (err, post) {
    if (err) {
      res.send(err)
    } else {
      res.send({
        success: true
      })
    }
  })
})

// Register user
app.post('/users/create', (req, res) => {
  db = req.db
  let name = req.body.name
  let email = req.body.email
  let password = req.body.password
  let newUser

  bcrypt.genSalt(saltRounds, function (_err, salt) {
    bcrypt.hash(password, salt, function (_err, hash) {
      if (_err) {
        console.log(_err)
      }
      // eslint-disable-next-line camelcase
      newUser = new User({
        name: name,
        email: email,
        password: hash
      })

      newUser.save(function (error) {
        if (error) {
          console.log(error)
        } else {
          res.send({
            success: true,
            message: 'User saved succesfully!'
          })
        }
      })
    })
  })
})

// Fetch all users
app.get('/users', (req, res) => {
  User.find({}, 'email password posts', function (error, users) {
    if (error) { console.error(error) }
    res.send({
      users: users
    })
  }).sort({_id: -1})
})

// login page passport.authenticate('local'),
app.post('/users/login', (req, res) => {
  User.findOne().where({
    email: req.body.email
  }).then(function (user) {
    if (!user) {
      console.log('user does not exist')
    } else {
      bcrypt.compare(req.body.password, user.password, function (_err, result) {
        if (result) {
          let token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 })
          res.send({
            success: true,
            user: user,
            token: token,
            message: 'Login succesfull'
          })
        } else {
          res.send({
            success: false,
            message: 'Login not succeeded'
          })
        }
      })
    }
  })
})

app.listen(process.env.PORT || 8081)
