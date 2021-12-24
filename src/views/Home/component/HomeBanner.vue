<template>
  <div class="home-banner">
    <div class="home-banner__header"></div>
    <div class="home-banner__main">
      <ul class="home-banner__main-indicator">
        <li
          v-for="(item, index) in carousel.list"
          :key="item.id"
          :class="{ active: index === carousel.index }"
          @mouseenter="changeCarousel(index)"
        >
          <BaseImg :src="item.cover" />
        </li>
      </ul>
      <el-carousel
        ref="carouselComp"
        direction="vertical"
        height="100%"
        pause-on-hover
        indicator-position="none"
        @change="onCarouselChanged"
      >
        <el-carousel-item
          v-for="item in carousel.list"
          :key="item.id"
          @click="toComicMain(item.id)"
        >
          <BaseImg :src="item.cover" />
          <span>{{ item.title }}</span>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { ElCarousel } from 'element-plus'
import * as Api from '@apis/index'
import { toComicMain } from '@/hooks/router'

export default defineComponent({
  name: 'HomeBanner',
  setup() {
    const carouselComp = ref<typeof ElCarousel>()

    const carousel = reactive<{
      index: number
      list: Api.FilterComicReturn['data']
    }>({
      index: 0,
      list: []
    })
    const onCarouselChanged = (index: any) => {
      carousel.index = index
    }
    const changeCarousel = (index: number) => {
      carouselComp.value!.setActiveItem(index)
    }

    ;(async () => {
      const { data } = await Api.filterComic({
        page: 1,
        order: '更新时间'
      })
      carousel.list = data.slice(0, 3)
    })()

    return {
      carousel,
      onCarouselChanged,
      carouselComp,
      changeCarousel,
      toComicMain
    }
  }
})
</script>
<style lang="less" scoped>
@import '../style/home-main';
.home-banner {
  .up-block;
  &__header {
    .up-block-header;
  }
  &__main {
    .up-block-main;
    border-radius: 24px;
    ::v-deep(.el-carousel) {
      width: 100%;
      height: 100%;
      .el-carousel__item {
        height: 100%;
        img {
          width: 100%;
          height: 100%;
        }
        span {
          position: absolute;
          left: 30px;
          bottom: 16px;
          font-size: 40px;
          font-weight: 800;
          color: var(--font-color);
        }
      }
    }
    &-indicator {
      position: absolute;
      right: 24px;
      top: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      z-index: 3;
      li {
        width: 40px;
        height: 40px;
        border: 2px solid #fff;
        overflow: hidden;
        border-radius: 14px;
        cursor: pointer;
        transition: all 0.25s;
        &.active {
          border-color: var(--box-bg-color);
        }
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
