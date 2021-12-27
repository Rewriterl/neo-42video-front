<template>
  <div
    ref="selfDom"
    class="aw-video__progress"
    :class="{ 'aw-video__progress-hide': !hasCurListenlist }"
    @mousemove="onMouseMove"
    @click="changProgress"
  >
    <el-progress
      :percentage="curArea"
      color="#7270fe"
      :show-text="false"
      class="progress"
    />
    <div class="aw-video__progress-tooltip" :style="tooltipStyle">
      <slot name="tooltip" :time="sToMs(tooltipTime)">
        <span>{{ sToMs(tooltipTime) }}</span>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  CSSProperties,
  defineComponent,
  onMounted,
  reactive,
  ref,
  nextTick
} from 'vue'
import { sToMs, wait } from '@/utils/adLoadsh'
import { onWindowSizeChange } from '@/utils/vant/useWindowSize'
export default defineComponent({
  name: 'AwVideoProgress',
  props: {
    duration: {
      type: Number,
      default: 0
    },
    currentTime: {
      type: Number,
      default: 0
    }
  },
  emits: {
    timeChange: (val: number) => true,
    timePreview: (val: number) => true
  },
  setup(props, { emit }) {
    const selfDom = ref<HTMLElement>()

    const self = reactive({
      width: 0
    })
    const mouse = reactive({
      x: 0
    })
    const hasCurListenlist = computed(() => true)
    const curArea = computed(() => {
      const { currentTime, duration } = props
      return currentTime === 0
        ? 0
        : +((currentTime / duration) * 100).toFixed(2)
    })
    const tooltipStyle = computed(() => {
      return {
        transform: `translateX(${mouse.x - 20}px)`
      } as CSSProperties
    })
    const tooltipTime = computed(() => {
      const { duration } = props
      const time = (mouse.x / self.width) * duration
      return time | 0
    })

    const onMouseMove = async (e: MouseEvent) => {
      if (!hasCurListenlist.value) return
      const { offsetX } = e
      mouse.x = offsetX
      await nextTick()
      emit('timePreview', tooltipTime.value)
    }
    const initStyle = async () => {
      await wait(2000)
      self.width = selfDom.value!.clientWidth
    }
    const changProgress = () => {
      if (!hasCurListenlist.value) return
      emit('timeChange', tooltipTime.value)
      // $store.commit('listenTimeHandler', tooltipTime.value)
    }

    onMounted(initStyle)
    onWindowSizeChange(initStyle)

    return {
      curArea,
      onMouseMove,
      tooltipStyle,
      selfDom,
      tooltipTime,
      self,
      changProgress,
      sToMs,
      hasCurListenlist
    }
  }
})
</script>
<style lang="less" scoped>
.aw-video__progress {
  position: absolute;
  top: 0;
  width: 100%;
  cursor: pointer;
  &:hover {
    .aw-video__progress-tooltip {
      opacity: 1;
    }
  }
  ::v-deep(.el-progress) {
    overflow: hidden;
    .el-progress-bar__outer {
      background: #ebeef53d;
      border-radius: 0;
    }
    .el-progress-bar__inner {
      transition: unset;
      border-radius: 0;
    }
  }
  .progress {
    opacity: 1;
    transform: translateY(0);
    transition: all 0.25s;
  }
  &-tooltip {
    position: absolute;
    bottom: 16px;
    left: 0;
    padding: 0 8px;
    background: rgb(0 0 0 / 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    border-radius: 8px;
    opacity: 0;
    transition: opacity 0.25s;
  }
  &-hide {
    cursor: unset;
    .aw-video__progress-tooltip {
      opacity: 0 !important;
    }
    .progress {
      opacity: 0;
      transform: translateY(100px);
    }
  }
}
</style>
