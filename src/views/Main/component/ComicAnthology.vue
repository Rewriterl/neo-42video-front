<template>
  <div class="comic-anthology">
    <label>{{ label }}</label>
    <ul>
      <li
        v-for="{ name, value } in list"
        :key="value"
        :class="{ active: active === value }"
        @click="$emit('change', value)"
      >
        {{ name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export interface Option {
  name: string | number
  value: string | number
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
      default: () =>
        Array(12)
          .fill(0)
          .map((item, index) => ({
            name: `第${index + 1}集`,
            value: index
          }))
    }
  },
  emits: ['change']
})
</script>
<style lang="less" scoped>
.comic-anthology {
  position: relative;
  margin-bottom: 16px;
  label {
    display: flex;
    padding-bottom: 12px;
  }
  ul {
    display: flex;
    width: 100%;
    li {
      display: flex;
      align-items: center;
      padding: 0 14px;
      height: 36px;
      transition: all 0.25s;
      border-radius: 8px;
      user-select: none;
      color: var(--font-unactive-color);
      cursor: pointer;
      &.active {
        color: var(--font-color);
        background: var(--aside-bg-color);
      }
    }
  }
}
</style>
