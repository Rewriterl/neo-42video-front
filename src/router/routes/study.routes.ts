const StudyMain = () => import('@/views/Main/StudyMain.vue')
export default {
  path: '/study',
  name: 'StudyMain',
  component: StudyMain,
  meta: {
    title: 'Χαλαρό - 详情',
    dom: '#studymain .studymain-shell'
  },
  children: []
}
