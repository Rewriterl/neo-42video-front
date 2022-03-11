<template>
  <div class="play-history">
    <h2>
      播放历史
      <el-popconfirm
        title="确定清空播放记录嘛？"
        confirm-button-text="确定"
        cancel-button-text="取消"
        @confirm="clearHistory"
      >
        <template #reference>
          <Icon name="delete" />
        </template>
      </el-popconfirm>
    </h2>
    <el-timeline class="play-history__timeline">
      <el-timeline-item
        v-for="(list, date) in timelist"
        :key="date"
        :timestamp="String(date)"
        placement="top"
      >
        <div class="play-history__content">
          <CodepenCard v-for="item in list" :key="item.id" :detail="item">
            <template #cover>
              <div class="cover-info">
                <Icon name="play" @click="toComicMain(item.id)" />
              </div>
            </template>
            <template #desc>
              <span :class="{ 'bad-card': item.status }">{{ item.desc }}</span>
            </template>
          </CodepenCard>
        </div>
      </el-timeline-item>
    </el-timeline>
    <EmptyImgBlock
      v-show="!hasList"
      content="无聊如你"
      src="history-empty.png"
      height="60%"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { toComicMain } from '@/hooks/router'
import { usePlayCacheStore } from '@/stores/playCache.store'

import CodepenCard, {
  Detail as CodepenCardDetail
} from '@comps/Card/CodepenCard.vue'
import EmptyImgBlock from '@comps/Block/EmptyImgBlock.vue'
import moment from 'moment'

export default defineComponent({
  name: 'PlayHistory',
  components: {
    CodepenCard,
    EmptyImgBlock
  },
  setup() {
    const playCacheStore = usePlayCacheStore()
    const hasList = computed(() => playCacheStore.playHistory.length !== 0)
    const timelist = computed(() =>
      playCacheStore.playHistory.reduce<{
        [time: string]: CodepenCardDetail[]
      }>((total, item) => {
        const result = {
          cover: item.cover,
          title: item.name,
          avatar: item.cover,
          desc: item.playEpisode
            ? `${item.playEpisode} ${item.playProgress}`
            : '播放失败',
          tags: [
            {
              icon: 'player',
              content: `最后播放时间：${item.date}`
            }
          ],
          id: item.id,
          status: !Boolean(item.playEpisode)
        }
        const date = moment(item.date).format('YYYY/MM/DD')
        if (total[date]) {
          total[date].push(result)
        } else {
          total[date] = [result]
        }
        return total
      }, {})
    )
    const clearHistory = () => playCacheStore.clearHistory()
    return {
      clearHistory,
      timelist,
      toComicMain,
      hasList
    }
  }
})
</script>
<style lang="less" scoped>
.play-history {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 30px;
  box-sizing: border-box;
  background: var(--box-bg-color);
  border-top-left-radius: 24px;
  h2 {
    i {
      font-size: 18px;
      cursor: pointer;
    }
  }
  &__content {
    display: grid;
    width: calc(100% - 20px);
    margin-top: 20px;
    grid-template-columns: repeat(5, 1fr);
    gap: 60px 50px;
    padding: 0 0 40px 20px;
    ::v-deep(.codePen-card) {
      &:hover {
        .cover-info {
          opacity: 1;
        }
      }
      .cover-info {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: all 0.25s;
        i {
          font-size: 40px;
          text-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
          cursor: pointer;
          color: rgba(255, 255, 255, 0.925);
        }
      }
      .bad-card {
        color: var(--warning-color);
      }
    }
  }
  &__timeline {
    margin-top: 20px;
  }
}
</style>
