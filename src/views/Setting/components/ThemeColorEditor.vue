<template>
  <div class="themecolor-editor">
    <div
      v-for="item in themes"
      :key="item.prop"
      class="themecolor-editor__item"
    >
      <el-color-picker
        v-model="colors[item.prop]"
        show-alpha
        @change="onColorChanged(item)"
      />
      <span>{{ item.descr }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue'

export interface ThemeColorVar {
  /** 形参或key */
  prop: string
  /** 十六进制颜色值 */
  value: string
  /** css变量名称 */
  var: string
  /** 描述 */
  descr: string
}

export default defineComponent({
  name: 'ThemeColorEditor',
  props: {
    themes: {
      type: Array as PropType<ThemeColorVar[]>,
      default: () => []
    }
  },
  emits: {
    onColorChanged: (param: ThemeColorVar) => true
  },
  setup(props, { emit }) {
    const colors = reactive(
      props.themes.reduce((totol, { prop, value }) => {
        totol[prop] = value
        return totol
      }, {} as { [prop: string]: string })
    )
    const onColorChanged = (param: ThemeColorVar) => {
      if (!colors[param.prop]) return
      const result = {
        ...param,
        value: colors[param.prop]
      }
      emit('onColorChanged', result)
    }
    return {
      colors,
      onColorChanged
    }
  }
})
</script>
<style lang="less" scoped>
.themecolor-editor {
  position: relative;
  width: 100%;
  display: flex;
  gap: 16px;
  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 70px;
    span {
      font-size: 14px;
      margin-top: 10px;
      text-align: center;
    }
  }
}
</style>
