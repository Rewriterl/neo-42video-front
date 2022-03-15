import { domObserver } from '@/utils/dom'
import { useEventListener } from '@/utils/vant/useEventListener'
import { isRef, onMounted, Ref } from 'vue'

/**
 * 节点入屏监听
 * @param el 节点
 * @param callback 执行方法
 */
export function useDomObserver(
  el: Ref<HTMLElement | undefined> | HTMLElement,
  callback: () => void
) {
  onMounted(() => {
    const isV = isRef(el)
    if (!el || (isV && !el.value)) return
    domObserver(isV ? el.value! : el, callback)
  })
}

/**
 * 样式计算
 * @param callback
 */
export function useReStyle(callback: () => void) {
  onMounted(callback)
  useEventListener('resize', callback)
}
