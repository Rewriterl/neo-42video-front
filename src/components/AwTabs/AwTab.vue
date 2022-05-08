<template>
  <div v-if="loaded" class="aw-tab">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useParent } from '@/utils/vant/useRelation'
import { AWTABS_KEY } from './static'
export default defineComponent({
  name: 'AwTab',
  props: {
    title: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  setup() {
    useParent(AWTABS_KEY)
    const loaded = ref(false)

    const changeLoaded = (res: boolean) => {
      loaded.value = res
    }

    return {
      loaded,
      changeLoaded
    }
  }
})
</script>
<style lang="less" scoped>
.aw-tab {
  flex: 1;
  overflow: hidden;
}
</style>
