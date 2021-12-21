<template>
  <section class="home-section">
    <div class="home-section__header">
      <ul class="home-section__tabs">
        <li
          v-for="{ name, key } in tabs.list"
          :key="key"
          :class="{ active: key === tabs.active }"
          @click="changeTab(key)"
        >
          {{ name }}
        </li>
      </ul>
    </div>
    <div class="home-section__main">
      <HomeSectionCard v-for="item in 5" :key="item" />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import HomeSectionCard from './HomeSectionCard.vue'

export default defineComponent({
  name: 'HomeSection',
  components: {
    HomeSectionCard
  },
  setup() {
    const tabs = reactive({
      active: 'new',
      list: [
        {
          name: '最新更新',
          key: 'new'
        },
        {
          name: '热门',
          key: 'hot'
        },
        {
          name: '排行',
          key: 'ranke'
        }
      ]
    })
    const changeTab = (key: string) => {
      tabs.active = key
    }
    return {
      tabs,
      changeTab
    }
  }
})
</script>
<style lang="less" scoped>
@import '../style/home-main';
.home-section {
  .up-block;
  &__header {
    .up-block-header;
  }
  &__main {
    .up-block-main;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  &__tabs {
    display: flex;
    width: 100%;
    height: 100%;
    color: var(--font-unactive-color);
    li {
      display: flex;
      align-items: center;
      padding: 0 20px;
      height: 100%;
      transition: all 0.25s;
      border-radius: 8px;
      user-select: none;
      cursor: pointer;
      &.active {
        color: var(--font-color);
        background: var(--bg-color);
      }
    }
  }
}
</style>
