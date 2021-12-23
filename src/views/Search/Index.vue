<template>
  <div id="search">
    <header class="search-header">
      <div class="search-header__search">
        <input
          v-model="filter.name"
          type="text"
          placeholder="Search..."
          @keyup.enter="searchByName"
        />
        <Icon name="iconsearch" @click="searchByName" />
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
        @change="searchByFilter"
      />
    </article>
    <main class="search-main">
      <div v-show="isFetchingSearch" class="search-main__loading"></div>
      <div ref="mainContentEl" class="search-main__content">
        <ComicCard v-for="item in searchResult" :key="item.id" :detail="item" />
      </div>
    </main>
    <el-pagination
      v-model:currentPage="pager.currnet"
      class="search-page"
      :page-size="pager.size"
      layout="prev, pager, next, jumper"
      :total="pager.total"
      @current-change="searchByName"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'

import AwRadio, { Option } from '@comps/Form/AwRadio.vue'
import ComicCard from './component/ComicCard.vue'

import { SEARCH_FILTER } from './statics/form'
import * as Api from '@/api'

function filterModule() {
  const filter = reactive({
    name: '',
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
    size: 24,
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
    const mainContentEl = ref<HTMLElement>()
    const searchResult = ref<Api.SearchReturn['data']>([])
    const isFetchingSearch = ref(false)
    const { filter, pager, ...filterModuleArgs } = filterModule()

    const resetFilter = () => {
      pager.currnet = 0
      pager.total = 0
      filter.name = ''
      searchResult.value.splice(0)
    }
    const searchByName = async () => {
      isFetchingSearch.value = true
      mainContentEl.value!.scrollTop = 0
      const { data, total } = await Api.search({
        name: filter.name,
        page: pager.currnet
      })
      searchResult.value = data
      pager.total = total
      isFetchingSearch.value = false
    }
    const searchByFilter = async () => {
      resetFilter()
      //
    }

    return {
      mainContentEl,
      filter,
      pager,
      isFetchingSearch,
      searchResult,
      searchByFilter,
      searchByName,
      ...filterModuleArgs
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
        color: var(--font-color);
        input {
          width: 100%;
          height: 100%;
          background: var(--box-bg-color);
          outline: none;
          border: none;
          text-indent: 20px;
          border-radius: 12px;
          color: var(--font-color);
          font-size: 16px;
        }
        i {
          position: absolute;
          right: 16px;
          top: 0;
          bottom: 0;
          margin: auto 0;
          height: max-content;
          font-size: 20px;
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
      position: relative;
      flex: 1;
      overflow: hidden;
      border-top-left-radius: @radius;
      &__content {
        width: 100%;
        height: 100%;
        padding: 30px;
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        grid-template-rows: repeat(3, 1fr);
        gap: 16px;
        box-sizing: border-box;
        overflow-y: auto;
      }
      &__loading {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 4;
      }
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
