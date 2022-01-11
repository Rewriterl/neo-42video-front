<template>
  <div class="comic-main">
    <div class="comic-main__break">
      <Icon name="delete2" @click="$router.go(-1)" />
    </div>
    <div class="comic-main__inner">
      <div class="comic-main__video">
        <AwVideo :src="anthology.current" />
      </div>
      <div class="comic-main__box">
        <el-tabs>
          <el-tab-pane label="选集" lazy>
            <div class="comic-main__anthology">
              <!-- <div
                v-show="anthology.isPending"
                class="comic-main__anthology-loading"
              ></div> -->
              <ComicAnthology
                v-for="(item, index) in anthology.list"
                :key="index"
                :active="anthology.current"
                :label="item.name"
                :list="item.values"
                :bad-anthology="anthology.bads"
                @change="changeAnthology"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane label="详情" lazy>
            <div class="comic-main__info">
              <div class="cover">
                <BaseImg :src="comic.cover" alt />
              </div>
              <div class="message">
                <h1>{{ comic.title }}</h1>
                <ul class="message-tags">
                  <li v-for="item in comicTags" :key="item.label">
                    <span>{{ item.label }}</span>
                    <b>{{ item.value }}</b>
                  </li>
                </ul>
                <ul class="message-cates">
                  <li v-for="item in comic.cates" :key="item">{{ item }}</li>
                </ul>
                <div class="message-desc">
                  <b>声优：</b>
                  <p>{{ comic.voiceActors.join('、') }}</p>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onDeactivated, reactive, ref } from 'vue'
import AwVideo from '@comps/AwVideo/AwVideo.vue'
import ComicAnthology, { Option } from './component/ComicAnthology.vue'
import * as Api from '@apis/index'
import * as Type from './types/index.type'
import { GetComicMainReturn } from '@apis/index'
import BaseImg from '@/components/Global/BaseImg.vue'
import { getVal } from '@/utils/adLoadsh'

export default defineComponent({
  name: 'ComicMain',
  components: {
    AwVideo,
    ComicAnthology,
    BaseImg
  },
  props: {
    id: {
      type: [Number, String],
      default: -1
    }
  },
  setup(props) {
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
    const anthology = reactive<Type.Anthology>({
      current: '',
      bads: [],
      list: computed(() =>
        comicUrls.value.map((item) => ({
          name: `播放源-${item.key}`,
          values: item.value.map((url, index) => ({
            name: getVal(() => comic.playlist[index].name, '未知'),
            value: url
          }))
        }))
      )
    })

    const comicTags = computed(() => [
      {
        label: '评分',
        value: comic.rank
      },
      {
        label: '地区',
        value: comic.region
      },
      {
        label: '状态',
        value: comic.season
      },
      {
        label: '作者',
        value: comic.master
      },
      {
        label: '语言',
        value: comic.lang
      },
      {
        label: '首播时间',
        value: comic.firstDate
      }
    ])

    const changeAnthology = async ({ value }: Option) => {
      if (['kol-fans.fp.ps', '.m3u8'].some((key) => value.includes(key))) {
        anthology.bads.push(value)
      } else {
        anthology.current = value
      }
    }
    const init = async () => {
      // if (comic.playlist.length > 0) {
      // const item = comic.playlist[0].value[0]
      // anthology.current = item.value
      // changeAnthology(item)
      // }
    }

    ;(async () => {
      comicUrls.value = await Api.getVideoUrl(props.id)
      const data = await Api.getComicMain(props.id)

      if (data) {
        comic.playlist = data.playlist
        ;(Object.keys(comic) as (keyof GetComicMainReturn)[]).forEach((k) => {
          if (typeof data[k] !== 'undefined') {
            comic[k] = data[k] as any
          }
        })
        init()
      }
    })()

    onDeactivated(() => {
      //
    })

    return {
      comic,
      comicTags,
      comicUrls,
      changeAnthology,
      anthology
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
  overflow-y: auto;
  overflow-x: hidden;
  &__break {
    position: sticky;
    top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    margin-left: 20px;
    background: var(--primary-color);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.25s;
    i {
      color: var(--font-color);
      font-size: 30px;
    }
    &:hover {
      transform: rotate(180deg);
    }
  }
  &__inner {
    width: 90%;
    margin: 0 auto;
  }
  &__video {
    width: 100%;
    margin-top: @padding;
    border-radius: @radius;
    overflow: hidden;
  }
  &__box {
    width: 100%;
    padding: 30px;
    box-sizing: border-box;
    background: var(--bg-color);
    border-radius: @radius;
    color: var(--font-color);
    margin: @padding 0;
    ::v-deep(.el-tabs) {
      .el-tabs__nav-wrap {
        &::after {
          content: unset;
        }
      }
      .el-tabs__nav {
        padding-bottom: 12px;
      }
      .el-tabs__item {
        color: var(--font-unactive-color);
        font-weight: 600;
        font-size: 28px;
        &.is-active {
          color: var(--font-color);
        }
      }
    }
  }
  &__anthology {
    position: relative;
    width: 100%;
    &-loading {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 3;
    }
  }
  &__info {
    display: flex;
    width: 100%;
    margin-top: 10px;
    .cover {
      width: 200px;
      aspect-ratio: 1.4/2;
      border-radius: 8px;
      box-shadow: rgba(0, 0, 0, 0.2);
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .message {
      padding-left: 30px;
      flex: 1;
      box-sizing: border-box;
      &-tags {
        margin-top: 20px;
        height: 46px;
        li {
          display: inline-flex;
          height: 100%;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;
          border-right: 1px solid var(--font-color);
          padding-right: 16px;
          font-size: 12px;
          margin-right: 16px;
          &:last-child {
            border: none;
          }
          span {
            opacity: 0.6;
          }
          b {
            margin-top: 6px;
            font-size: 18px;
            opacity: 0.85;
          }
        }
      }
      &-cates {
        margin-top: 16px;
        opacity: 0.9;
        li {
          font-size: 12px;
          display: inline-block;
          vertical-align: middle;
          height: 20px;
          padding: 0 4px;
          margin: 4px 0;
          margin-right: 10px;
          line-height: 20px;
          border: 1px solid var(--font-color);
          border-radius: 3px;
        }
      }
      &-desc {
        display: flex;
        align-items: flex-end;
        width: 100%;
        margin-top: 16px;
        font-size: 14px;
      }
    }
  }
}
</style>
