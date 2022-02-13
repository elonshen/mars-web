import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Login from '../views/Login.vue'
import L404 from '../views/404.vue'
import Layout from "../views/Layout";

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
    name: 'Home',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'Home',
        component: Home,
        meta: {
          auth: false
        }
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

// 全局钩子函数
// to: Route: 即将要进入的目标 路由对象
// from: Route: 当前导航正要离开的路由
// next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
// next(): 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 confirmed （确认的）。
// next(false): 中断当前的导航。如果浏览器的 URL 改变了（可能是用户手动或者浏览器后退按钮），那么 URL 地址会重置到 from 路由对应的地址。
// next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。
// 确保要调用 next 方法，否则钩子就不会被 resolved。

router.beforeEach((to, from, next) => {
  // 判断是否需要登录权限
  if (to.matched.some(res => res.meta.auth)) {
    // 判断是否登录
    if (this.$cookies.isKey('isLogin')) {
      console.log('已登录');
      next()
    } else {
      console.log('未登录');
      next({
        name: 'Login',
      }) // 没登录则跳转到登录界面
    }
  } else {
    next()
  }
});

export default router
