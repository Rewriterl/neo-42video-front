<template>
  <div ref="selfEl" class="aw-video">
    <div class="aw-video__mask" @click="playHandler">
      <Icon
        v-show="player.status === 2"
        class="aw-video__play"
        name="player-fill"
      />
    </div>

    <div class="aw-video__control">
      <AwVideoProgress
        :duration="player.duration"
        :current-time="player.currentTime"
        @timeChange="changeProgress"
        @timePreview="computedPreview"
      >
        <!-- <template #tooltip="{ time }">
          <div class="preview">
            <img :src="player.preview" alt="" />
            <span>{{ time }}</span>
          </div>
        </template> -->
      </AwVideoProgress>
      <Icon
        class="control-icon control-icon__play"
        :name="player.status === 1 ? 'pause' : 'play'"
        @click="playHandler"
      />
      <!-- <i class="control-icon"></i> -->
      <div class="control-time">
        {{ sToMs(player.currentTime) }} <span>/</span>
        {{ sToMs(player.duration) }}
      </div>

      <div
        v-if="quality.length > 0"
        v-click-outside="() => (qualitySelectVisible = false)"
        class="control-quality"
      >
        <span @click="qualitySelectVisible = !qualitySelectVisible">{{
          currentQualityName
        }}</span>
        <ul v-show="qualitySelectVisible">
          <li
            v-for="{ name, value } in quality"
            :key="value"
            :class="{ active: currentQuality === value }"
            @click="changeQuality(value)"
          >
            {{ name }}
          </li>
        </ul>
      </div>
      <Icon
        class="control-icon control-volume"
        :name="player.isMute ? 'mute' : 'volume'"
        @click="volumeCutover"
      >
        <div class="control-volume__inner">
          <el-slider
            v-model="player.volume"
            vertical
            height="100px"
            :show-tooltip="false"
            @change="changeVolume(player.realVolume)"
          />
        </div>
      </Icon>
      <Icon class="control-icon" />
      <Icon class="control-icon" @click="fullScreen" />
    </div>

    <video ref="videoEl" />
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  PropType,
  reactive,
  ref,
  SetupContext,
  watch
} from 'vue'
import flvjs from 'flv.js'
import AwVideoProgress from './AwVideoProgress.vue'
import { fullscreen, sToMs, throttle } from '@/utils/adLoadsh'
import { useEventListener } from '@/utils/vant/useEventListener'
import { getVideoScreenshot } from '@/utils/media'

type FlvInstance = flvjs.Player | null
interface Player {
  /** 当前进度 */
  currentTime: number
  /** 总进度 */
  duration: number
  /** 音量 0-100 */
  volume: number
  /** 实际使用的音量 0-1 */
  realVolume: number
  /** 状态  加载失败 | 加载中 | 播放中 | 暂停中  */
  status: -1 | 0 | 1 | 2
  /** 全屏 */
  fullScreen: boolean
  /** 是否静音 */
  isMute: boolean
  /** 进度预览图 */
  preview: string
}
export interface Quality {
  name: string
  value: string | number
}

function flvModule(player: Player) {
  const flvInstance = ref<FlvInstance>(null)

  const play = () => {
    if (flvInstance.value) {
      flvInstance.value.play()
      player.status = 1
    }
  }
  const pause = () => {
    if (flvInstance.value) {
      flvInstance.value.pause()
      player.status = 2
    }
  }
  const destroy = () => {
    flvInstance.value && flvInstance.value.destroy()
  }
  const addEvent = () => flvInstance.value!.on
  const removeEvent = () => flvInstance.value!.off
  const flvInit = (el: HTMLVideoElement, url: string) => {
    if (!url || !el) return
    player.status = 0
    try {
      flvInstance.value = flvjs.createPlayer({
        type: 'mp4',
        url
      })
      flvInstance.value.attachMediaElement(el)
      flvInstance.value.volume = player.realVolume
      return flvInstance.value
    } catch (err) {
      player.status = -1
      console.log(err, 'init')
    }
  }

  return {
    flvInit,
    play,
    pause,
    destroy,
    addEvent,
    removeEvent,
    flvInstance
  }
}
function qualityModule(quality: Quality[], { emit }: SetupContext) {
  const currentQuality = ref<Quality['value']>(-1)
  const qualitySelectVisible = ref(false)
  const currentQualityName = computed(
    () =>
      quality.find((item) => item.value === currentQuality.value)?.name || '-'
  )

  const changeQuality = (value: Quality['value']) => {
    currentQuality.value = value
    qualitySelectVisible.value = false
    emit('changeQuality', value)
  }

  return {
    currentQuality,
    currentQualityName,
    changeQuality,
    qualitySelectVisible
  }
}

