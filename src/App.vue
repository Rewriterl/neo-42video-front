<template>
  <div class="app-contain">
    <AwVideo
      src="https://kol-fans.fp.ps.netease.com/file/617cf57e143cfa9a2065d4eexrIXv1Yk03"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AwVideo from '@comps/Render/AwVideo.vue'

export default defineComponent({
  name: 'Comic',
  components: {
    AwVideo
  },
  setup() {
    //
    return {}
  }
})
</script>
<style lang="less">
#app {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
.app-contain {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
