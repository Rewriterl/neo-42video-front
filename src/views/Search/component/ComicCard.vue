<template>
  <div class="comic-card" @click="$router.push({ name: 'ComicMain' })">
    <BaseImg />
    <div class="info">从零开始的异世界生活</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ComicCard',
  setup() {
    return {}
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
  }
  .info {
    flex: 1;
    display: flex;
    align-items: center;
    overflow: hidden;
    color: var(--font-color);
    text-align: center;
  }
}
</style>
