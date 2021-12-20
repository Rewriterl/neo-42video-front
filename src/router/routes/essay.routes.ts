const Essay = () => import('@/views/TeaParty/Essay.vue')
export default {
  path: '/essay',
  name: 'Essay',
  component: Essay,
  meta: {
    title: 'Χαλαρό - 学习',
    dom: '#essay',
    say: '学习，学个屁~'
  },
  children: []
}
