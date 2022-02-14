import Vue from 'vue'
import VueRouter from 'vue-router'
import About from '../views/About.vue'
import Login from '../views/Login.vue'
import L404 from '../views/404.vue'
import Layout from "../views/Layout";
import User from "@/views/User";

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/404',
    component: L404
  },
  {
    path: '/',
    component: Layout,
    redirect: '/user',
    children: [
      {
        path: '/user',
        name: 'User',
        component: User,
      },
      {
        path: '/about',
        name: 'About',
        component: About
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
