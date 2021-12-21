<template>
  <div class="home-banner">
    <div class="home-banner__header"></div>
    <div class="home-banner__main">
      <ul class="home-banner__main-indicator">
        <li
          v-for="(item, index) in carousel.list"
          :key="index"
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
        <el-carousel-item v-for="(item, index) in carousel.list" :key="index">
          <BaseImg :src="item.cover" />
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { ElCarousel } from 'element-plus'

export default defineComponent({
  name: 'HomeBanner',
  setup() {
    const carouselComp = ref<typeof ElCarousel>()

    const carousel = reactive({
      index: 0,
      list: [
        {
          cover: 'https://api.adicw.cn/uploads/StudyImg/6141a4ce2715a.png'
        },
        {
          cover: 'https://api.adicw.cn/uploads/StudyImg/6191d88725d2c.jpg'
        },
        {
          cover: 'https://api.adicw.cn/images/StudyImg/60a77a12ed88b.png'
        }
      ]
    })
    const onCarouselChanged = (index: number) => {
      carousel.index = index
    }
    const changeCarousel = (index: number) => {
      carouselComp.value!.setActiveItem(index)
    }

    return {
      carousel,
      onCarouselChanged,
      carouselComp,
      changeCarousel
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
        background: linear-gradient(94deg, #333, #def);
        img {
          width: 100%;
          height: 100%;
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
