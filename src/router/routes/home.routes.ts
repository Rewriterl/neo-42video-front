const Home = () => import('@/views/Home/Index.vue')
export default {
  path: '/home',
  name: 'Home',
  component: Home,
  meta: {
    title: 'Anime-首页',
    elName: '#home'
  },
  children: []
}
