const User = () => import('@/views/User/User.vue')
const UserFav = () => import('@/views/User/routes/UserFav.vue')
const UserProfile = () => import('@/views/User/routes/UserProfile.vue')
const UserHome = () => import('@/views/User/routes/UserHome.vue')
const UserNotify = () => import('@/views/User/routes/UserNotify.vue')

const Visitor = () => import('@/views/Visitor/Visitor.vue')

export default [
  {
    path: '/user',
    name: 'User',
    component: User,
    meta: {
      title: 'Χαλαρό - 用户',
      dom: '#user'
    },
    children: [
      {
        path: 'fav',
        name: 'UserFav',
        component: UserFav,
        meta: {
          title: 'Χαλαρό - 用户收藏',
          dom: '#user',
          say: '看看你都藏了些啥？'
        }
      },
      {
        path: 'home',
        name: 'UserHome',
        component: UserHome,
        meta: {
          title: 'Χαλαρό - 用户首页',
          dom: '#user',
          say: '别问 问就是不知道写啥'
        }
      },
      {
        path: 'profile',
        name: 'UserProfile',
        component: UserProfile,
        meta: {
          title: 'Χαλαρό - 用户信息',
          dom: '#user',
          say: '个人隐私，请勿扩散~'
          // requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/visitor/:accountnum',
    name: 'Visitor',
    component: Visitor,
    meta: {
      title: 'Χαλαρό - 用户'
    }
  },
  {
    path: '/notify',
    name: 'UserNotify',
    component: UserNotify,
    meta: {
      title: 'Χαλαρό - 用户消息',
      dom: '#user-notify',
      say: '个人隐私，请勿扩散~'
      // requiresAuth: true
    }
  }
]
