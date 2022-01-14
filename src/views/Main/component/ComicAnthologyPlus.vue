<template>
  <div class="comic-anthology-plus">
    <!-- <ul>
      <li
        v-for="{ name, value } in list"
        :key="value"
        :class="{ active: active === value, disable: isBad(value) }"
        @click="liClick({ name, value })"
      >
        {{ name }}
      </li>
    </ul> -->
    <AwSlideX class="card-content" @onChange="(e) => (awSlideXActive = e)">
      <AwSlideItem
        v-for="(item, index) in [
          'https://api.adicw.cn/uploads/StudyImg/6191d88725d2c.jpg',
          'https://api.adicw.cn/uploads/StudyImg/6141a4ce2715a.png',
          'https://api.adicw.cn/uploads/StudyImg/60a671f8b7c20.jpg',
          'https://api.adicw.cn/images/DfImg/wallhaven-624800.jpg',
          'https://api.adicw.cn/images/StudyImg/20200204111235.jpg',
          'https://api.adicw.cn/images/StudyImg/20200318041339.jpg',
          'https://api.adicw.cn/images/DfImg/wallhaven-701155.jpg',
          'https://api.adicw.cn/images/StudyImg/20200413114835.jpg'
        ]"
        :key="index"
      >
        <div class="card" :class="{ active: index === awSlideXActive }">
          <div class="card-cover">
            <BaseImg :src="item" />
          </div>
          <div class="card-progress">
            <div
              v-if="index === awSlideXActive"
              class="card-progress__inner"
            ></div>
          </div>
        </div>
      </AwSlideItem>
    </AwSlideX>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import AwSlideX from '@comps/AwSlide/AwSlideX.vue'
import AwSlideItem from '@comps/AwSlide/AwSlideItem.vue'

export interface Option {
  name: string | number
  value: string
}
export type ChangeReturns = Option & {
  orgId: string
}

export default defineComponent({
  name: 'ComicAnthologyPlus',
  components: {
    AwSlideX,
    AwSlideItem
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    active: {
      type: [String, Number],
      default: 0
    },
    list: {
      type: Array as PropType<Option[]>,
      default: () => []
    },
    badAnthology: {
      type: Array as PropType<Option['value'][]>,
      default: () => []
    },
    orgId: {
      type: String,
      default: ''
    }
  },
  emits: ['change'],
  setup(props, { emit }) {
    const awSlideXActive = ref(0)
    const isBad = (value: Option['value']) => props.badAnthology.includes(value)
    const liClick = (item: Option) => {
      if (isBad(item.value)) return
      emit('change', {
        ...item,
        orgId: props.orgId
      } as ChangeReturns)
    }
    return {
      isBad,
      liClick,
      awSlideXActive
    }
  }
})
</script>
<style lang="less" scoped>
.comic-anthology-plus {
  position: relative;
  width: 100%;
  height: 100%;
  margin-bottom: 16px;
  .card-content {
    width: 100%;
    .card {
      width: 400px;
      padding-right: 20px;
      box-sizing: border-box;
      background-clip: content-box;
      filter: brightness(0.5);
      transition: all 0.25s;
      &.active {
        filter: brightness(1);
      }
      &-cover {
        width: 100%;
        aspect-ratio: 1.6/1;
        img {
          width: 100%;
          height: 100%;
        }
      }
      &-progress {
        margin-top: 12px;
        width: 100%;
        height: 4px;
        border-radius: 4px;
        overflow: hidden;
        background: rgba(220, 20, 60, 0.301);
        &__inner {
          width: 40%;
          height: 100%;
          background: crimson;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>
