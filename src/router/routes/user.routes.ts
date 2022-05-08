const User = () => import('@/views/User/Index.vue')

export default {
  path: '/user',
  name: 'User',
  component: User,
  meta: {
    title: 'Anime-小窝',
    elName: '#user .play-history'
  },
  children: []
}
