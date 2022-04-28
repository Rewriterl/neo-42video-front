<template>
  <div class="aw-tab">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
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
    return {}
  }
})
</script>
<style lang="less" scoped>
.aw-tab {
  flex: 1;
  overflow: hidden;
}
</style>
