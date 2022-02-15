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
    <div class="play-history__content">
      <div
        v-for="item in list"
        :key="item.id"
        class="card"
        @click="toComicMain(item.id)"
      >
        <BaseImg :src="item.cover" />
        <div class="card-info">
          <el-tooltip :content="item.name" placement="top">
            <p>{{ item.name }}</p>
          </el-tooltip>
          <p>
            <a v-if="item.playEpisode">{{
              `${item.playEpisode} ${item.playProgress}`
            }}</a>
            <a v-else class="bad">播放失败</a>
            （{{ item.date }}）
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { toComicMain } from '@/hooks/router'
import { usePlayCacheStore } from '@/stores/playCache.store'

export default defineComponent({
  name: 'PlayHistory',
  setup() {
    const playCacheStore = usePlayCacheStore()
    const list = computed(() => playCacheStore.playHistory)
    const clearHistory = () => playCacheStore.clearHistory()
    return {
      clearHistory,
      list,
      toComicMain
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
    display: flex;
    width: 100%;
    justify-content: flex-start;
    gap: 30px 1.6%;
    flex-wrap: wrap;
    margin-top: 20px;
    .card {
      position: relative;
      width: 15%;
      max-width: 400px;
      min-width: 200px;
      aspect-ratio: 2/1.2;
      overflow: hidden;
      border-radius: 8px;
      // box-shadow: 0 16px 28px #00000042;
      cursor: pointer;
      transition: all 0.25s;
      &:hover {
        transform: translateY(-10%) scale(1.1);
        img {
          filter: brightness(0.6);
        }
      }
      img {
        width: 100%;
        height: 100%;
        transition: all 0.25s;
      }
      &-info {
        position: absolute;
        left: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        padding: 4px 10px;
        box-sizing: border-box;
        background: rgba(179, 167, 167, 0.451);
        backdrop-filter: blur(20px);
        border-radius: 8px;
        overflow: hidden;
        transition: all 0.25s;
        p {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.95);
          text-align: center;
          &:first-child {
            .p-truncate;
          }
          &:last-child {
            transform: scale(0.9);
            color: rgba(255, 255, 255, 0.7);
            font-size: 12px;
          }
          span {
            display: block;
          }
        }
        .bad {
          color: var(--warning-color);
          font-weight: 800;
        }
      }
    }
  }
}
</style>
