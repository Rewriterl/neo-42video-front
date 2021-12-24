import flvjs from 'flv.js'

export type FlvInstance = flvjs.Player | null
export interface Player {
  /** 当前进度 */
  currentTime: number
  /** 总进度 */
  duration: number
  /** 音量 0-100 */
  volume: number
  /** 实际使用的音量 0-1 */
  realVolume: number
  /** 状态 -2无状态 -1加载失败 0加载中 1播放中 2暂停中  */
  status: -2 | -1 | 0 | 1 | 2
  /** 全屏 */
  fullScreen: boolean
  /** 是否静音 */
  isMute: boolean
  /** 进度预览图 */
  preview: string
  /** 是否已经进行监听 */
  isListened: boolean
}
export interface Quality {
  name: string
  value: string | number
}
