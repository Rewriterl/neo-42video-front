<template>
  <div class="aw-radio">
    <div v-if="label" class="aw-radio__label">{{ label }}：</div>
    <!-- <div class="aw-radio__options"> -->
    <div
      v-for="{ name, value } in options"
      :key="value"
      :class="{ active: modelValue === value }"
      class="aw-radio__item"
      @click="$emit('update:modelValue', value)"
      @contextmenu.prevent="
        modelValue === value && $emit('update:modelValue', '')
      "
    >
      {{ name }}
    </div>
    <!-- </div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Option } from './type'

export * from './type'

export default defineComponent({
  name: 'AwRadio',
  props: {
    options: {
      type: Array as PropType<Option[]>,
      default: () => []
    },
    modelValue: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue']
})
</script>
<style lang="less" scoped>
.aw-radio {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  gap: 6px 0;
  flex-wrap: wrap;
  &__label {
    color: var(--font-color);
    font-weight: 800;
    width: max-content;
  }
  &__item {
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
      background: var(--bg-color);
    }
  }
}
</style>
