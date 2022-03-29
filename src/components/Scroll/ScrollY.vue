<template>
  <div ref="selfDom" class="scroll-y">
    <div class="scroll-y__content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { wait } from '@/utils/adLoadsh'
import { useEventListener } from '@/utils/vant/useEventListener'
import BScroll from 'better-scroll'
import {
  onMounted,
  ref,
  watch,
  nextTick,
  toRefs,
  defineComponent,
  PropType,
  reactive
} from 'vue'
export interface ScrollParam {
  x: number
  y: number
}
function scrollInit(dom: HTMLDivElement, config: any): BScroll {
  return new BScroll(dom, {
    scrollY: true,
    ...config
  })
}
export default defineComponent({
  name: 'ScrollY',
  props: {
    probeType: {
      type: Number, // 非实时派发scroll事件和位置参数, 类型由0,1,2,3,
      default: 3
    },
    bounce: {
      type: Boolean, // 是否滚动回弹动画
      default: true
    },
    preventDefault: {
      type: Boolean, // 是否禁用默认事件
      default: false
    },
    // eslint-disable-next-line vue/require-default-prop
    listenData: [Object, String, Boolean, Number] as PropType<any>, // 监听的触发刷新的对象,
    scrollBottomOffset: {
      type: Number,
      default: 200
    },
    scroll: {
      type: Function,
      default: (e: ScrollParam) => e
    }
  },
  emits: ['touchStart', 'touchEnd', 'scrollBottom'],
  setup(props, { emit }) {
    const { listenData } = toRefs(props)
    const selfDom = ref<HTMLDivElement>()
    const bScroll = ref<BScroll | null>(null)
    const self = reactive({
      width: 0,
      height: 0
    })

    const bScrollFn = (name: string) => {
      if (bScroll.value === null) return
      return bScroll.value[name]()
    }
    const refresh = () => bScrollFn('refresh')
    const touchSwitch = (enabled: boolean) => {
      // const { enabled } = bScroll.value as BScroll;
      bScrollFn(enabled ? 'enable' : 'disable')
    }
    const styleInit = async () => {
      await wait(2000)
      const { clientWidth, clientHeight } = selfDom.value!
      ;[self.width, self.height] = [clientWidth, clientHeight]
    }

    watch(listenData, () => nextTick(refresh), {
      immediate: true
    })

    onMounted(() => {
      if (!selfDom.value) return
      bScroll.value = scrollInit(selfDom.value, {
        ...props
      })
      styleInit()

      bScroll.value.on('beforeScrollStart', (e: any) => emit('touchStart', e))
      bScroll.value.on('touchEnd', (e: any) => emit('touchEnd', e))
      bScroll.value.on('scroll', (e: any) => {
        const { y } = e
        const { maxScrollY } = bScroll.value as BScroll
        if (Math.abs(y) + props.scrollBottomOffset >= Math.abs(maxScrollY)) {
          emit('scrollBottom')
        }
        props.scroll(e)
        // emit("scroll", e); // danger
      })
    })
    useEventListener('resize', () => {
      refresh()
      styleInit()
    })

    return {
      self,
      selfDom,
      bScroll,
      refresh,
      bScrollFn,
      touchSwitch
    }
  }
})
</script>
<style lang="less" scoped>
.scroll-y {
  width: 100%;
  overflow: hidden;
  touch-action: none;
  &__content {
    width: inherit;
    overflow: hidden;
    user-select: none;
    &:active {
      cursor: grabbing;
    }
  }
}
</style>
