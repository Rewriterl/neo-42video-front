<template>
  <div class="search-input">
    <input
      type="text"
      :value="modelValue"
      placeholder="请输入搜索关键字..."
      @keyup.enter="emit('search')"
      @input="updateValue"
    />
    <slot name="icon" />
    <div class="search-input__suggest">
      <div class="tabs">
        <div class="tabs-nav">
          <div
            v-for="tab in tabs.list"
            :key="tab.key"
            class="tabs-nav__item"
            :class="{ active: tabs.active === tab.key }"
            @click="tabs.active = tab.key"
          >
            {{ tab.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
const props = defineProps<{
  modelValue: string
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search'): void
}>()
const updateValue = (e: Event) => {
  const { value } = e.target as HTMLInputElement
  emit('update:modelValue', value)
}
const tabs = reactive({
  active: 'all',
  list: [
    {
      name: '全部',
      key: 'all',
      index: 0
    },
    {
      name: '历史记录',
      key: 'history',
      index: 0
    },
    {
      name: '相关',
      key: 'about',
      index: 0
    }
  ]
})
</script>
<style lang="less" scoped>
.search-input {
  @radius: 12px;
  position: relative;
  color: var(--font-color);
  transition: all 0.25s;
  color: var(--font-color);
  input {
    position: relative;
    width: 100%;
    height: 100%;
    background: var(--box-bg-color);
    outline: none;
    border: none;
    text-indent: 20px;
    font-size: 16px;
    border-radius: @radius;
    &::placeholder {
      color: var(--font-unactive-color);
      font-size: 14px;
    }
  }
  &__suggest {
    position: absolute;
    top: calc(100% + 20px);
    width: 100%;
    height: 480px;
    background: var(--aside-bg-color);
    border-radius: @radius;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.424);
  }

  .tabs {
    position: relative;
    width: 100%;
    &-nav {
      position: relative;
      display: flex;
      width: 100%;
      box-sizing: border-box;
      padding: 0 16px;
      user-select: none;
      &::before {
        .mask(1,#eee);
        top: unset;
        bottom: 0;
        height: 2px;
      }
      &__item {
        position: relative;
        box-sizing: border-box;
        line-height: 50px;
        height: 50px;
        padding: 0 10px;
        border-bottom: 2px solid transparent;
        z-index: 2;
        cursor: pointer;
        color: var(--font-unactive-color);
        &.active {
          border-color: var(--font-color);
          font-weight: 600;
          color: var(--font-color);
        }
      }
    }
  }
}
</style>
