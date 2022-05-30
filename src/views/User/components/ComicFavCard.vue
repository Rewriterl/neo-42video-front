<template>
  <div
    v-if="detail"
    class="comic-fav-card"
    @click="toComicMain(detail!.comicId)"
  >
    <BaseImg :src="detail.comicCover" />
    <div class="info">
      <el-tooltip effect="light" :content="detail.comicName">
        <p>{{ detail.comicName }}</p>
      </el-tooltip>
      <span>收藏时间：{{ showDate }}</span>
    </div>
    <div class="tools">
      <el-dropdown>
        <Icon class="tools-icon" name="picture-in-picture-exit-fill" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="deleteFav">取消收藏</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import moment from 'moment'

import { ComicFavItem } from '@/class/comicFav.class'
import { toComicMain } from '@/hooks/router'
import { useFavStore } from '@/stores/fav.store'
export default defineComponent({
  name: 'ComicFavCard',
  props: {
    detail: {
      type: Object as PropType<null | ComicFavItem>,
      default: null
    }
  },
  setup(props) {
    const favStore = useFavStore()
    const showDate = computed(() =>
      moment(props.detail?.favDate).format('YYYY-MM-DD')
    )
    const deleteFav = () => favStore.comicFav(props.detail!)
    return {
      showDate,
      toComicMain,
      deleteFav
    }
  }
})
</script>
<style lang="less" scoped>
.comic-fav-card {
  position: relative;
  width: 100%;
  user-select: none;
  transform: perspective(800px);
  transform-style: preserve-3d;
  img {
    width: 100%;
    aspect-ratio: 9/12.7;
    border-radius: 24px;
    transition: all 0.25s;
    cursor: pointer;
  }
  .info {
    padding: 0 4px;
    width: 100%;
    box-sizing: border-box;
    transition: all 0.25s;
    p {
      .p-truncate(1);
      margin-top: 4px;
      margin-bottom: 2px;
      color: var(--font-color);
    }
    span {
      font-size: 14px;
      color: var(--font-unactive-color);
    }
  }
  .tools {
    position: absolute;
    right: 18px;
    top: 18px;
    z-index: 3;
    .tools-icon {
      color: rgba(255, 255, 255, 0.8);
      text-shadow: 0 0 14px rgb(0 0 0 / 44%);
    }
  }
  &:hover {
    img {
      transform: rotateX(10deg) translateY(-10px);
    }
    .info {
      transform: translateY(-10px);
    }
  }
}
</style>
