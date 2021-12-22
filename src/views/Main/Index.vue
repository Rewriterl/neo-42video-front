<template>
  <div class="comic-main">
    <div class="comic-main__inner">
      <div class="comic-main__video">
        <AwVideo
          src="https://kol-fans.fp.ps.netease.com/file/614828e13e68f4b3716769f9UjSiWoB203"
        />
      </div>
      <div class="comic-main__box">
        <el-tabs>
          <el-tab-pane label="详情" lazy>
            简介：海崎新太（27岁）在作为新毕业生进入的公司工作了3个月就辞职了。之后他的就职活动也不顺利。双亲寄来的生活费也中断了，不得已只好回到乡下。能够倾听他烦恼的朋友和女友全都没有……穷途末路的海崎面前出现了一位神秘人物·夜明了。夜明向海崎提出，要他参加以尼特为对象的社会复归程序“ReLIFE”。其内容是，利用神秘的秘药，仅仅让外表回复年轻，并在一年内以高中生的身份去读高中——。
          </el-tab-pane>
          <el-tab-pane label="选集" lazy>
            <ComicAnthology label="播放列表" />
            <ComicAnthology label="播放列表2" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AwVideo from '@comps/Render/AwVideo.vue'
import ComicAnthology from './component/ComicAnthology.vue'
export default defineComponent({
  name: 'ComicMain',
  components: {
    AwVideo,
    ComicAnthology
  },
  setup() {
    return {}
  }
})
</script>
<style lang="less" scoped>
.comic-main {
  @padding: 40px;
  @radius: 24px;
  position: relative;
  width: 100%;
  height: 100%;
  background: var(--box-bg-color);
  border-top-left-radius: 24px;
  overflow-y: auto;
  overflow-x: hidden;
  &__inner {
    width: 90%;
    margin: 0 auto;
  }
  &__video {
    width: 100%;
    margin-top: @padding;
    border-radius: @radius;
    overflow: hidden;
  }
  &__box {
    width: 100%;
    padding: 30px;
    box-sizing: border-box;
    background: var(--bg-color);
    border-radius: @radius;
    color: var(--font-color);
    margin: @padding 0;
    ::v-deep(.el-tabs) {
      .el-tabs__nav-wrap {
        &::after {
          content: unset;
        }
      }
      .el-tabs__nav {
        padding-bottom: 12px;
      }
      .el-tabs__item {
        color: var(--font-unactive-color);
        font-weight: 600;
        font-size: 28px;
        &.is-active {
          color: var(--font-color);
        }
      }
    }
  }
}
</style>
