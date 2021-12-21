<template>
  <div class="home-section__card">
    <BaseImg src="https://api.adicw.cn/uploads/StudyImg/6141a4ce2715a.png" />
    <div class="info">
      <p>这个是名字</p>
      <span>这是一个普普通通的描述</span>
    </div>
    <div class="else"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'HomeSectionCard',
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
    border-radius: 14px;
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
