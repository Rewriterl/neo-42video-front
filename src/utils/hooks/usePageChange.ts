import {
  nextTick,
  onMounted,
  onActivated,
  onBeforeUnmount,
  onDeactivated
} from 'vue'

export function usePageIn(hook: () => void) {
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

export function usePageOut(hook: () => void) {
  onBeforeUnmount(hook)
  onDeactivated(hook)
}
