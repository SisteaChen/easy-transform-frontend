import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home')
  },
  {
    path: '/register',
    name: 'register',
    component:() => import('@/views/auth/Register'),
    meta: {title: 'Register'}
  },
  {
    path: '/login',
    name: 'login',
    component:() => import('@/views/auth/Login'),
    meta: {title: 'Login'}
  },
  {
    path: '/PageNotFound',
    name: 'PageNotFound',
    component:() => import('@/views/error/PageNotFound'),
    meta: {title: '404-NotFound'}
  },

  {
    path: '/videoprocess',
    name: 'videoprocess',
    component:() => import('@/views/processing/Video'),
    meta: {title: 'Video'}
  },
  {
    path: '/imageprocess',
    name: 'imageprocess',
    component:() => import('@/views/processing/Image'),
    meta: {title: 'Image'}
  },
  {
    path: '/blogs',
    name: 'blogs',
    component:() => import('@/views/community/Blogs'),
    meta: {title: 'Blogs'}
  },
  {
    path: '/blogwrite',
    name: 'blogwrite',
    component:() => import('@/views/community/BlogWrite'),
    meta: {title: 'BlogsWrite'}
  },
  {
    path: '/blogdetails/:id',
    name: 'blogdetails',
    component:() => import('@/views/community/BlogDetails'),
    meta: {title: 'BlogsDetails'}
  },
  {
    path: '/homepage',
    name: 'homepage',
    component:() => import('@/views/auth/PersonalHomePage'),
    meta: {title: '/PersonalHomePage'}
  },
  {
    path: '/message',
    name: 'message',
    component:() => import('@/views/community/Message'),
    meta: {title: '/Message'}
  },
  {
    path: '/Processing',
    name: 'Processing',
    component:() => import('@/views/error/Fake'),
    meta: {title: '/Processing'}
  },
  {
    path: '*',
    redirect : '/PageNotFound',
  },


]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