export default defineComponent({
  name: 'AwVideo',
  components: {
    AwVideoProgress
  },
  props: {
    src: {
      type: String,
      default: ''
    },
    quality: {
      type: Array as PropType<Quality[]>,
      default: () => [
        {
          name: '1080p 超清',
          value: 0
        },
        {
          name: '720p 高清',
          value: 1
        },
        {
          name: '自动',
          value: -1
        }
      ]
    }
  },
  setup(props, ctx) {
    const videoEl = ref<HTMLVideoElement>()
    const selfEl = ref<HTMLElement>()

    const player = reactive<Player>({
      currentTime: 0,
      duration: 0,
      status: 0,
      volume: 60,
      get realVolume() {
        return this.volume / 100
      },
      fullScreen: false,
      isMute: false,
      preview: ''
    })
    const { flvInit, destroy, play, pause, ...flvModuleArgs } =
      flvModule(player)

    const init = () => {
      const flv = flvInit(videoEl.value!, props.src)
      if (!flv) return
      flv.load()
      listeners()
    }
    const listeners = () => {
      if (!videoEl.value) return
      /** 可播放监听 */
      videoEl.value.addEventListener('canplay', (e) => {
        const { duration } = e.target as HTMLVideoElement
        player.duration = duration
        player.status = 2
      })
      /** 进度监听 */
      videoEl.value.addEventListener('timeupdate', (e) => {
        const { currentTime } = e.target as HTMLVideoElement
        player.currentTime = currentTime
      })
      /** 结束监听 */
      videoEl.value.addEventListener('end', () => {
        player.status = 2
      })
      /** 暂停监听 */
      videoEl.value.addEventListener('pause', () => {
        player.status = 2
      })
    }
    const playHandler = () => {
      switch (player.status) {
        case 0: {
          break
        }
        case 1: {
          pause()
          break
        }
        case 2: {
          play()
          break
        }
        case -1: {
          break
        }
      }
    }
    const fullScreen = () => {
      player.fullScreen = !player.fullScreen
      fullscreen(selfEl.value!, player.fullScreen ? 'to' : 'exit')
    }
    const volumeCutover = () => {
      player.isMute = !player.isMute
      changeVolume(player.isMute ? 0 : player.realVolume)
    }
    const changeVolume = (val: number) => {
      videoEl.value && (videoEl.value.volume = val)
    }
    const changeProgress = (val: number) => {
      videoEl.value!.currentTime = val
    }
    const computedPreview = throttle(async (val: number) => {
      // player.preview = await getVideoScreenshot(props.src, val)
      // console.log(val, player.preview)
      // todo 画布污染
    }, 2000)

    onMounted(() => {
      init()
    })
    onUnmounted(() => {
      destroy()
    })
    useEventListener('keydown', (e) => {
      // esc
      // if ((e as KeyboardEvent).code === 'Escape') {
      //   player.fullScreen && (player.fullScreen = false)
      // }
    })

    watch(
      () => player.fullScreen,
      (xx) => {
        console.log(xx, 'xx')
      }
    )

    return {
      videoEl,
      selfEl,
      player,
      playHandler,
      sToMs,
      fullScreen,
      volumeCutover,
      changeVolume,
      changeProgress,
      computedPreview,
      ...qualityModule(props.quality, ctx),
      ...flvModuleArgs
    }
  }
})
</script>
<style lang="less" scoped>
.aw-video {
  @controlHeight: 38px;
  position: relative;
  width: 800px;
  aspect-ratio: 16 / 9;
  color: var(--font-unactive-color);
  background: #000;
  &:hover {
    .aw-video__control {
      opacity: 1;
    }
  }
  video {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  &__play {
    position: absolute;
    right: 18px;
    bottom: 10px;
    font-size: 50px;
    cursor: pointer;
    text-shadow: 0 4px 16px rgb(0 0 0 / 25%);
  }
  &__mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100% - @controlHeight);
    z-index: 5;
  }
  &__control {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    align-items: center;
    color: #fff;
    background: #000;
    z-index: 8;
    height: @controlHeight;
    user-select: none;
    transition: all 0.25s;
    opacity: 0;
    .control {
      &-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: @controlHeight;
        height: 100%;
        cursor: pointer;
        font-size: 18px;
        &__play {
          font-size: 24px;
          &.icon-pause {
            font-size: 16px;
          }
        }
      }
      &-time {
        display: flex;
        align-items: center;
        height: 100%;
        margin: 0 20px;
        font-size: 14px;
        line-height: 14px;
        span {
          margin: 0 6px;
        }
      }
      &-quality {
        position: relative;
        margin-left: auto;
        margin-right: 8px;
        width: 100px;
        text-align: center;
        span {
          display: inline-block;
          cursor: pointer;
          font-size: 15px;
          line-height: 8px;
          width: 100%;
          height: 15px;
          font-weight: 500;
        }
        ul {
          position: absolute;
          bottom: @controlHeight;
          left: 0;
          right: 0;
          margin: 0 auto;
          width: 100%;
          padding: 6px 0;
          font-size: 14px;
          color: var(--font-unactive-color);
          background: var(--bg-color);
          border-radius: 14px;
          transition: all 0.25s;
          li {
            cursor: pointer;
            padding: 6px 0;
            transition: all 0.25s;
            &.active {
              color: var(--font-color);
              background: none !important;
            }
            &:hover {
              background: var(--primary-color);
            }
          }
        }
      }
      &-volume {
        &:hover {
          .control-volume__inner {
            opacity: 1;
            transform: translateY(0);
          }
        }
        &__inner {
          position: absolute;
          bottom: calc(@controlHeight);
          padding: 18px 4px;
          background: var(--aside-bg-color);
          border-radius: 24px;
          transition: all 0.25s;
          opacity: 0;
          transform: translateY(160%);
          box-shadow: 0 0 12px rgba(0 0 0 / 0.1);
          ::v-deep(.el-slider) {
            .el-slider__bar {
              background: var(--font-color);
            }
            .el-slider__runway {
              width: 2px;
              background: var(--font-unactive-color);
            }
            .el-slider__bar {
              width: 2px;
            }
            .el-slider__button-wrapper {
              left: calc(var(--el-slider-button-wrapper-offset) - 2px);
            }
            .el-slider__button {
              border-color: var(--font-color);
              transform: scale(0.7);
            }
          }
        }
      }
    }
    .preview {
      position: relative;
      width: 100px;
      height: 50px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      span {
        position: absolute;
        left: 4px;
        bottom: 4px;
        margin: 0 auto;
        font-size: 12px;
      }
    }
  }
}
</style>
