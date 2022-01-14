<template>
  <div class="comic-main">
    <AwVideo
      v-show="false"
      ref="awVideoComp"
      :src="anthology.current"
      autoplay
      @ended="onVideoEnded"
    />
    <div class="comic-main__banner">
      <el-carousel
        height="100%"
        indicator-position="none"
        arrow="never"
        :pause-on-hover="false"
      >
        <el-carousel-item
          v-for="(item, index) in [
            'https://api.adicw.cn/uploads/StudyImg/6191d88725d2c.jpg',
            'https://api.adicw.cn/uploads/StudyImg/6141a4ce2715a.png',
            'https://api.adicw.cn/uploads/StudyImg/60a671f8b7c20.jpg'
          ]"
          :key="index"
        >
          <BaseImg :src="item" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="comic-main__info">
      <div class="comic-main__info-msg">
        <div class="inner">
          <span>这是一段话</span>
          <h1>这是一个名字罢了罢了</h1>
          <p>
            这是一个很长的简介这是一个很长的简介这是一个很长的简介这是一个很长的简介这是一个很长的简介这是一个很长的简介这是一个很长的简介
          </p>
          <div class="inner-rate">
            <el-rate :value="5" />
            评分罢了
          </div>
          <div class="inner-control">
            <el-button type="warning" round>这是一个比较长的</el-button>
            <el-button round plain>这个是一般</el-button>
          </div>
        </div>
      </div>
      <div class="comic-main__info-anthology">
        <div class="tabs">
          <div class="tabs-nav">
            <div
              v-for="(item, index) in anthology.list"
              :key="index"
              class="tabs-nav__item"
              :class="{ active: anthologyTabs.active === index }"
              @click="anthologyTabs.active = index"
            >
              {{ item.name }}
            </div>
          </div>
          <div class="tabs-inner">
            <ComicAnthologyPlus
              v-if="anthologyTabs.current"
              :org-id="anthologyTabs.current.orgId"
              :active="anthology.current"
              :list="anthologyTabs.current.values"
              :bad-anthology="anthology.bads"
              @change="changeAnthology"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, reactive, ref } from 'vue'

import AwVideo from '@comps/AwVideo/AwVideo.vue'
import { ElNotification } from 'element-plus'
import ComicAnthologyPlus from './component/ComicAnthologyPlus.vue'

import * as Api from '@apis/index'
import * as Type from './types/index.type'
import { GetComicMainReturn } from '@apis/index'
import { getVal, sToMs } from '@/utils/adLoadsh'
import { usePlayProgressCache } from '@/hooks/user'
import { ChangeReturns } from './component/ComicAnthology.vue'

/**
 * 动漫信息模块
 * @param comicId 动漫id
 * @param init 信息请求完成后的回调
 */
function comicInfoModule(comicId: number, init: () => void) {
  const comic = reactive<GetComicMainReturn>({
    title: '',
    season: '',
    region: '',
    rank: '',
    master: '',
    lang: '',
    firstDate: '',
    cover: '',
    voiceActors: [],
    cates: [],
    playlist: []
  })
  const comicUrls = ref<Api.GetVideoUrlReturn>([])
  const comicTags = computed(() => [
    {
      label: '评分',
      value: comic.rank
    },
    {
      label: '首播时间',
      value: comic.firstDate
    },
    {
      label: '状态',
      value: comic.season
    },
    {
      label: '语言',
      value: comic.lang
    },
    {
      label: '地区',
      value: comic.region
    },
    {
      label: '作者',
      value: comic.master
    }
  ])
  ;(async () => {
    comicUrls.value = await Api.getVideoUrl(comicId)
    const data = await Api.getComicMain(comicId)

    if (data) {
      comic.playlist = data.playlist
      ;(Object.keys(comic) as (keyof GetComicMainReturn)[]).forEach((k) => {
        if (typeof data[k] !== 'undefined') {
          comic[k] = data[k] as any
        }
      })
      // init()
    }
  })()
  return {
    comic,
    comicUrls,
    comicTags
  }
}

