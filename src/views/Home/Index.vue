<template>
  <div id="home">
    <header class="home-header">
      <div
        class="home-header__search"
        @click="$router.push({ name: 'Search' })"
      >
        <input type="text" placeholder="请输入搜索关键字..." disabled />
        <Icon name="iconsearch" />
      </div>
      <div class="home-header__else"></div>
    </header>
    <main class="home-main">
      <HomeBanner :is-init="isInit" :banner="comic.banner" />
      <HomeSection
        :is-init="isInit"
        :hots="comic.hots"
        :latest="comic.latest"
      />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import HomeBanner from './component/HomeBanner.vue'
import HomeSection from './component/HomeSection.vue'
import * as Api from '@apis/index'
import * as Type from './types/homeSection.type'

export default defineComponent({
  name: 'Home',
  components: {
    HomeBanner,
    HomeSection
  },
  setup() {
    const isInit = ref(false)
    const comic = reactive<Type.Comic>({
      // perday: [],
      hots: [],
      latest: [],
      banner: []
    })

    ;(async () => {
      const data = await Api.getHomeMixData()
      if (data) {
        const { hots, latest, banner } = data
        comic.banner = banner
        comic.hots = hots
        comic.latest = latest
        isInit.value = true
      }
    })()

    return {
      comic,
      isInit
    }
  }
})
</script>
<style lang="less" scoped>
#home {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .home {
    &-header {
      display: flex;
      gap: 26px;
      width: 100%;
      height: 48px;
      // background: #fff;
      &__search {
        position: relative;
        flex: 1;
        input {
          width: 100%;
          height: 100%;
          background: var(--box-bg-color);
          outline: none;
          border: none;
          color: var(--font-color);
          text-indent: 20px;
          border-radius: 12px;
          cursor: pointer;
        }
        i {
          position: absolute;
          right: 14px;
          top: 0;
          bottom: 0;
          margin: auto 0;
          font-size: 22px;
          height: max-content;
          color: var(--font-color);
        }
      }
      &__else {
        flex: 1;
      }
    }
    &-main {
      flex: 1;
      overflow: hidden;
      background: var(--box-bg-color);
      border-top-left-radius: 24px;
      display: grid;
      grid-template-columns: 2fr 1fr;
      grid-template-rows: 2fr 1fr;
      gap: 40px;
      padding: 30px 50px;
      box-sizing: border-box;
    }
  }
}
</style>
