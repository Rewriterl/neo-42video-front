import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { createRouteScroller } from '@/plugins/routeScroller.class'
import RouteList from './routes/index'
import store from '@/store/index'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/Error/ErrorPage.vue'),
    meta: {
      title: 'Χαλαρό - 404not found'
    }
  },
  {
    path: '/',
    component: () => import('@/views/Home/Home.vue'),
    meta: {
      title: 'Χαλαρό',
      dom: '#home'
    }
  },
  ...RouteList
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
const routeScroller = createRouteScroller()

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !(store.state as Any).user.flag) {
    // 登录权限验证
    next({ name: 'Home' })
  } else {
    next()
  }
})
router.afterEach((to, from) => {
  routeScroller.saveScrollTop(from).setScrollTop(to)
})

export default router
