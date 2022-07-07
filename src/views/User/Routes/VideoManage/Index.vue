<template>
  <div class="upload-container">
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
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { Loading, UploadFilled } from '@element-plus/icons-vue'
import SparkMD5 from 'spark-md5'
import * as Api from '@/api'
import { ElNotification, UploadRawFile } from 'element-plus'

interface IState {
  files: Array<UploadRawFile>
  totalSliceNum: number
}

export default defineComponent({
  name: 'UploadFile',
  components: { UploadFilled },
  setup() {
    const chunkSize = 1024 * 1024 * 2
    const state: IState = reactive({
      files: [],
      totalSliceNum: 0
    })

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
        while (start < size) {
          let blob = null
          let md5: any = ''
          if (start + chunkSize > size) {
            blob = file.slice(start, size)
          } else {
            blob = file.slice(start, start + chunkSize)
          }
          md5 = await getFileHash(blob)
          start += chunkSize
          index++
          let BlobFile = new File([blob], `${name}-${index}`)
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
          // for (var pair of formData.entries()) {
          //   console.log(pair[0] + ', ' + pair[1])
          // }
        }
      }
    }
    const handleRemove = (file: File) => {
      state.files = []
    }
    const handleExceed = (file: File) => {
      console.log('handleExceed')
    }
    return {
      state,
      handleChange,
      handleRemove,
      handleExceed
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
