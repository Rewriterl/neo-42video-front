const AboutMe = () => import('@/views/Else/AboutMe.vue')
export default {
  path: '/about',
  name: 'AboutMe',
  component: AboutMe,
  meta: {
    title: 'Χαλαρό - 关于我',
    say: '就，普普通通的个人介绍~'
  },
  children: []
}
