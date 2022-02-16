<template>
  <!-- 大坑：由于videojs会在video标签上套一层节点，导致裸video标签时vue无法正常卸载节点 -->
  <div class="video-render">
    <video ref="videoEl" :style="videoStyle" v-bind="$attrs" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  CSSProperties,
  inject,
  ref,
  computed,
  onMounted
} from 'vue'
import videojs from 'video.js'
import * as Type from './type'
import { useEventListener } from '@/utils/vant/useEventListener'

export default defineComponent({
  name: 'VideoRender',
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  emits: {
    initStart: null,
    initSuccessed: null,
    initFailed: null,
    error: (e: any) => e,
    canplay: (e: Event) => e,
    timeupdate: (e: Event) => e,
    ended: (e: Event) => e,
    play: (e: Event) => e,
    pause: (e: Event) => e,
    waiting: (e: Event) => e,
    playing: (e: Event) => e
  },
  setup(props, { emit }) {
    const isDev = inject('isDev')
    const videoInstance = ref<Type.FlvInstance>(null)
    const videoEl = ref<HTMLVideoElement>()

    const videoStyle = computed(
      () =>
        ({
          opacity: isDev ? 0.2 : 1
        } as CSSProperties)
    )

    const play = () => {
      if (videoInstance.value) {
        videoInstance.value.play()
      }
    }
    const pause = () => {
      if (videoInstance.value) {
        videoInstance.value.pause()
      }
    }
    // 此方法会删除video节点 暂时不用
    const destroy = () => {
      videoInstance.value && videoInstance.value.dispose()
    }
    /**
     * 视频地址解析为source格式
     * @param url
     */
    const videoUrlToSource = (url: string) => {
      let type = ''
      const lastKey = url.split('.').pop()
      switch (lastKey) {
        case 'm3u8': {
          type = 'application/x-mpegURL'
          break
        }
        case 'zip': {
          type = 'video/mp4'
          break
        }
        default: {
          type = 'video/' + lastKey
        }
      }
      return {
        src: url,
        type
      }
    }
    const videoInit = (el: HTMLVideoElement, url: string) => {
      if (!url || !el) return
      // player.status = 0
      // el.volume = player.realVolume
      emit('initStart')
      try {
        videoInstance.value = videojs(el, {
          autoplay: true,
          preload: 'auto',
          controls: true,
          sources: [videoUrlToSource(url)]
        })
        emit('initSuccessed')
        videoInstance.value.on('error', (e) => {
          emit('error', e)
          console.log(e)
        })
        return videoInstance.value
      } catch (err) {
        // player.status = -1
        emit('initFailed')
        console.log(err, 'init')
        return null
      }
    }
    const setVolume = (volume: number) => (videoEl.value!.volume = volume)
    const setPlaybackRate = (rate: number) =>
      (videoEl.value!.playbackRate = rate)
    const setCurrentTime = (currentTime: number) =>
      (videoEl.value!.currentTime = currentTime)

    ;(() => {
      const op = {
        target: videoEl
      }
      /** 可播放 监听 */
      useEventListener('canplay', (e) => emit('canplay', e), op)
      /** 进度 监听 */
      useEventListener('timeupdate', (e) => emit('timeupdate', e), op)
      /** 播放结束 监听 */
      useEventListener('ended', (e) => emit('ended', e), op)
      /** 播放 监听 */
      useEventListener('play', (e) => emit('play', e), op)
      /** 暂停 监听 */
      useEventListener('pause', (e) => emit('pause', e), op)
      /** 错误 监听 */
      useEventListener('error', (e) => emit('error', e), op)
      /** 缓冲开始 监听 */
      useEventListener('waiting', (e) => emit('waiting', e), op)
      /** 缓冲结束 监听 */
      useEventListener('playing', (e) => emit('playing', e), op)
    })()

    onMounted(() => {
      videoInit(videoEl.value!, props.src)
    })

    return {
      videoEl,
      videoInstance,
      videoStyle,
      play,
      pause,
      destroy,
      setVolume,
      setPlaybackRate,
      setCurrentTime
    }
  }
})
</script>
<style lang="less" scoped>
.video-render {
  position: relative;
  width: 100%;
  height: 100%;
  & > div,
  video {
    width: 100%;
    height: 100%;
  }
}
</style>
