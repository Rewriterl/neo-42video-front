import { unref, onUnmounted, onDeactivated, Ref } from 'vue'
import { usePageOut } from './usePageOut'

// eslint-disable-next-line
export let supportsPassive = false;

export function useResizeListener(
  el: HTMLElement | Ref<HTMLElement | undefined>,
  callback: () => void
) {
  let ob: ResizeObserver | null

  const add = () => {
    const element = unref(el)

    if (element && !ob) {
      ob = new ResizeObserver(callback)
      ob.observe(element)
    }
  }

  const remove = () => {
    const element = unref(el)

    if (element && ob) {
      ob.disconnect()
      ob = null
    }
  }

  onUnmounted(remove)
  onDeactivated(remove)
  usePageOut(add)
}
