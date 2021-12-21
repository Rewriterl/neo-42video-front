<template>
  <ul class="app-aside__bar">
    <li class="app-aside__bar-slider" :style="sliderStyle"></li>
    <li
      v-for="{ name, routeName } in routeList"
      :key="routeName"
      class="app-aside__bar-item"
      :class="{ active: $route.name === routeName }"
      @click="$router.push({ name: routeName })"
    >
      <i></i>
      <p>{{ name }}</p>
    </li>
  </ul>
</template>

<script lang="ts">
import { computed, CSSProperties, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
export default defineComponent({
  name: 'AppAsideBar',
  setup() {
    const $route = useRoute()
    const routeList = [
      {
        name: '首页',
        routeName: 'Home',
        icon: ''
      },
      {
        name: '搜索',
        routeName: 'Search',
        icon: ''
      },
      {
        name: '用户',
        routeName: 'User',
        icon: ''
      }
    ]
    const sliderStyle = computed(() => {
      const routeIndex = routeList.findIndex(
        (item) => item.routeName === $route.name
      )
      return {
        transform: `translateY(${routeIndex === -1 ? 0 : routeIndex * 100}%)`
      } as CSSProperties
    })
    return {
      routeList,
      sliderStyle
    }
  }
})
</script>
<style lang="less" scoped>
.app-aside__bar {
  @fontSize: 16px;
  @liPadding: 26px;
  @liHeight: 48px;
  position: relative;
  font-size: @fontSize;
  &-slider {
    position: absolute;
    top: 0;
    left: 0;
    width: calc(@liPadding + @fontSize*2);
    height: @liHeight;
    background: var(--primary-color);
    z-index: -1;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
    transition: all 0.25s;
  }
  &-item {
    display: flex;
    align-items: center;
    width: 100%;
    height: @liHeight;
    padding: 0 @liPadding;
    box-sizing: border-box;
    cursor: pointer;
    color: var(--font-unactive-color);
    transition: all 0.25s;

    &.active {
      color: var(--font-color);
    }
    i {
      width: @fontSize;
      height: @fontSize;
      margin-right: @fontSize;
      background: #fff;
    }
    p {
      line-height: @fontSize;
      margin-left: 16px;
    }
  }
}
</style>
