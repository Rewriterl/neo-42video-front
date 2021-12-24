// import store from '@/store/index'
// import { AxiosInstance } from 'axios'
// /**
//  * axios辅助函数
//  */
// export default class AxiosUtils {
//   private instance: AxiosInstance | null = null
//   constructor(instance: AxiosInstance) {
//     this.instance = instance
//     this.response()
//     this.request()
//   }
//   /**
//    * 获取token
//    * @returns token字符串
//    */
//   private getToken(): string | null {
//     const { token } = (store.state as any).user
//     return token || localStorage.getItem('token')
//   }
//   /**
//    * 响应拦截器
//    */
//   private response() {
//     if (this.instance === null) return
//     this.instance.interceptors.response.use(
//       (response) => {
//         store.state.loading = true
//         return response
//       },
//       (error) => {
//         const status = error.toString()
//         if (status.includes('401') || status.includes('403')) {
//           store.dispatch('logout')
//         }
//       }
//     )
//   }
//   /**
//    * 请求拦截器
//    */
//   private request() {
//     if (this.instance === null) return
//     this.instance.interceptors.request.use((request) => {
//       store.state.loading = false
//       const token = this.getToken()
//       if (token) {
//         request.headers['authorization'] = this.getToken()
//       }
//       return request
//     })
//   }
// }
