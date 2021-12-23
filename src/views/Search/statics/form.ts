import { Option } from '@comps/Form/type'

function nameToOption(names: string[]): Option[] {
  return names.map((name) => ({
    name,
    value: name
  }))
}

export const SEARCH_FILTER: {
  [prop: string]: Option[]
} = {
  RELEASE_TIME: [
    ...Array(21)
      .fill(0)
      .map((item, index) => ({
        name: 2021 - index,
        value: 2021 - index
      })),
    {
      name: '2000年以前',
      value: '2000年以前'
    }
  ],
  STATUS: nameToOption(['连载', '完结', '未播放']),
  CATE: nameToOption([
    '搞笑',
    '运动',
    '励志',
    '热血',
    '战斗',
    '竞技',
    '校园',
    '青春',
    '爱情',
    '冒险',
    '后宫',
    '百合',
    '治愈',
    '萝莉',
    '魔法',
    '悬疑',
    '推理',
    '奇幻',
    '科幻',
    '游戏',
    '神魔',
    '恐怖',
    '血腥',
    '机战',
    '战争',
    '犯罪',
    '历史',
    '社会',
    '职场',
    '剧情',
    '童年',
    '教育',
    '亲子',
    '歌舞',
    '美少女',
    '轻小说',
    '吸血鬼',
    '女性向',
    '泡面番',
    '欢乐向'
  ]),
  CITY: nameToOption(['中国', '日本'])
}
