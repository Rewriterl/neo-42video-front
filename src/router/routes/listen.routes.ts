const Listen = () => import('@/views/Listen/Listen.vue')
const ListenSonglistDetail = () =>
  import('@/views/Listen/route/ListenSonglistDetail.vue')
const ListenSingerDetail = () =>
  import('@/views/Listen/route/ListenSingerDetail.vue')
const ListenAlbumDetail = () =>
  import('@/views/Listen/route/ListenAlbumDetail.vue')
const ListenSonglistSquare = () =>
  import('@/views/Listen/route/ListenSonglistSquare.vue')
const ListenUserDetail = () =>
  import('@/views/Listen/route/ListenUserDetail.vue')

export default {
  path: '/listen',
  name: 'Listen',
  component: Listen,
  meta: {
    title: 'Χαλαρό - 音乐',
    say: 'flow your heart~'
  },
  children: [
    {
      path: 'songlistDetail/:songlistId',
      name: 'ListenSonglistDetail',
      component: ListenSonglistDetail,
      meta: {
        title: 'Χαλαρό - 歌单详情',
        say: '让我看看你有哪些内容~'
      }
    },
    {
      path: 'listenSingerDetail/:singerId',
      name: 'ListenSingerDetail',
      component: ListenSingerDetail,
      meta: {
        title: 'Χαλαρό - 歌手详情',
        say: '让我看看你有哪些内容~'
      }
    },
    {
      path: 'listenAlbumDetail/:albumId',
      name: 'ListenAlbumDetail',
      component: ListenAlbumDetail,
      meta: {
        title: 'Χαλαρό - 专辑详情',
        say: '让我看看你有哪些内容~'
      }
    },
    {
      path: 'listenSonglistSquare',
      name: 'ListenSonglistSquare',
      component: ListenSonglistSquare,
      meta: {
        title: 'Χαλαρό - 歌单广场',
        say: '让我看看你有哪些内容~'
      }
    },
    {
      path: 'ListenUserDetail',
      name: 'ListenUserDetail',
      component: ListenUserDetail,
      meta: {
        title: 'Χαλαρό - 个人中心',
        say: '让我看看你有哪些内容~'
      }
    }
  ]
}
