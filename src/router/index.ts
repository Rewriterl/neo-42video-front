import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import RouteList from './routes/index'

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'NotFound',
  //   component: () => import('@/views/Error/ErrorPage.vue'),
  //   meta: {
  //     title: 'Χαλαρό - 404not found'
  //   }
  // },
  {
    path: '/',
    component: () => import('@/views/Home/Index.vue'),
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

export default router
