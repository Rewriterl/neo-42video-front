<template>
  <div class="app-contain">
    <AwVideo
      v-if="false"
      src="https://kol-fans.fp.ps.netease.com/file/614828e13e68f4b3716769f9UjSiWoB203"
    />
    <aside class="app-contain__aside">
      <b>Χαλαρό</b>
      <AppAsideBar />
    </aside>
    <main class="app-contain__main">
      <router-view v-slot="{ Component }">
        <!-- <transition :name="transitionName"> -->
        <keep-alive>
          <component :is="Component" v-bind="$attrs" />
        </keep-alive>
        <!-- </transition> -->
      </router-view>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AwVideo from '@comps/Render/AwVideo.vue'
import AppAsideBar from '@comps/Body/AppAsideBar.vue'

export default defineComponent({
  name: 'Comic',
  components: {
    AwVideo,
    AppAsideBar
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
    padding-top: @padding;
    box-sizing: border-box;
    height: 100%;
    flex: 1;
    overflow: hidden;
  }
}
</style>
