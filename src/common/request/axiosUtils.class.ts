import router from '@/router'
import { AxiosInstance } from 'axios'
import { ElNotification } from 'element-plus'
import { useUserStore } from '@/stores/user.store'
/**
 * axios辅助函数
 */
export default class AxiosUtils {
  private instance: AxiosInstance | null = null
  constructor(instance: AxiosInstance) {
    this.instance = instance
    this.response()
    this.request()
  }
  /**
   * 响应拦截器
   */
  private response() {
    if (this.instance === null) return
    this.instance.interceptors.response.use(
      (response) => {
        // store.state.loading = true
        if (response.data.msg != '') {
          {
            ElNotification({
              type: 'info',
              title: '通知',
              message: response.data.msg
            })
          }
        }
        return response
      },
      (error) => {
        const status = error.toString()
        if (
          [
            'timeout ',
            'Invalid URL',
            '401',
            '403',
            '404',
            'Network Error'
          ].some((item) => status.includes(item))
        ) {
          // store.dispatch('logout')
          ElNotification({
            type: 'error',
            title: '资源获取错误',
            message: '请求源存在问题，请检查或修改 服务器地址'
          })
          router.push({ name: 'Setting' })
        }
        return Promise.reject()
      }
    )
  }
  /**
   * 请求拦截器
   */
  private request() {
    if (this.instance === null) return
    this.instance.interceptors.request.use((request) => {
      // store.state.loading = false
      const token = useUserStore().userAccessToken
      if (token.length > 7) {
        request.headers['Authorization'] = token
      }
      return request
    })
  }
}
