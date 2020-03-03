
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const bcrypt = require('bcrypt')
const config = require('./config')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const saltRounds = 10
// const multer = require('multer')

let mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/posts')
mongoose.set('useFindAndModify', false)

let db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error'))
db.once('open', function (callback) {
  console.log('Connection Succeeded')
})

const Image = require('../models/image')
const multer = require('multer')
const path = require('path')
const UPLOAD_PATH = path.resolve(__dirname, '../uploads')
const upload = multer({
  dest: UPLOAD_PATH,
  limits: {fileSize: 1000000, files: 5}
})

let Post = require('../models/post')
let User = require('../models/user')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

// Add new post
app.post('/posts', (req, res) => {
  db = req.db
  let user = req.body.user
  let title = req.body.title
  let description = req.body.description

  // eslint-disable-next-line camelcase
  let new_post = new Post({
    title: title,
    description: description,
    user: user,
    comment: 'No comments'
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

// Fetch all posts
app.get('/posts', (req, res) => {
  console.log(req)
  Post.find({}, 'title description user comments', function (error, posts) {
    if (error) { console.error(error) }
    res.send({
      posts: posts
    })
  }).sort({_id: -1})
})

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
    res.json(result)
  })
})

// get image with id
app.get('/:id', (req, res, next) => {
  Image.findOne({_id: req.params.id}, (err, image) => {
    if (err) return res.sendStatus(404)
    fs.createReadStream(path.resolve(UPLOAD_PATH, image.filename)).pipe(res)
  })
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
    if (err)
      res.send(err)
    res.send({
      success: true
    })
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
