const Comic = () => import('@/views/TeaParty/Comic.vue')
const ComicMain = () => import('@/views/TeaParty/routes/ComicMain.vue')
export default {
  path: '/comic',
  name: 'Comic',
  component: Comic,
  meta: {
    title: 'Χαλαρό - 动漫',
    dom: '#comic',
    say: '论一个老肥宅的自我修养~'
  },
  children: [
    {
      path: 'main',
      name: 'ComicMain',
      component: ComicMain,
      meta: {
        title: 'Χαλαρό - 动漫详情'
      }
    }
  ]
}
