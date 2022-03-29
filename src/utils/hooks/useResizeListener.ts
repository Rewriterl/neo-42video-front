import {
  unref,
  onUnmounted,
  onDeactivated,
  nextTick,
  onMounted,
  onActivated,
  Ref
} from 'vue'
export function onMountedOrActivated(hook: () => any) {
  let mounted: boolean

  onMounted(() => {
    hook()
    nextTick(() => {
      mounted = true
    })
  })

  onActivated(() => {
    if (mounted) {
      hook()
    }
  })
}
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
  onMountedOrActivated(add)
}
