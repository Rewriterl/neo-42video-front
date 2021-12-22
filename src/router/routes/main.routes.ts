const Main = () => import('@/views/Main/Index.vue')
export default {
  path: '/comicmain',
  name: 'ComicMain',
  component: Main,
  meta: {
    title: 'Χαλαρό',
    dom: '.comic-main'
  },
  children: []
}
