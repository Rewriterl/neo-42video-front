<template>
  <div v-click-outside="unUsing" class="search-input">
    <input
      ref="inputEl"
      type="text"
      :value="modelValue"
      placeholder="请输入搜索关键字..."
      @keyup.enter="emit('search')"
      @input="updateValue"
      @focus="emit('update:using', true)"
    />
    <slot name="icon" />
    <transition
      enter-active-class="animate__fadeInDown"
      leave-active-class="animate__fadeOutUp"
    >
      <div v-show="using && history.length > 0" class="search-input__history">
        <div class="title">
          搜索记录
          <Icon name="delete" @click="clearHistory" />
        </div>
        <ListVueTransition tag="li" class="list">
          <li
            v-for="item in history"
            :key="item.date"
            @click="changeHistory(item.value)"
          >
            {{ item.value }}
            <Icon name="delete2" @click.stop="deleteHistory(item.value)" />
          </li>
        </ListVueTransition>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useSearchHistory } from '@/stores/searchHistory.store'
import vClickOutside from '@/directs/clickOutside.direct'
import ListVueTransition from '@/components/Transition/ListVueTransition.vue'

const props = defineProps<{
  modelValue: string
  using?: boolean
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'update:using', value: boolean): void
  (e: 'search'): void
}>()

const inputEl = ref<HTMLInputElement>()

const searchHistory = useSearchHistory()
const history = computed(() => searchHistory.list)

const unUsing = () => {
  emit('update:using', false)
}
const updateValue = (e: Event) => {
  const { value } = e.target as HTMLInputElement
  emit('update:modelValue', value)
}
const changeHistory = (v: string) => {
  if (v === props.modelValue) return
  emit('update:modelValue', v)
  emit('search')
  unUsing()
}
const deleteHistory = (v: string) => {
  searchHistory.delete(v)
}
const clearHistory = () => {
  searchHistory.clear()
}
</script>
<style lang="less" scoped>
.search-input {
  @radius: 12px;
  position: relative;
  color: var(--font-color);
  transition: all 0.25s;
  color: var(--font-color);
  &:focus-within {
    .search-input__history {
      display: block;
    }
    input {
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
  }
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
    color: var(--font-color);
    &::placeholder {
      color: var(--font-unactive-color);
      font-size: 14px;
    }
  }
  &__history {
    position: absolute;
    top: calc(100% + 20px);
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    background: var(--aside-bg-color);
    border-radius: @radius;
    box-shadow: 0 0 14px rgba(0, 0, 0, 0.2);
    user-select: none;
    animation-duration: 0.25s;
    // animation-delay: 1s;
    .title {
      color: var(--font-unactive-color);
      font-weight: 700;
      font-size: 14px;
      padding-bottom: 16px;
      i {
        font-size: 14px;
        padding-left: 2px;
        cursor: pointer;
        transition: all 0.25s;
        &:hover {
          opacity: 0.7;
          color: var(--warning-color);
        }
      }
    }
    .list {
      display: flex;
      gap: 12px;
      width: 100%;
      li {
        position: relative;
        padding: 0 16px;
        height: 36px;
        line-height: 36px;
        border-radius: 4px;
        background: var(--bg-color);
        cursor: pointer;
        transition: all 0.25s;
        &:hover {
          opacity: 0.8;
        }
        i {
          display: inline-block;
          position: absolute;
          right: 0;
          top: 0;
          transform: translate(50%, -50%);
          font-size: 20px;
          line-height: 20px;
          transition: all 0.25s;
          &:hover {
            color: var(--warning-color);
          }
        }
      }
    }
  }
}
</style>
