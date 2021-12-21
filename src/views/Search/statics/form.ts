import { Option } from '@comps/Form/type'

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
      value: -1
    }
  ],
  STATUS: [
    {
      name: '连载',
      value: 0
    },
    {
      name: '完结',
      value: 1
    },
    {
      name: '未播放',
      value: 2
    }
  ],
  CATE: [
    {
      name: '搞笑',
      value: 0
    },
    {
      name: '治愈',
      value: 1
    },
    {
      name: '致郁',
      value: 2
    },
    {
      name: '后宫',
      value: 3
    },
    {
      name: '萝莉',
      value: 4
    },
    {
      name: '热血',
      value: 5
    },
    {
      name: '战斗',
      value: 6
    },
    {
      name: '校园',
      value: 7
    },
    {
      name: '青春',
      value: 8
    },
    {
      name: '爱情',
      value: 9
    },
    {
      name: '百合',
      value: 10
    },
    {
      name: '魔法',
      value: 11
    },
    {
      name: '悬疑',
      value: 12
    },
    {
      name: '推理',
      value: 13
    },
    {
      name: '奇幻',
      value: 14
    },
    {
      name: '科幻',
      value: 15
    },
    {
      name: '游戏',
      value: 16
    }
  ],
  CITY: [
    {
      name: '中国',
      value: 0
    },
    {
      name: '日本',
      value: 1
    }
  ]
}
