const User = () => import('@/views/User/Index.vue')
const PlayHistory = () => import('@/views/User/Routes/PlayHistory/Index.vue')
const ComicFavlist = () => import('@/views/User/Routes/ComicFavlist/Index.vue')
const Login = () => import('@/views/User/Routes/Login/Index.vue')
const Register = () => import('@/views/User/Routes/Register/Index.vue')
import { WEB_NAME } from '@/common/static'
import { RouteRecordRaw } from 'vue-router'

export default {
  path: '/user',
  name: 'User',
  component: User,
  redirect: '/user/play-history',
  meta: {
    title: WEB_NAME + '-小窝'
  },
  children: [
    {
      path: 'play-history',
      name: 'PlayHistory',
      component: PlayHistory,
      meta: {
        title: WEB_NAME + '-播放历史',
        elName: '#user .play-history'
      }
    },
    {
      path: 'comic-favlist',
      name: 'ComicFavlist',
      component: ComicFavlist,
      meta: {
        title: WEB_NAME + '-追番',
        elName: '#user .comic-favlist'
      }
    },
    {
      path: 'video-manage',
      name: 'VideoManage',
      component: () => import('@/views/User/Routes/VideoManage/Index.vue'),
      meta: {
        title: WEB_NAME + '-视频管理'
      }
    },
    {
      path: 'login',
      name: 'Login',
      component: Login,
      meta: {
        title: WEB_NAME + '-登录',
        elName: '#user .comic-favlist'
      }
    },
    {
      path: 'register',
      name: 'Register',
      component: Register,
      meta: {
        title: WEB_NAME + '-注册',
        elName: '#user .comic-favlist'
      }
    }
  ]
} as RouteRecordRaw
