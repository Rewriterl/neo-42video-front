const Setting = () => import('@/views/Setting/Index.vue')

export default {
  path: '/setting',
  name: 'Setting',
  component: Setting,
  meta: {
    title: 'Anime-系统设置'
  },
  children: []
}
