<template>
  <div id="search">
    <header class="search-header">
      <div class="search-header__search">
        <input type="text" placeholder="Search..." />
        <i></i>
      </div>
      <div class="search-header__else"></div>
    </header>
    <article class="search-filter">
      <AwRadio
        v-for="{ label, key, options } in filterConfig"
        :key="key"
        v-model="filter[key]"
        :label="label"
        :options="options"
      />
    </article>
    <main class="search-main">
      <ComicCard v-for="item in 16" :key="item" />
    </main>
    <el-pagination
      v-model:currentPage="pager.currnet"
      class="search-page"
      :page-size="pager.size"
      layout="prev, pager, next, jumper"
      :total="pager.total"
      @current-change="() => false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'

import AwRadio, { Option } from '@comps/Form/AwRadio.vue'
import ComicCard from './component/ComicCard.vue'

import { SEARCH_FILTER } from './statics/form'

function filterModule() {
  const filter = reactive({
    releaseTime: '',
    status: '',
    cate: '',
    city: ''
  })
  const filterConfig: {
    label: string
    key: keyof typeof filter
    options: Option[]
  }[] = [
    {
      label: '发布时间',
      key: 'releaseTime',
      options: SEARCH_FILTER.RELEASE_TIME
    },
    {
      label: '分类',
      key: 'cate',
      options: SEARCH_FILTER.CATE
    },
    {
      label: '状态',
      key: 'status',
      options: SEARCH_FILTER.STATUS
    },
    {
      label: '发布时间',
      key: 'city',
      options: SEARCH_FILTER.CITY
    }
  ]
  const pager = reactive({
    currnet: 0,
    size: 16,
    total: 100
  })
  return {
    filter,
    filterConfig,
    pager
  }
}
export default defineComponent({
  name: 'Search',
  components: {
    AwRadio,
    ComicCard
  },
  setup() {
    return {
      ...filterModule(),
      SEARCH_FILTER
    }
  }
})
</script>
<style lang="less" scoped>
#search {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .search {
    @radius: 24px;
    .box {
      background: var(--box-bg-color);
    }
    &-header {
      display: flex;
      gap: 26px;
      width: 800px;
      height: 48px;
      // background: #fff;
      &__search {
        position: relative;
        width: 50%;
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
    }
    &-filter {
      .box;
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;
      padding: 16px 30px;
      box-sizing: border-box;
      border-top-left-radius: @radius;
      border-bottom-left-radius: @radius;
    }
    &-main {
      .box;
      flex: 1;
      overflow: hidden;
      border-top-left-radius: @radius;
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      grid-template-rows: repeat(2, 1fr);
      padding: 30px;
      gap: 16px;
      box-sizing: border-box;
    }
    &-page {
      position: absolute;
      left: 0;
      right: 0;
      margin: 0 auto;
      bottom: 6px;
      width: max-content;
      padding: 12px 16px;
      background: #fff;
      border-radius: 15px;
      box-shadow: 0 0 16px rgba(255, 255, 255, 0.1);
      transition: all 0.25s;
      opacity: 0.2;
      transform: translateY(90%);
      &:hover {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }
}
</style>
