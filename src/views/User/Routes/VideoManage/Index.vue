<template>
  <div class="upload-container">
    <el-form>
      <el-form-item label="视频标题">
        <el-input v-model="state.video.title" />
      </el-form-item>
      <el-form-item label="视频简介">
        <el-input v-model="state.video.description" type="textarea" autosize />
      </el-form-item>
      <el-form-item label="投稿类型">
        <el-switch
          v-model="state.type"
          active-text="自制"
          inactive-text="转载"
        />
      </el-form-item>
      <el-form-item label="视频分区">
        <el-input v-model="state.video.area" />
      </el-form-item>
      <el-form-item>
        <el-tag
          v-for="tag in state.video.videoTagList"
          :key="tag"
          class="mx-1"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >
          {{ tag }}
        </el-tag>
        <el-input
          v-if="inputVisible"
          ref="InputRef"
          v-model="inputValue"
          class="ml-1 w-20"
          size="small"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
        />
        <el-button
          v-else
          class="button-new-tag ml-1"
          size="small"
          @click="showInput"
        >
          + 新标签
        </el-button>
      </el-form-item>
      <el-progress
        :text-inside="true"
        :stroke-width="24"
        :percentage="state.percentage"
        status="success"
      />
      <el-form-item>
        <el-upload
          ref="upload"
          drag
          :auto-upload="false"
          :file-list="state.files"
          :on-change="handleChange"
          :on-remove="handleRemove"
          :on-exceed="handleExceed"
        >
          <el-icon class="el-icon--upload">
            <upload-filled />
          </el-icon>
          <div class="el-upload__text">
            Drop file here or <em>click to upload</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              jpg/png files with a size less than 500kb
            </div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit"> 提交 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, reactive, ref } from 'vue'
import { Loading, UploadFilled } from '@element-plus/icons-vue'
import SparkMD5 from 'spark-md5'
import * as Api from '@/api'
import { ElInput, ElNotification, UploadRawFile } from 'element-plus'
import { VideoItem } from '@/api/api.type'

interface IState {
  files: Array<UploadRawFile>
  totalSliceNum: number
  type: boolean
  percentage: number
  video: VideoItem
}

export default defineComponent({
  name: 'UploadFile',
  components: { UploadFilled },
  setup() {
    const chunkSize = 1024 * 1024 * 2
    const inputValue = ref<string>()
    const inputVisible = ref(false)
    const InputRef = ref<InstanceType<typeof ElInput>>()
    const state: IState = reactive({
      files: [],
      totalSliceNum: 0,
      type: false,
      percentage: 0,
      video: {
        url: '',
        thumbnail: '#',
        title: '',
        description: '',
        type: 0,
        area: '',
        duration: 20,
        videoTagList: new Set<string>()
      }
    })

    const type = computed(() => {
      return state.type ? 1 : 0
    })

    // TODO: 之后从后台获取tag列表
    const showInput = () => {
      inputVisible.value = true
      nextTick(() => {
        InputRef.value!.input!.focus()
      })
    }
    const handleInputConfirm = () => {
      if (inputValue.value) {
        if (state.video.videoTagList instanceof Set) {
          state.video.videoTagList.add(inputValue.value)
        }
      }
      inputVisible.value = false
      inputValue.value = ''
    }
    const handleClose = (tag: string) => {
      if (state.video.videoTagList instanceof Set) {
        state.video.videoTagList.delete(tag)
      }
    }
    const getFileHash = (blob: Blob) => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsArrayBuffer(blob)
        reader.onload = (e: any) => {
          const buffer = e.target.result
          let spark = new SparkMD5.ArrayBuffer()
          spark.append(buffer)
          let md5 = spark.end()
          resolve(md5)
        }
      })
    }
    const handleChange = async (file: any) => {
      if (file.status !== 'ready') return
      state.files.push(file)
      if (file) {
        file = file.raw
        const { name, size } = file
        state.totalSliceNum = Math.ceil(size / chunkSize)
        let start = 0
        let index = 0
        let md5: any = ''
        md5 = await getFileHash(file)
        while (start < size) {
          let blob = null
          if (start + chunkSize > size) {
            blob = file.slice(start, size)
          } else {
            blob = file.slice(start, start + chunkSize)
          }
          start += chunkSize
          index++
          let BlobFile = new File([blob], `${name}`)
          let formData = new FormData()
          formData.append('slice', BlobFile)
          formData.append('md5', md5)
          formData.append('sliceNo', index.toString())
          formData.append('totalSliceNum', state.totalSliceNum.toString())
          let data = await Api.sliceUpload(formData)
          if (data.url === '') {
            ElNotification.error({
              title: 'Error',
              message: 'Upload failed'
            })
            return
          }
          state.percentage = Math.floor((index / state.totalSliceNum) * 100)
          if (state.percentage === 100) {
            ElNotification.success({
              title: '上传成功',
              message: '上传成功'
            })
            state.video.url = data.url
          }
        }
      }
    }
    const handleRemove = (file: File) => {
      state.files = []
    }
    const handleExceed = (file: File) => {
      console.log('handleExceed')
    }
    const handleSubmit = () => {
      state.video.type = type.value
      state.video.videoTagList = Array.from(state.video.videoTagList)
      Api.addVideo(state.video)
    }
    return {
      state,
      inputValue,
      inputVisible,
      showInput,
      handleInputConfirm,
      handleClose,
      handleChange,
      handleRemove,
      handleExceed,
      handleSubmit
    }
  }
})
</script>

<style lang="less" scoped>
.upload-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 30px;
  box-sizing: border-box;
  border-top-left-radius: 24px;

  h2 {
    i {
      font-size: 18px;
      cursor: pointer;
    }
  }

  &__content {
    display: grid;
    width: calc(100% - 20px);
    margin-top: 20px;
    grid-template-columns: repeat(var(--playhistory-col-count), 1fr);
    gap: 60px 50px;
    padding: 0 0 40px 20px;

    ::v-deep(.codePen-card) {
      &:hover {
        .cover-info {
          opacity: 1;
        }
      }

      .cover-info {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: all 0.25s;

        .play {
          font-size: 40px;
          text-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
          cursor: pointer;
          color: rgba(255, 255, 255, 0.925);
        }

        .delete {
          position: absolute;
          right: 0;
          top: 0;
          font-size: 20px;
          color: var(--warning-color);
          cursor: pointer;
          font-weight: bold;
          padding: 4px;
          transition: all 0.25s;

          &:hover {
            opacity: 0.3;
          }
        }
      }

      .bad-card {
        color: var(--warning-color);
      }
    }
  }

  &__timeline {
    margin-top: 20px;
  }
}
</style>
