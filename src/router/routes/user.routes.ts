const User = () => import('@/views/User/Index.vue')
const PlayHistory = () => import('@/views/User/Routes/PlayHistory/Index.vue')
const ComicFavlist = () => import('@/views/User/Routes/ComicFavlist/Index.vue')
import { RouteRecordRaw } from 'vue-router'

export default {
  path: '/user',
  name: 'User',
  component: User,
  redirect: '/user/play-history',
  meta: {
    title: 'Anime-小窝',
    elName: '#user .play-history'
  },
  children: [
    {
      path: 'play-history',
      name: 'PlayHistory',
      component: PlayHistory,
      meta: {
        // title: 'Anime-',
      }
    },
    {
      path: 'comic-favlist',
      name: 'ComicFavlist',
      component: ComicFavlist,
      meta: {
        // title: 'Anime-',
      }
    }
  ]
} as RouteRecordRaw
