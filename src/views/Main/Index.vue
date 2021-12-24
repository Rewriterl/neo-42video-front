<template>
  <div class="comic-main">
    <div class="comic-main__inner">
      <div class="comic-main__video">
        <AwVideo :src="player.url" />
      </div>
      <div class="comic-main__box">
        <el-tabs>
          <el-tab-pane label="选集" lazy>
            <div class="comic-main__anthology">
              <div
                v-show="anthology.isPending"
                class="comic-main__anthology-loading"
              ></div>
              <ComicAnthology
                v-for="(item, index) in playlist"
                :key="index"
                :active="anthology.current"
                :label="item.name"
                :list="item.value"
                :bad-anthology="anthology.bads"
                @change="changeAnthology"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane label="详情" lazy>
            {{ comicName }}
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onDeactivated, reactive, ref } from 'vue'
import AwVideo from '@comps/AwVideo/AwVideo.vue'
import ComicAnthology, { Option } from './component/ComicAnthology.vue'
import * as Api from '@apis/index'
import * as Type from './types/index.type'
import { getEl } from '@/utils/adLoadsh'
import { ElNotification } from 'element-plus'

export default defineComponent({
  name: 'ComicMain',
  components: {
    AwVideo,
    ComicAnthology
  },
  props: {
    id: {
      type: [Number, String],
      default: -1
    }
  },
  setup(props) {
    const playlist = ref<Type.Playlist>([])
    const comicName = ref<Type.ComicName>('')
    const anthology = reactive<Type.Anthology>({
      current: '',
      bads: [],
      isPending: false
    })
    const player = reactive({
      url: ''
    })

    const changeAnthology = async ({ value, name }: Option) => {
      anthology.current = value
      anthology.isPending = true

      const notifyTitle = `${comicName.value} - ${name}`
      const notify = ElNotification({
        title: notifyTitle,
        message: '播放地址获取中...',
        type: 'warning',
        duration: 0,
        showClose: false
      })

      const data = await getEl(Api.getVideoUrl.bind(null, value), 5)
      if (!data) {
        anthology.current = ''
        anthology.bads.push(value)
      } else {
        player.url = data
      }

      notify.close()
      ElNotification({
        title: notifyTitle,
        message: data
          ? '地址获取成功，正在载入视频'
          : '地址获取失败，请选择其他播放源',
        type: data ? 'success' : 'error'
      })

      anthology.isPending = false
    }
    const init = async () => {
      if (playlist.value.length > 0) {
        const item = playlist.value[0].value[0]
        anthology.current = item.value
        changeAnthology(item)
      }
    }

    ;(async () => {
      const data = await Api.getComicMain(props.id)
      if (data) {
        playlist.value = data.playlist
        comicName.value = data.title
        init()
      }
    })()

    onDeactivated(() => {
      //
    })

    return {
      playlist,
      comicName,
      changeAnthology,
      anthology,
      player
    }
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
  &__anthology {
    position: relative;
    width: 100%;
    &-loading {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 3;
    }
  }
}
</style>
