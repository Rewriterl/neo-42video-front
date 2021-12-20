<template>
  <div ref="selfEl" class="aw-video">
    <div class="aw-video__mask" @click="playHandler">
      <div v-show="player.status === 2" class="aw-video__play"></div>
    </div>
    <div class="aw-video__control">
      {{ sToMs(player.currentTime) }} / {{ sToMs(player.duration) }}
      <span @click="fullScreen">全屏</span>
    </div>

    <video ref="videoEl" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch
} from 'vue'
import flvjs from 'flv.js'
import { fullscreen, sToMs } from '@/utils/adLoadsh'
import { useEventListener } from '@/utils/vant/useEventListener'

type FlvInstance = flvjs.Player | null
interface Player {
  /** 当前进度 */
  currentTime: number
  /** 总进度 */
  duration: number
  /** 音量 0-1 */
  volume: number
  /** 状态  加载失败 | 加载中 | 播放中 | 暂停中  */
  status: -1 | 0 | 1 | 2
  /** 全屏 */
  fullScreen: boolean
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
      flvInstance.value.volume = player.volume
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

export default defineComponent({
  name: 'AwVideo',
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const videoEl = ref<HTMLVideoElement>()
    const selfEl = ref<HTMLElement>()

    const player = reactive<Player>({
      currentTime: 0,
      duration: 0,
      status: 0,
      volume: 0.6,
      fullScreen: false
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
      ...flvModuleArgs
    }
  }
})
</script>
<style lang="less" scoped>
.aw-video {
  position: relative;
  width: 800px;
  aspect-ratio: 16 / 9;
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
    right: 16px;
    bottom: 16px;
    width: 40px;
    height: 40px;
    background: #fff;
    cursor: pointer;
  }
  &__mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 80%;
    z-index: 5;
  }
  &__control {
    position: absolute;
    left: 0;
    bottom: 0;
    color: #fff;
    background: #000;
    z-index: 3;
  }
}
</style>
