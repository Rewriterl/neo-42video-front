const Main = () => import('@/views/Main/Index.vue')
export default {
  path: '/comicmain/:id',
  name: 'ComicMain',
  component: Main,
  meta: {
    title: 'Anime-详情'
  },
  props: true,
  children: []
}
