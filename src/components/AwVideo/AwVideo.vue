<template>
  <div ref="selfEl" class="aw-video">
    <div class="aw-video__mask" :class="{ disable: !src }" @click="playHandler">
      <Icon
        v-show="player.status === 2"
        class="aw-video__play"
        name="player-fill"
      />
    </div>
    <div v-show="player.status === 0" class="aw-video__loading">
      <LoadingBlockRun />
    </div>
    <div v-show="isBad" class="aw-video__bad">
      <img src="~static/img/video-bad.png" />
      <span>加载失败了，好耶！</span>
    </div>
    <div v-if="!src" class="aw-video__bad">
      <img src="~static/img/video-empty.png" />
      <span>暂无播放内容~</span>
    </div>

    <div class="aw-video__control">
      <AwVideoProgress
        :duration="player.duration"
        :current-time="player.currentTime"
        @timeChange="changeProgress"
        @timePreview="computedPreview"
      >
        <template #tooltip="{ time }">
          <div class="preview">
            <img v-if="player.preview" :src="player.preview" />
            <span>{{ time }}</span>
          </div>
        </template>
      </AwVideoProgress>
      <Icon
        class="control-icon control-icon__play"
        :name="player.status === 1 ? 'pause' : 'play'"
        @click="playHandler"
      />
      <!-- <i class="control-icon"></i> -->
      <div class="control-time">
        {{ sToMs(player.currentTime) }}
        <span>/</span>
        {{ sToMs(player.duration) }}
      </div>

      <div
        v-if="quality.length > 0"
        v-click-outside="() => (qualitySelectVisible = false)"
        class="control-quality"
      >
        <span @click="qualitySelectVisible = !qualitySelectVisible">
          {{ currentQualityName }}
        </span>
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
      <div class="control-icon control-volume">
        <Icon
          :name="player.isMute ? 'mute' : 'volume'"
          @click="volumeCutover"
        />
        <div class="control-volume__inner">
          <el-slider
            v-model="player.volume"
            vertical
            height="100px"
            :show-tooltip="false"
            @change="changeVolume(player.realVolume)"
          />
        </div>
      </div>
      <!-- <Icon class="control-icon" /> -->
      <Icon
        class="control-icon"
        :name="player.fullScreen ? 'exit-full-screen' : 'full-screen'"
        @click="fullScreen"
      />
    </div>
    <AwVideoMsg ref="awVideoMsgComp" />
    <video ref="videoEl" v-bind="$attrs" :mute="mute" />
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onDeactivated,
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
import LoadingBlockRun from '@comps/Loading/LoadingBlockRun.vue'
import AwVideoMsg, { NotifyItem } from './AwVideoMsg.vue'

import { debounce, fullscreen, sToMs } from '@/utils/adLoadsh'
import { useEventListener } from '@/utils/vant/useEventListener'
import { getVideoScreenshot } from '@/utils/media'

import * as Type from './type'

export * from './type'

type Ctx = SetupContext<('canplay' | 'changeQuality' | 'ended')[]>

