import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import store from '@/store'
import Hello from '@/components/Hello'
import Post from '@/components/Post'
import Posts from '@/components/Posts'
import MyPosts from '@/components/MyPosts'
import NewPost from '@/components/NewPost'
import EditPost from '@/components/EditPost'
import Secure from '@/components/Secure.vue'
import Register from '@/components/Register'

Vue.use(Router)

const $router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/secure',
      name: 'secure',
      component: Secure,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/posts',
      name: 'Posts',
      component: Posts,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/myposts',
      name: 'MyPosts',
      component: MyPosts,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/posts/new',
      name: 'NewPost',
      component: NewPost,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/posts/:id',
      name: 'EditPost',
      component: EditPost,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/posts/:id',
      name: 'Post',
      component: Post,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

$router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/login')
  } else {
    next()
  }
})

export default $router
