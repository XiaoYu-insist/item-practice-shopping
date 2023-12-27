import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/views/layout/home'
import Category from '@/views/layout/category'
import Cart from '@/views/layout/cart'
import User from '@/views/layout/user'
import store from '@/store'

const Login = () => import('@/views/login')
const Layout = () => import('@/views/layout')
const Myorder = () => import('@/views/myorder')
const Pay = () => import('@/views/pay')
const Prodetail = () => import('@/views/prodetail')
const Search = () => import('@/views/search')
const SearchList = () => import('@/views/search/list')

Vue.use(VueRouter)
// 导入路由
const router = new VueRouter({
  routes: [
    { path: '/login', component: Login },
    {
      path: '/',
      component: Layout,
      redirect: '/home',
      children: [
        { path: '/home', component: Home },
        { path: '/category', component: Category },
        { path: '/cart', component: Cart },
        { path: '/user', component: User }
      ]
    },
    { path: '/myorder', component: Myorder },
    { path: '/pay', component: Pay },
    { path: '/prodetail', component: Prodetail },
    { path: '/search', component: Search },
    { path: '/searchlist', component: SearchList }
  ]
})
// 创建数组，把地址放进去
const authUrl = ['/pay', '/myorder']
// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 1. to  往哪里去， 到哪去的路由信息对象
  // 2. from 从哪里来， 从哪来的路由信息对象
  // 3. next() 是否放行
  //  如果next()调用，就是放行
  // next(路径) 拦截到某个路径页面

  // 如果不是数组里要验证的，直接放行
  if (!authUrl.includes(to.path)) {
    next()
    return
  }
  // 调用tokey 查看是否有tokey 没有则跳转登录页面
  const tokey = store.getters.tokey
  if (tokey) {
    next()
  } else {
    next('/login')
  }
})
// 导出
export default router
