
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const bcrypt = require('bcrypt')
const saltRounds = 10

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/posts')

var db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error'))
db.once('open', function (callback) {
  console.log('Connection Succeeded')
})

var Post = require('../models/post')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())
// app.use('/api/users', users)

// Add new post
app.post('/posts', (req, res) => {
  db = req.db
  var title = req.body.title
  var description = req.body.description
  // eslint-disable-next-line camelcase
  var new_post = new Post({
    title: title,
    description: description
    // user: User._id
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
  Post.find({}, 'title description', function (error, posts) {
    if (error) { console.error(error) }
    res.send({
      posts: posts
    })
  }).sort({_id: -1})
})

// Fetch single post
app.get('/post/:id', (req, res) => {
  db = req.db
  Post.findById(req.params.id, 'title description', function (error, post) {
    if (error) { console.error(error) }
    res.send(post)
  })
})

// Update a post
app.put('/posts/:id', (req, res) => {
  db = req.db
  Post.findById(req.params.id, 'title description', function (error, post) {
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

var User = require('../models/user')

// Register user
app.post('/users/create', (req, res) => {
  db = req.db
  var name = req.body.name
  var email = req.body.email
  var password = req.body.password
  var newUser

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
            message: 'Post saved successfully!'
          })
        }
      })
    })
  })
})

// Fetch all users
app.get('/users', (req, res) => {
  User.find({}, 'email password', function (error, users) {
    if (error) { console.error(error) }
    res.send({
      users: users
    })
  }).sort({_id: -1})
})

// login page
app.post('/users/login', (req, res) => {
  User.findOne().where({
    email: req.body.email
  }).then(function (user) {
    if (!user) {
      console.log('user does not exist')
    } else {
      bcrypt.compare(req.body.password, user.password, function (_err, result) {
        if (result) {
          res.send({
            success: true,
            message: 'Login successfully!'
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
