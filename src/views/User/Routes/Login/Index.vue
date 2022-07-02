<template>
  <BotLoad class="play-history" :data="timelist" :perpage="3">
    <h1>登录</h1>
  </BotLoad>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

import BotLoad from '@/components/Container/BotLoad.vue'

export default defineComponent({
  name: 'PlayHistory',
  components: {
    BotLoad
  },
  setup() {
    return {}
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
    grid-template-columns: repeat(var(--playhistory-col-count), 1fr);
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

        .play {
          font-size: 40px;
          text-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
          cursor: pointer;
          color: rgba(255, 255, 255, 0.925);
        }

        .delete {
          position: absolute;
          right: 0;
          top: 0;
          font-size: 20px;
          color: var(--warning-color);
          cursor: pointer;
          font-weight: bold;
          padding: 4px;
          transition: all 0.25s;

          &:hover {
            opacity: 0.3;
          }
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
