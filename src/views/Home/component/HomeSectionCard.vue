<template>
  <div v-if="detail" class="home-section__card">
    <BaseImg :src="detail.cover" />
    <div class="info">
      <p>{{ detail.title }}</p>
      <span>{{ detail.season }}</span>
    </div>
    <div class="else"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import * as Api from '@apis/index'

export default defineComponent({
  name: 'HomeSectionCard',
  props: {
    detail: {
      type: Object as PropType<Api.GetLatestComic['data'][0] | null>,
      default: null
    }
  },
  setup() {
    return {}
  }
})
</script>
<style lang="less" scoped>
.home-section__card {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  overflow: hidden;
  background: var(--bg-color);
  border-radius: 12px;
  cursor: pointer;
  border: 2px solid rgba(0, 0, 0, 0);
  transition: all 0.25s;
  padding: 12px;
  box-sizing: border-box;
  &:hover {
    border-color: var(--primary-color);
  }
  img {
    height: 100%;
    aspect-ratio: 1/1;
    border-radius: 10px;
  }
  .info {
    flex: 1;
    padding-left: 12px;
    box-sizing: border-box;
    overflow: hidden;
    p {
      color: var(--font-color);
    }
    span {
      font-size: 14px;
      color: var(--font-unactive-color);
    }
  }
}
</style>