export default defineComponent({
  name: 'ComicMain',
  components: {
    AwVideo,
    ComicAnthologyPlus
  },
  props: {
    id: {
      type: [Number, String],
      default: -1
    }
  },
  setup(props) {
    const awVideoComp = ref<typeof AwVideo>()
    const playProgressCache = usePlayProgressCache()

    const { comic, comicUrls, ...comicInfoModuleArgs } = comicInfoModule(
      +props.id,
      async () => {
        const cache = playProgressCache.getLatestCache(+props.id)
        if (cache) {
          const list = anthology.list.find((item) => item.orgId === cache.orgId)
          if (!list) return
          const value = list.values.find((item) => item.name === cache.name)
          if (value) {
            changeAnthology(
              {
                ...value,
                orgId: list.orgId
              },
              false
            )
            awVideoComp.value!.changeProgress(cache.progress)
            awVideoComp.value!.notify({
              content: `已为您定位到 ${value.name} ${sToMs(cache.progress)}`,
              duration: 3000
            })
          }
        } else {
          const item = getVal(() => anthology.list[0].values[0], null)
          const isBad =
            item &&
            !changeAnthology(
              {
                ...item,
                orgId: ''
              },
              false
            )
          isBad &&
            ElNotification({
              type: 'error',
              title: '动漫加载',
              message: '默认加载失败，请手动选择源'
            })
        }
      }
    )
    const anthology = reactive<
      Type.Anthology & { currentItem: ChangeReturns | null }
    >({
      current: '',
      currentItem: null,
      bads: [],
      list: computed(() =>
        comicUrls.value.map((item) => ({
          name: `播放源-${item.key}`,
          orgId: item.key,
          values: item.value.map((url, index) => ({
            name: getVal(() => comic.playlist[index].name, '未知'),
            value: url
          }))
        }))
      )
    })
    const anthologyTabs = reactive({
      active: 0,
      get current() {
        return anthology.list[this.active]
      }
    })

    const changeAnthology = (item: ChangeReturns, isAddCache = true) => {
      const { value } = item
      // 错误地址判断
      if (['kol-fans.fp.ps', '.m3u8'].some((key) => value.includes(key))) {
        anthology.bads.push(value)
        return false
      } else {
        anthology.currentItem = item
        isAddCache && saveCache(item)
        anthology.current = value
        return true
      }
    }
    const saveCache = (item: ChangeReturns | null) => {
      if (!item) return
      playProgressCache.add({
        orgId: item.orgId,
        name: String(item.name),
        progress: getVal(() => awVideoComp.value!.player.currentTime, 0),
        comicId: +props.id
      })
    }
    const onVideoEnded = () => {
      if (!anthology.currentItem) return
      const oldItem = anthology.currentItem!
      const list = anthology.list.find((item) => item.orgId === oldItem.orgId)!
      const oldIndex = list.values.findIndex(
        (item) => item.name === oldItem.name
      )
      if (oldIndex !== anthology.list.length - 1) {
        const value = list.values[oldIndex + 1]
        changeAnthology(
          {
            ...value,
            orgId: list.orgId
          },
          false
        )
        awVideoComp.value!.notify({
          content: `正在为您播放下一集`,
          duration: 3000
        })
      }
    }

    onBeforeUnmount(() => {
      saveCache(anthology.currentItem)
      playProgressCache.saveStore()
    })

    return {
      ...comicInfoModuleArgs,
      comic,
      comicUrls,
      changeAnthology,
      anthology,
      awVideoComp,
      onVideoEnded,
      anthologyTabs
    }
  }
})
</script>
<style lang="less" scoped>
.comic-main {
  @padding: 40px;
  @radius: 24px;
  position: relative;
  width: 100%;
  height: 100%;
  background: var(--box-bg-color);
  border-top-left-radius: 24px;
  overflow: hidden;
  &__banner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    ::v-deep(.el-carousel) {
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  &__info {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    &-msg {
      flex: 1;
      background: linear-gradient(
        to right,
        rgba(0, 0, 0, 0.7),
        rgba(0, 0, 0, 0)
      );
      display: flex;
      align-items: center;
      padding: 40px;
      box-sizing: border-box;
      span {
        font-size: 12px;
        color: rgb(255 255 255 /0.9);
      }
      h1 {
        padding-top: 6px;
        padding-bottom: 18px;
      }
      p {
        font-size: 14px;
        color: rgb(255 255 255 /0.7);
        max-width: 80%;
      }
      .inner-rate {
        display: flex;
        margin-top: 16px;
        margin-bottom: 30px;
        font-size: 14px;
        color: rgb(255 255 255 /0.7);
      }
      .inner-control {
        ::v-deep(.el-button) {
          padding: 6px 22px;
          min-height: 36px;
          margin-right: 10px;
        }
        ::v-deep(.el-button--default) {
          background: unset;
          color: #fff;
        }
      }
    }
    &-anthology {
      box-shadow: 0 -38px 32px rgb(0 0 0 / 92%);
      background: rgba(0, 0, 0, 0.96);
      padding: 40px;
      box-sizing: border-box;
      .tabs {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        &-nav {
          display: flex;
          width: 100%;
          height: 40px;
          &__item {
            display: flex;
            align-items: center;
            height: 100%;
            color: rgba(255, 255, 255, 0.7);
            margin-right: 40px;
            cursor: pointer;
            user-select: none;
            font-weight: 800;
            &.active {
              color: crimson;
              border-bottom: 2px solid crimson;
            }
          }
        }
        &-inner {
          flex: 1;
          padding-top: 20px;
          box-sizing: border-box;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
