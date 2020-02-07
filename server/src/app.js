
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const bcrypt = require('bcrypt')
const config = require('./config')
const jwt = require('jsonwebtoken')
const saltRounds = 10

var mongoose = require('mongoose')
const passport = require('passport')
var Local = require('passport-local').Strategy

mongoose.connect('mongodb://localhost:27017/posts')

var db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error'))
db.once('open', function (callback) {
  console.log('Connection Succeeded')
})

var Post = require('../models/post')
var User = require('../models/user')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())
// app.use('/api/users', users)

// passport.use(new Local(
//   {usernameField: 'email', passwordField: 'password'},
//   function (email, password, done) {
//     User.findOne({ email: email }, function (err, user) {
//       if (err) { return done(err) }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect email.' })
//       }
//       if (!user.validPassword(password)) {
//         return done(null, false, { message: 'Incorrect password.' })
//       }
//       return done(null, user)
//     })
//   }
// ))

app.use(passport.initialize())
app.use(passport.session())

// Add new post
app.post('/posts', (req, res) => {
  db = req.db
  var userid = req.body.userid
  var user = req.body.user
  var title = req.body.title
  var description = req.body.description
  // eslint-disable-next-line camelcase
  var new_post = new Post({
    title: title,
    description: description,
    user: user,
    userid: userid
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
  Post.find({}, 'title description user', function (error, posts) {
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

// Get user posts
app.post('/posts/user', (req, res) => {
  Post.find({user: req.body.user.name}, 'title description user', function (error, posts) {
    if (error) { console.log(error) }
    res.send({
      posts: posts
    })
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
