<template>
  <div id="setting">
    <div class="setting-box setting-themecolor">
      <div class="setting-box__title">主题色配置</div>
      <ThemeColorEditor
        :themes="DF_SYSTEM_COLOR"
        @onColorChanged="onColorChanged"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { DF_SYSTEM_COLOR } from '@/theme/static'
import { getThemeInstance } from '@/theme/theme.class'
import ThemeColorEditor, {
  ThemeColorVar
} from './components/ThemeColorEditor.vue'

export default defineComponent({
  name: 'Setting',
  components: {
    ThemeColorEditor
  },
  setup() {
    const onColorChanged = (param: ThemeColorVar) => {
      getThemeInstance()?.colorVarInit([param])
    }
    return {
      DF_SYSTEM_COLOR,
      onColorChanged
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
  }
  .setting-themecolor {
    height: 400px;
  }
}
</style>
