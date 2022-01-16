<template>
  <div class="home-banner">
    <div class="home-banner__bg">
      <el-carousel
        height="100%"
        indicator-position="none"
        arrow="never"
        :pause-on-hover="false"
        @change="onCarouselChange"
      >
        <el-carousel-item v-for="(item, index) in banner" :key="index">
          <BaseImg :src="item.cover" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="home-banner__info">
      <div class="home-banner__info-msg">
        <div v-if="carousel.current" class="inner">
          <span>这是一段话</span>
          <h1>{{ carousel.current.title }}</h1>
          <p>
            这是一个很长的简介这是一个很长的简介这是一个很长的简介这是一个很长的简介这是一个很长的简介这是一个很长的简介这是一个很长的简介
          </p>
          <div class="inner-rate">
            <el-rate :value="5" disabled />
            评分
          </div>
          <div class="inner-control">
            <el-button type="warning" round>详细信息</el-button>
            <el-button round plain @click="toComicMain(carousel.current.id)"
              >播放</el-button
            >
          </div>
        </div>
      </div>
      <div class="home-banner__info-section">
        <div class="tabs">
          <div class="tabs-nav">
            <div
              v-for="item in tabs.list"
              :key="item.key"
              class="tabs-nav__item"
              :class="{ active: tabs.active === item.key }"
              @click="changeTab(item.key)"
            >
              {{ item.name }}
            </div>
          </div>
          <div class="tabs-inner">
            <AwSlideX
              v-if="currentComic.length > 0"
              :key="tabs.active"
              class="card-content"
              @onChange="onAwSlideXChange"
            >
              <AwSlideItem v-for="(item, index) in currentComic" :key="index">
                <HomeSectionCard
                  :detail="item"
                  :active="index === awSlideXActive"
                />
              </AwSlideItem>
            </AwSlideX>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, reactive, ref } from 'vue'

import AwSlideX from '@comps/AwSlide/AwSlideX.vue'
import AwSlideItem from '@comps/AwSlide/AwSlideItem.vue'
import HomeSectionCard from './HomeSectionCard.vue'

import * as Type from '../types/homeSection.type'
import { toComicMain } from '@/hooks/router'

export default defineComponent({
  name: 'HomeBanner',
  components: {
    AwSlideX,
    AwSlideItem,
    HomeSectionCard
  },
  props: {
    banner: {
      type: Array as PropType<Type.Comic['banner']>,
      default: () => []
    },
    hots: {
      type: Array as PropType<Type.Comic['hots']>,
      default: () => []
    },
    latest: {
      type: Array as PropType<Type.Comic['latest']>,
      default: () => []
    },
    isInit: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    type ComicKey = 'hots' | 'latest'

    const awSlideXActive = ref(0)
    const carousel = reactive({
      active: 0,
      get current() {
        return props.banner[this.active]
      }
    })
    const tabs = reactive<Type.Tabs<ComicKey>>({
      active: 'hots',
      list: [
        // {
        //   name: '日排行',
        //   key: 'perday'
        // },
        {
          name: '热门',
          key: 'hots'
        },
        {
          name: '最新更新',
          key: 'latest'
        }
      ]
    })

    const currentComic = computed(() => {
      return {
        latest: props.latest.map((item) => ({
          cover: item.cover,
          title: item.title,
          id: item.id,
          desc: item.season
        })),
        hots: props.hots.map((item) => ({
          cover: item.cover,
          title: item.title,
          id: item.id,
          desc: item.season
        }))
      }[tabs.active]
    })

    const onCarouselChange = (e: any) => {
      carousel.active = +e
    }
    const changeTab = (key: ComicKey) => {
      tabs.active = key
      awSlideXActive.value = 0
    }
    const onAwSlideXChange = (e: number) => {
      awSlideXActive.value = e
    }

    return {
      tabs,
      awSlideXActive,
      currentComic,
      onCarouselChange,
      carousel,
      changeTab,
      onAwSlideXChange,
      toComicMain
    }
  }
})
</script>
<style lang="less" scoped>
.home-banner {
  width: 100%;
  height: calc(100vh - 40px);
  overflow: hidden;
  &__bg {
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
        filter: blur(3px);
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
    &-section {
      position: relative;
      background: rgba(0, 0, 0, 0.96);
      padding: 40px;
      padding-top: 0;
      box-sizing: border-box;
      &::before {
        .mask(3);
        box-shadow: 0 -38px 32px rgb(0 0 0 / 92%);
        transform: scaleX(1.4);
      }
      .tabs {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        z-index: 4;
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
              color: var(--primary-color);
              border-bottom: 2px solid var(--primary-color);
            }
          }
        }
        &-inner {
          flex: 1;
          padding-top: 20px;
          box-sizing: border-box;
          overflow: hidden;
          .card-content {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
