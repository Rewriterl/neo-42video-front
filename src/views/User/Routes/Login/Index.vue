<template>
  <div class="login-container">
    <el-form
      ref="form"
      :model="state.form"
      :rules="rules"
      label-width="80px"
      class="login-form"
    >
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="state.form.username"
          size="large"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="state.form.password"
          type="password"
          size="large"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button round type="primary" @click="doLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from 'vue'
import * as Api from '@/api'
import { JSEncrypt } from 'jsencrypt'
import { ElNotification } from 'element-plus'
import { useUserStore } from '@/stores/user.store'

export default defineComponent({
  name: 'Login',
  setup() {
    onMounted(() => {
      Api.getRsaPub().then((res) => {
        state.rsaPub = res
      })
    })
    const state = reactive({
      form: {
        username: '',
        password: ''
      },
      rsaPub: ''
    })
    const rules = {
      username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
      password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
    }
    const doLogin = () => {
      const jse = new JSEncrypt()
      jse.setPublicKey(state.rsaPub)
      const encryptedPassword = jse.encrypt(state.form.password)
      if (encryptedPassword) {
        // 表单验证后提交
        Api.login(state.form.username, encryptedPassword).then((res) => {
          useUserStore().saveUser({
            ...res
          })
        })
      } else {
        ElNotification.error({
          title: '错误',
          message: '登录失败'
        })
      }
    }
    return {
      state,
      rules,
      doLogin
    }
  }
})
</script>
<style lang="less" scoped>
.login-container {
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
