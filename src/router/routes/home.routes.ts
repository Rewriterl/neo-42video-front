const Home = () => import('@/views/Home/Home.vue')
export default {
  path: '/home',
  name: 'Home',
  component: Home,
  meta: {
    title: 'Χαλαρό',
    dom: '#home',
    say: '菩提本无树，明镜亦非台~'
  },
  children: []
}
