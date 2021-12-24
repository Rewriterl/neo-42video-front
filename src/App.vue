<template>
  <div class="app-contain">
    <aside class="app-contain__aside">
      <b>Χαλαρό</b>
      <AppAsideBar />
    </aside>
    <main class="app-contain__main">
      <AppRouter />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import '@/assets/icon/iconfont.css'
import '@/assets/icon/iconfont.js'

import AppAsideBar from '@comps/Body/AppAsideBar.vue'
import AppRouter from '@comps/Body/AppRouter.vue'

export default defineComponent({
  name: 'Comic',
  components: {
    AppAsideBar,
    AppRouter
  },
  setup() {
    return {}
  }
})
</script>
<style lang="less">
@import '~styles/common';
@import '~styles/app';
.app-contain {
  @padding: 40px;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  background: var(--bg-color);
  &__aside {
    display: flex;
    flex-direction: column;
    width: 280px;
    height: calc(100% - @padding*2);
    background: var(--aside-bg-color);
    border-radius: 24px;
    padding-left: @padding;
    box-sizing: border-box;
    transform: translateX(-@padding);
    & > b {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      aspect-ratio: 2/1;
      font-size: 30px;
      color: #fff;
    }
  }
  &__main {
    margin-top: @padding;
    box-sizing: border-box;
    height: calc(100% - @padding);
    flex: 1;
    overflow: hidden;
    position: relative;
  }
}
</style>
