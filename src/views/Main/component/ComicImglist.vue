<template>
  <div class="comic-imglist">
    <div class="arrow arrow-left" @click="prev">
      <Icon name="arrow" />
    </div>
    <div class="arrow arrow-right" @click="next">
      <Icon name="arrow" />
    </div>
    <div ref="$innerEl" class="comic-imglist__content">
      <div class="comic-imglist__content-inner">
        <img v-for="img in imgs" :key="img.id" :src="img.url" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUpdate, nextTick, ref } from 'vue'
import * as Api from '@apis/index'
import { useResizeListener } from '@/utils/hooks/useResizeListener'
import { debounce } from '@/utils/adLoadsh'
import { computed } from '@vue/reactivity'

const props = withDefaults(
  defineProps<{
    imgs: Api.GetComicImglistReturn
  }>(),
  {
    imgs: () => []
  }
)

const imgElInfolist = ref<
  {
    el: HTMLImageElement
    width: number
  }[]
>([])
const $innerEl = ref<HTMLElement>()
const activeIndex = ref(0)

const styleInit = debounce(async () => {
  await nextTick()
  const innerHeight = $innerEl.value!.clientHeight
  imgElInfolist.value = [...$innerEl.value!.querySelectorAll('img')].map(
    (item, index) => ({
      el: item,
      width: +(
        (props.imgs[index].w / props.imgs[index].h) *
        innerHeight
      ).toFixed()
    })
  )
}, 300)
const prev = () => {
  if (activeIndex.value === 0) return
  activeIndex.value--
  scroll()
}
const next = () => {
  const { scrollWidth, scrollLeft, offsetWidth } = $innerEl.value!
  if (
    activeIndex.value === props.imgs.length - 2 ||
    scrollWidth <= scrollLeft + offsetWidth
  )
    return
  activeIndex.value++
  scroll()
}
const scroll = () => {
  $innerEl.value!.scrollLeft = imgElInfolist.value
    .slice(0, activeIndex.value)
    .reduce((totol, item) => totol + item.width + 20, 0)
}

onBeforeUpdate(styleInit)
useResizeListener($innerEl, styleInit)
</script>
<style lang="less" scoped>
.comic-imglist {
  position: relative;
  width: 100%;
  height: 400px;
  padding: 20px;
  box-sizing: border-box;
  &__content {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    &-inner {
      display: flex;
      width: max-content;
      height: 100%;
      gap: 20px;
      img {
        height: 100%;
      }
    }
  }

  .arrow {
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    background: var(--font-color);
    border-radius: 50%;
    cursor: pointer;
    z-index: 6;
    color: var(--bg-color);
    opacity: 0.4;
    transition: all 0.25s;
    i {
      font-size: 22px;
    }
    &:hover {
      transform: translateY(-15%);
      opacity: 1;
      box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.164);
    }
    &:active {
      opacity: 0.5;
    }
    &-left {
      left: 0;
      i {
        transform: rotate(180deg);
      }
    }
    &-right {
      right: 0;
    }
  }
}
</style>
