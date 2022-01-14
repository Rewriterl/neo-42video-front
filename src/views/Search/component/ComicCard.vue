<template>
  <div v-if="detail" class="comic-card" @click="toComicMain(detail!.id)">
    <div class="cover">
      <BaseImg :src="detail.cover" />
    </div>
    <div class="info">{{ detail.title }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import * as Api from '@/api'
import { toComicMain } from '@/hooks/router'
export default defineComponent({
  name: 'ComicCard',
  props: {
    detail: {
      type: Object as PropType<Api.SearchComicReturn['data'][0] | null>,
      default: null
    },
    size: {
      type: Number,
      default: 8
    }
  },
  setup() {
    return {
      toComicMain
    }
  }
})
</script>
<style lang="less" scoped>
.comic-card {
  position: relative;
  width: calc(100% / v-bind(size));
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
  padding: 6px 12px;
  box-sizing: border-box;
  &:hover {
    .cover {
      filter: brightness(0.5);
    }
  }
  .cover {
    flex: 1;
    width: 100%;
    aspect-ratio: 1/1.4;
    border-radius: 6px;
    overflow: hidden;
    transition: all 0.25s;
    img {
      width: 100%;
      height: 100%;
      background: #def;
      transition: all 0.25s;
    }
  }

  .info {
    display: flex;
    align-items: center;
    overflow: hidden;
    color: var(--font-color);
    text-align: center;
    font-size: 14px;
    height: 36px;
    margin: 8px 0;
    .p-truncate(2);
  }
}
</style>
