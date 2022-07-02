import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { getServerIp } from '@/stores/systemConfig.store'
import { ElNotification } from 'element-plus'
import {
  getRouteSCMInstance,
  createRouteSCM
} from '@/class/routeScrollCache.class'
import { WEB_NAME } from '@/common/static'

/**
 * 自动导入路由
 */
function loadRoutes(): RouteRecordRaw[] {
  const mods = import.meta.globEager('./routes/*.routes.ts')
  return Object.values(mods).map((item) => item.default)
}

const routes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/Error/404.vue'),
    meta: {
      title: WEB_NAME + '-404not found'
    }
  },
  {
    path: '/',
    component: () => import('@/views/Home/Index.vue'),
    meta: {
      title: WEB_NAME,
      dom: '#home'
    }
  },
  ...loadRoutes()
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

const jwt = localStorage.getItem('jwt')

const logined = jwt !== null && jwt !== '' && jwt.length > 7
createRouteSCM()
router.beforeEach((to, from, next) => {
  getRouteSCMInstance().addCache(from.path, from.meta)

  if ((to.name === 'PlayHistory' || to.name === 'ComicFavlist') && !logined) {
    console.log('未登录')
    ElNotification({
      type: 'error',
      title: '通知',
      message: '访问此页面需要先登录'
    })
    next({ name: 'Login' })
  }
  next()
})
router.afterEach((to) => {
  getRouteSCMInstance().setScroll(to.path)
  document.title = String(to.meta.title) || WEB_NAME
})

export default router
