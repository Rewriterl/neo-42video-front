<template>
  <div id="home">
    <header class="home-header">
      <div class="home-header__search">
        <input type="text" placeholder="Search..." />
        <i></i>
      </div>
      <div class="home-header__else"></div>
    </header>
    <main class="home-main">
      <HomeBanner />
      <HomeSection />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HomeBanner from './component/HomeBanner.vue'
import HomeSection from './component/HomeSection.vue'

export default defineComponent({
  name: 'Home',
  components: {
    HomeBanner,
    HomeSection
  },
  setup() {
    return {}
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
        }
        i {
          position: absolute;
          right: 14px;
          top: 0;
          bottom: 0;
          margin: auto 0;
          width: 26px;
          height: 26px;
          background: #fff;
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
