import { ThemeColorVar } from './type'

const DARK = [
  '#1e1d2b',
  '#2f3042',
  '#222433',
  '#fff',
  '#ffffffa3',
  'rgba(104, 198, 189, 1)',
  '#f5073e'
]

export const DF_SYSTEM_COLOR: ThemeColorVar[] = [
  {
    prop: 'bg',
    value: '#1e1d2b',
    var: '--bg-color',
    descr: '整体背景色'
  },
  {
    prop: 'asideBg',
    value: '#2f3042',
    var: '--aside-bg-color',
    descr: '左侧边背景色'
  },
  {
    prop: 'boxBg',
    value: '#222433',
    var: '--box-bg-color',
    descr: '盒子背景色'
  },
  {
    prop: 'font',
    value: '#fff',
    var: '--font-color',
    descr: '主字体颜色'
  },
  {
    prop: 'font-unactive',
    value: '#ffffffa3',
    var: '--font-unactive-color',
    descr: '主未激活字体颜色'
  },
  {
    prop: 'primary',
    value: 'rgba(104, 198, 189, 1)',
    var: '--primary-color',
    descr: '醒目颜色'
  },
  {
    prop: 'warning',
    value: '#f5073e',
    var: '--warning-color',
    descr: '错误颜色'
  }
]
