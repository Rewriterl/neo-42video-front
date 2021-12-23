<template>
  <div v-if="detail" class="comic-card" @click="toComicMain(detail!.id)">
    <BaseImg :src="detail.cover" />
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
      type: Object as PropType<Api.SearchReturn['data'][0] | null>,
      default: null
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
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
  img {
    width: 80%;
    aspect-ratio: 1/1.4;
    border-radius: 6px;
    background: #def;
  }
  .info {
    flex: 1;
    display: flex;
    align-items: center;
    overflow: hidden;
    color: var(--font-color);
    text-align: center;
    font-size: 14px;
    height: 28px;
    margin: 8px 0;
    .p-truncate(2);
  }
}
</style>
