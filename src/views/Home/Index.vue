<template>
  <div id="home">
    <HomeBanner
      :banner="comic.banner"
      :hots="comic.hots"
      :latest="comic.latest"
      :is-init="isInit"
    />
    <div class="home-main">
      <!--      <div class="home-main__col">-->
      <!--        <HomeArticle :perweek="comic.perweek" />-->
      <!--      </div>-->
      <div class="home-main__col">
        <HomeTv :tv="comic.tv" />
      </div>
      <div class="home-main__col">
        <HomeBlockComic title="完结日漫" :list="comic.endJp" />
      </div>
      <!--      <div class="home-main__col">-->
      <!--        <HomeBlockComic title="热门国漫" :list="comic.cn" />-->
      <!--      </div>-->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, shallowReactive } from 'vue'

import HomeBanner from './component/HomeBanner.vue'
import HomeArticle from './component/HomeArticle.vue'
import HomeTv from './component/HomeTv.vue'
import HomeBlockComic from './component/HomeBlockComic.vue'

import * as Api from '@apis/index'
import { useComicUpdate } from '@/stores/comicUpdate.store'
import { FAKE_GETINDEX, fakeRequest } from '@/api/fakedata'

export default defineComponent({
  name: 'Home',
  components: {
    HomeBanner,
    // HomeArticle,
    HomeTv,
    HomeBlockComic
  },
  setup() {
    const comicUpdate = useComicUpdate()

    const isInit = ref(false)
    const comic = shallowReactive<Api.GetHomeMixData>({
      perweek: [],
      hots: [
        {
          id: '2156',
          title: '\u95f4\u8c0d\u8fc7\u5bb6\u5bb6',
          cover:
            'http://tvax4.sinaimg.cn/large/006yt1Omgy1h00m6xnjc7j31jk26i4qp.jpg',
          season: '\u8fde\u8f7d9\u96c6'
        },
        {
          id: '2156',
          title: '\u95f4\u8c0d\u8fc7\u5bb6\u5bb6',
          cover:
            'http://tvax4.sinaimg.cn/large/006yt1Omgy1h00m6xnjc7j31jk26i4qp.jpg',
          season: '\u8fde\u8f7d9\u96c6'
        },
        {
          id: '2156',
          title: '\u95f4\u8c0d\u8fc7\u5bb6\u5bb6',
          cover:
            'http://tvax4.sinaimg.cn/large/006yt1Omgy1h00m6xnjc7j31jk26i4qp.jpg',
          season: '\u8fde\u8f7d9\u96c6'
        },
        {
          id: '2156',
          title: '\u95f4\u8c0d\u8fc7\u5bb6\u5bb6',
          cover:
            'http://tvax4.sinaimg.cn/large/006yt1Omgy1h00m6xnjc7j31jk26i4qp.jpg',
          season: '\u8fde\u8f7d9\u96c6'
        }
      ],
      latest: [
        {
          id: '2156',
          title: '\u95f4\u8c0d\u8fc7\u5bb6\u5bb6',
          cover:
            'http://tvax4.sinaimg.cn/large/006yt1Omgy1h00m6xnjc7j31jk26i4qp.jpg',
          season: '\u8fde\u8f7d9\u96c6'
        }
      ],
      banner: [
        {
          id: '2156',
          title: '\u95f4\u8c0d\u8fc7\u5bb6\u5bb6',
          thumbnail:
            'http://tvax4.sinaimg.cn/large/006yt1Omgy1h00m6xnjc7j31jk26i4qp.jpg'
        }
      ],
      tv: [
        {
          id: '2199',
          title: '\u5492\u672f\u56de\u6218 0',
          cover:
            'https://tvax3.sinaimg.cn/large/008kBpBlgy1gx1wptbyy6j307409wmxu.jpg',
          season: 'BDTC'
        },
        {
          id: '1212',
          title: '\u6388\u8bfe\u5230\u5929\u4eaeChu\uff01BD\u65e0\u4fee',
          cover:
            'https://tvax4.sinaimg.cn/large/006MDjU7gy1g6tqrdtjw4j307i0b9dg8.jpg',
          season: '\u5168\u96c6'
        },
        {
          id: '1212',
          title: '\u6388\u8bfe\u5230\u5929\u4eaeChu\uff01BD\u65e0\u4fee',
          cover:
            'https://tvax4.sinaimg.cn/large/006MDjU7gy1g6tqrdtjw4j307i0b9dg8.jpg',
          season: '\u5168\u96c6'
        },
        {
          id: '1212',
          title: '\u6388\u8bfe\u5230\u5929\u4eaeChu\uff01BD\u65e0\u4fee',
          cover:
            'https://tvax4.sinaimg.cn/large/006MDjU7gy1g6tqrdtjw4j307i0b9dg8.jpg',
          season: '\u5168\u96c6'
        }
      ],
      endJp: [
        {
          id: '526',
          title: '\u6076\u9b54\u9ad8\u6821DXD\u7b2c\u4e00\u5b63 BD\u65e0\u4fee',
          cover:
            'https://tvax3.sinaimg.cn/large/008kBpBlgy1gsb8qeo910j307409wjst.jpg',
          season: '7\u5377\u5b8c\u7ed3'
        },
        {
          id: '1724',
          title:
            '\u56de\u590d\u672f\u58eb\u7684\u91cd\u6765\u4eba\u751f BD\u65e0\u4fee',
          cover:
            'http://tvax4.sinaimg.cn/large/006sgDEegy1glsc88j2rmj307i0amabq.jpg',
          season: '3\u5dfb\u5b8c\u7ed3'
        },
        {
          id: '1829',
          title: '\u9b3c\u706d\u4e4b\u5203\u7b2c\u4e8c\u5b63',
          cover:
            'https://tvax3.sinaimg.cn/large/008kBpBlgy1gx3e523m8lj307409w0th.jpg',
          season: '11\u96c6\u5b8c\u7ed3'
        },
        {
          id: '1220',
          title: '\u51fa\u5305\u738b\u5973\u7b2c\u4e00\u5b63 BD\u65e0\u4fee',
          cover:
            'http://tvax4.sinaimg.cn/large/006si4WOgy1gfrne6n27cj307i0aodh6.jpg',
          season: '13\u5377\u5b8c\u7ed3'
        }
      ],
      cn: []
    })

    ;(async () => {
      // const data = await Api.getHomeMixData()
      const { data } = await fakeRequest(FAKE_GETINDEX)
      console.log(data)
      if (data) {
        // comicUpdate.setComic(data.perweek)
        // Object.entries(data).forEach(([k, v]) => {
        //   comic[k as keyof Api.GetHomeMixData] = v
        // })
        isInit.value = true
      }
    })()

    return {
      comic,
      isInit
    }
  }
})
</script>
<style lang="less" scoped>
#home {
  position: relative;
  width: 100%;
  height: 100%;
  border-top-left-radius: 30px;
  overflow-y: auto;
  background: var(--box-bg-color);

  .home-main {
    width: 100%;
    padding: 30px 20px;
    box-sizing: border-box;
    &__col {
      display: flex;
      width: 100%;
      gap: 40px;
      margin-bottom: 40px;
    }
  }
}
</style>
