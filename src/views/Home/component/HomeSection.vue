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
      <HomeSectionCard
        v-for="item in currentComic"
        :key="item"
        :detail="item"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue'
import HomeSectionCard from './HomeSectionCard.vue'
import * as Api from '@apis/index'

export default defineComponent({
  name: 'HomeSection',
  components: {
    HomeSectionCard
  },
  setup() {
    type ComicKey = keyof typeof comic

    const comic = reactive<{
      latest: Api.GetLatestComic['data']
      dayUpdates: Api.GetDaysWeek
      hot: any[]
      ranke: any[]
    }>({
      latest: [],
      dayUpdates: [],
      hot: [],
      ranke: []
    })
    const tabs = reactive<{
      active: ComicKey
      list: {
        name: string
        key: ComicKey
      }[]
    }>({
      active: 'latest',
      list: [
        {
          name: '最新更新',
          key: 'latest'
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
    const currentComic = computed(() => comic[tabs.active].slice(0, 5))

    const fetchLatest = async () => {
      const data = await Api.getLatestComic()
      if (data) {
        comic.latest = data.data
      }
    }
    // const fetchDaysWeek = async () => {
    //   const data = await Api.getDaysWeek()
    //   if (data) {
    //     comic.dayUpdates = data
    //   }
    // }
    const changeTab = (key: ComicKey) => {
      tabs.active = key
    }

    ;(() => {
      fetchLatest()
      // fetchDaysWeek()
    })()

    return {
      tabs,
      changeTab,
      currentComic
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
