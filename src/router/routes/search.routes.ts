const Search = () => import('@/views/Search/Index.vue')
export default {
  path: '/search',
  name: 'Search',
  component: Search,
  meta: {
    title: 'Anime-搜索',
    elName: '#search .search-main'
  },
  children: []
}
