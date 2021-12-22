<template>
  <div class="comic-main">
    <AwVideo
      src="https://kol-fans.fp.ps.netease.com/file/614828e13e68f4b3716769f9UjSiWoB203"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AwVideo from '@comps/Render/AwVideo.vue'
export default defineComponent({
  name: 'ComicMain',
  components: {
    AwVideo
  },
  setup() {
    return {}
  }
})
</script>
<style lang="less" scoped>
.comic-main {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #333;
}
</style>
