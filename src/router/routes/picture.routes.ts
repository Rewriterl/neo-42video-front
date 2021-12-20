const Picture = () => import('@/views/TeaParty/Picture.vue')
export default {
  path: '/picture',
  name: 'Picture',
  component: Picture,
  meta: {
    title: 'Χαλαρό - 图片',
    dom: '#pictures',
    say: '懂得都懂~'
  },
  children: []
}
