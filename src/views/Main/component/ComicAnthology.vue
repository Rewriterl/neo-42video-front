<template>
  <div class="comic-anthology">
    <!-- <ul v-if="realSection.length > 0" class="comic-anthology__section">
      <li v-for="item in realSection" :key="item.key">{{ item.name }}</li>
    </ul> -->
    <div class="comic-anthology__section">
      <label>{{ label }}</label>
      <el-select v-model="activeTab" placeholder="Select" size="small">
        <el-option
          v-for="item in realSection"
          :key="item.key"
          :label="item.name"
          :value="item.key"
        >
        </el-option>
      </el-select>
    </div>

    <ul class="comic-anthology__list">
      <li
        v-for="{ name, value } in realList"
        :key="value"
        :class="{ active: active === value, disable: isBad(value) }"
        @click="liClick({ name, value })"
      >
        {{ name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { arrAvgSplit } from '@/utils/adLoadsh'
import { computed, defineComponent, PropType, ref } from 'vue'

export interface Option {
  name: string | number
  value: string
}
export type ChangeReturns = Option & {
  orgId: string
}

export default defineComponent({
  name: 'ComicAnthology',
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
    const activeTab = ref(0)

    const isBad = (value: Option['value']) => props.badAnthology.includes(value)
    const liClick = (item: Option) => {
      if (isBad(item.value)) return
      emit('change', {
        ...item,
        orgId: props.orgId
      } as ChangeReturns)
    }
    const splitList = computed(() => arrAvgSplit(props.list, 100) as Option[][])
    const realList = computed(() => {
      return props.list.length > 100
        ? splitList.value[activeTab.value]
        : props.list
    })
    const realSection = computed(() =>
      splitList.value.map((item, index) => ({
        name: `${item[0].name} - ${item[item.length - 1].name}`,
        key: index
      }))
    )

    return {
      isBad,
      liClick,
      realSection,
      activeTab,
      realList
    }
  }
})
</script>
<style lang="less" scoped>
.comic-anthology {
  position: relative;
  margin-bottom: 16px;

  &__list {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    li {
      display: flex;
      align-items: center;
      padding: 8px 14px;
      transition: all 0.25s;
      border-radius: 8px;
      user-select: none;
      color: var(--font-unactive-color);
      cursor: pointer;
      &:hover {
        opacity: 0.4;
      }
      &.active {
        color: var(--font-color);
        background: var(--primary-color);
      }
      &.disable {
        opacity: 0.8;
        color: var(--warning-color);
        cursor: no-drop;
      }
    }
  }
  &__section {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    margin: 8px 0 16px 0;
    & > label {
      margin-right: 8px;
      font-size: 16px;
    }
  }
}
</style>
