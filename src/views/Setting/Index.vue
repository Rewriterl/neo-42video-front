<template>
  <div id="setting">
    <div class="setting-box setting-themecolor">
      <div class="setting-box__title">主题色配置</div>
      <ThemeColorEditor
        ref="themeColorEditorComp"
        :themes="dfThemes"
        @onColorChanged="onColorChanged"
      />
      <div class="setting-box__control">
        <el-button type="danger" round @click="resetThemeColor">重置</el-button>
        <el-button type="primary" round @click="saveThemeColor">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import { getThemeInstance } from '@/theme/theme.class'

import ThemeColorEditor, {
  ThemeColorVar
} from './components/ThemeColorEditor.vue'
import { ElNotification } from 'element-plus'

function themeColorModule() {
  const themeColorEditorComp = ref<typeof ThemeColorEditor>()
  const dfThemes = getThemeInstance()!.current

  const onColorChanged = (param: ThemeColorVar[]) => {
    getThemeInstance()?.colorVarInit(param)
  }
  const saveThemeColor = () => {
    const theme = themeColorEditorComp.value!.getCurrnetTheme()
    getThemeInstance()?.saveLocalColor(theme)
    ElNotification({
      title: '主题配置',
      message: '主题保存成功',
      type: 'success'
    })
  }
  const resetThemeColor = () => {
    getThemeInstance()?.clearLocalColor()
    themeColorEditorComp.value!.reset()
  }

  return {
    themeColorEditorComp,
    onColorChanged,
    saveThemeColor,
    resetThemeColor,
    dfThemes
  }
}

export default defineComponent({
  name: 'Setting',
  components: {
    ThemeColorEditor
  },
  setup() {
    return {
      ...themeColorModule()
    }
  }
})
</script>
<style lang="less" scoped>
#setting {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .setting-box {
    width: 100%;
    background: var(--box-bg-color);
    padding: 30px;
    box-sizing: border-box;
    border-top-left-radius: 24px;
    border-bottom-left-radius: 24px;
    &__title {
      font-weight: 600;
      font-size: 20px;
      padding-bottom: 20px;
    }
    &__control {
      margin-top: 20px;
    }
  }
  .setting-themecolor {
    // height: 400px;
  }
}
</style>