function flvModule(player: Type.Player) {
  const flvInstance = ref<Type.FlvInstance>(null)

  const play = () => {
    if (flvInstance.value) {
      flvInstance.value.play()
    }
  }
  const pause = () => {
    if (flvInstance.value) {
      flvInstance.value.pause()
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
      return null
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

function qualityModule(quality: Type.Quality[], { emit }: Ctx) {
  const currentQuality = ref<Type.Quality['value']>(-1)
  const qualitySelectVisible = ref(false)
  const currentQualityName = computed(
    () =>
      quality.find((item) => item.value === currentQuality.value)?.name || '-'
  )

  const changeQuality = (value: Type.Quality['value']) => {
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
    AwVideoProgress,
    LoadingBlockRun,
    AwVideoMsg
  },
  inheritAttrs: true,
  props: {
    src: {
      type: String,
      default: ''
    },
    quality: {
      type: Array as PropType<Type.Quality[]>,
      default: () => []
      // [
      //   {
      //     name: '1080p 超清',
      //     value: 0
      //   },
      //   {
      //     name: '720p 高清',
      //     value: 1
      //   },
      //   {
      //     name: '自动',
      //     value: -1
      //   }
      // ]
    },
    mute: {
      type: Boolean,
      default: false
    }
  },
  emits: ['canplay', 'changeQuality', 'ended'],
  setup(props, ctx) {
    const awVideoMsgComp = ref<typeof AwVideoMsg>()
    const videoEl = ref<HTMLVideoElement>()
    const selfEl = ref<HTMLElement>()

    const player = reactive<Type.Player>({
      currentTime: 0,
      duration: 0,
      status: -2,
      volume: 60,
      get realVolume() {
        return this.volume / 100
      },
      fullScreen: false,
      isMute: props.mute,
      preview: '',
      isListened: false
    })
    const { flvInit, destroy, play, pause, ...flvModuleArgs } =
      flvModule(player)

    const isBad = computed(() => player.status === -1)

    const init = (url: string) => {
      if (!url) return
      destroy()
      const flv = flvInit(videoEl.value!, url)
      if (!flv) return
      flv.load()
      player.status = 2
      ctx.emit('canplay', flv)
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
      player.isMute = val === 0
      videoEl.value && (videoEl.value.volume = val)
    }
    const changeProgress = (val: number) => {
      videoEl.value!.currentTime = val
    }
    const computedPreview = debounce(async (val: number) => {
      player.preview = await getVideoScreenshot(props.src, val)
    }, 300)
    const notify = (item: NotifyItem) => {
      awVideoMsgComp.value!.notify(item)
    }

    ;(() => {
      const op = {
        target: videoEl
      }
      /** 可播放 监听 */
      useEventListener(
        'canplay',
        (e) => {
          const { duration } = e.target as HTMLVideoElement
          player.duration = duration
          notify({
            content: '电波获取完成~',
            duration: 3000
          })
        },
        op
      )
      /** 进度 监听 */
      useEventListener(
        'timeupdate',
        (e) => {
          const { currentTime } = e.target as HTMLVideoElement
          player.currentTime = currentTime
        },
        op
      )
      /** 播放结束 监听 */
      useEventListener(
        'ended',
        () => {
          player.status = 2
          notify({
            content: '本集已播放完成~',
            duration: 5000
          })
          ctx.emit('ended')
        },
        op
      )
      /** 播放 监听 */
      useEventListener(
        'play',
        () => {
          player.status = 1
        },
        op
      )
      /** 暂停 监听 */
      useEventListener(
        'pause',
        () => {
          player.status = 2
        },
        op
      )
      /** 错误 监听 */
      useEventListener(
        'error',
        (e) => {
          console.log('error', e)
          notify({
            content: '视频加载错误，emmm~',
            duration: 5000
          })
        },
        op
      )
      /** 缓冲开始 监听 */
      useEventListener(
        'waiting',
        () => {
          player.status = 0
          notify({
            content: '电波获取中，请稍后~',
            duration: 3000
          })
        },
        op
      )
      /** 缓冲结束 监听 */
      useEventListener(
        'playing',
        () => {
          player.status = 1
        },
        op
      )
      player.isListened = true
    })()
    onMounted(() => {
      init(props.src)
    })
    onUnmounted(() => {
      destroy()
    })
    onDeactivated(() => {
      player.isListened = false
    })
    watch(() => props.src, init)

    // useEventListener('keydown', (e) => {
    // esc
    // if ((e as KeyboardEvent).code === 'Escape') {
    //   player.fullScreen && (player.fullScreen = false)
    // }
    // })

    // watch(
    //   () => player.fullScreen,
    //   (xx) => {
    //     console.log(xx, 'xx')
    //   }
    // )

    return {
      videoEl,
      selfEl,
      awVideoMsgComp,
      player,
      playHandler,
      sToMs,
      fullScreen,
      volumeCutover,
      changeVolume,
      changeProgress,
      computedPreview,
      isBad,
      notify,
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
  width: 100%;
  aspect-ratio: 16 / 9;
  color: var(--font-unactive-color);
  background: #000;
  overflow: hidden;
  video {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  .mask(@height: 100%) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: @height;
  }
  &__play {
    position: absolute;
    right: 30px;
    bottom: 16px;
    font-size: 50px;
    cursor: pointer;
    text-shadow: 0 4px 16px rgb(0 0 0 / 25%);
  }
  &__mask {
    .mask(calc(100% - @controlHeight - 10px));
    z-index: 2;
  }
  &__bad {
    .mask;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 16;
    img {
      width: 100px;
    }
    span {
      font-weight: 600;
      font-size: 20px;
      margin-top: 30px;
    }
    &::after {
      content: '';
      .mask;
    }
  }
  &__loading {
    .mask;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 15;
    background: rgb(0 0 0 / 25%);
    span {
      margin-top: 30px;
    }
  }
  &__control {
    @padding: 16px;
    position: absolute;
    left: 0;
    bottom: 0;
    margin: 0 @padding;
    padding-top: 6px;
    margin-bottom: 12px;
    width: calc(100% - @padding*2);
    display: flex;
    align-items: center;
    color: #fff;
    background: rgba(0, 0, 0, 0.5);
    z-index: 8;
    height: @controlHeight;
    user-select: none;
    transition: all 0.25s;
    opacity: 0;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;

    &:hover {
      opacity: 1;
    }
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
        margin-left: auto;
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
