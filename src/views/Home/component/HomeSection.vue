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
    <TransUl tag="div" class="home-section__main">
      <div v-for="item in currentComic" :key="item.id">
        <HomeSectionCard :detail="item" />
      </div>
    </TransUl>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue'
import HomeSectionCard from './HomeSectionCard.vue'
import TransUl from '@comps/Animate/TransUl.vue'
import * as Api from '@apis/index'
import * as Type from '../types/homeSection.type'

export default defineComponent({
  name: 'HomeSection',
  components: {
    HomeSectionCard,
    TransUl
  },
  setup() {
    type ComicKey = keyof typeof comic

    const comic = reactive<Type.Comic>({
      // perday: [],
      perweek: [],
      latest: []
    })
    const tabs = reactive<Type.Tabs<ComicKey>>({
      active: 'latest',
      list: [
        {
          name: '最新更新',
          key: 'latest'
        },
        // {
        //   name: '日排行',
        //   key: 'perday'
        // },
        {
          name: '周排行',
          key: 'perweek'
        }
      ]
    })
    const currentComic = computed(() => {
      return {
        latest: comic.latest.slice(0, 5).map((item) => ({
          cover: item.cover,
          title: item.title,
          id: item.id,
          desc: item.season
        })),
        perweek: comic.perweek.slice(0, 5).map((item) => ({
          cover: item.cover,
          title: item.title,
          id: item.id,
          desc: item.status
        }))
      }[tabs.active]
    })

    const changeTab = (key: ComicKey) => {
      tabs.active = key
    }

    ;(async () => {
      const data = await Api.getHomeMixData()
      if (data) {
        const { perday, perweek, latest } = data
        // comic.perday = perday
        comic.perweek = perweek
        comic.latest = latest
      }
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
    & > div {
      flex: 1;
      overflow: hidden;
    }
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
