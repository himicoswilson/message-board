import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignupView.vue')
    },
    {
      path: '/posts/:id',
      name: 'posts',
      component: () => import('../views/PostView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const localToken = localStorage.getItem('token')

  if (to.path !== '/login' && !localToken && to.path !== '/signup') {
    // 如果用户未登录且当前路由不是登录页面，则重定向到登录页面
    next('/login')
  } else if (to.path === '/login' && localToken) {
    next('/')
  } else if (to.path === '/signup' && localToken) {
    // 其他情况下直接跳转到下一个路由
    next('/')
  } else {
    next()
  }
})

export default router
