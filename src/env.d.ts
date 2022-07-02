/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>

  // 给`this.$http`提供类型
  // interface ComponentCustomProperties {
  //   $axios: AxiosInstance
  // }

  export default component
}

/**
 * 对象值类型
 */
declare type ValueOf<T> = T[keyof T]

/**
 * 动漫id
 */
declare type ComicId = string | number

declare type Authority = string
