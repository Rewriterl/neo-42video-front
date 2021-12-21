<template>
  <img v-if="!loaded" :src="BASE_IMG" alt="" />
  <img v-else :src="src" alt="" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { loadImg } from '@/utils/media'

const BASE_IMG = 'https://api.adicw.cn/uploads/StudyImg/6141a4ce2715a.png'

export default defineComponent({
  name: 'BaseImg',
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const loaded = ref(false)
    ;(async () => {
      try {
        await loadImg(props.src)
        loaded.value = true
      } catch {}
    })()
    return {
      loaded,
      BASE_IMG
    }
  }
})
</script>
<style lang="less" scoped>
img {
  object-fit: cover;
}
</style>
