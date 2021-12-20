<template>
  <div class="aw-video" @click="play">
    <video ref="videoEl" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import flvjs from 'flv.js'

function flvModule() {
  const flvInstance = ref<flvjs.Player | null>(null)
  const flvInit = (el: HTMLVideoElement, url: string) => {
    if (!url || !el) return
    flvInstance.value = flvjs.createPlayer({
      type: 'mp4',
      url
    })
    flvInstance.value.attachMediaElement(el)
    flvInstance.value.load()
  }
  const play = () => flvInstance.value && flvInstance.value.play()
  return {
    flvInit,
    play,
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
    const { flvInit, ...flvModuleArgs } = flvModule()

    onMounted(() => {
      flvInit(videoEl.value!, props.src)
    })
    return {
      videoEl,
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
    width: 100%;
    height: 100%;
  }
}
</style>
