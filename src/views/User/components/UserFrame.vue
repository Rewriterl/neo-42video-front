<template>
  <div class="user-frame">
    <div class="user-frame__routes">
      <template
        v-for="{ routeName, name, active, logined } in routeList"
        :key="routeName"
      >
        <div
          v-if="logined.value"
          :class="{ active: active.includes(activeRouteName) }"
          class="user-frame__routes-item"
          @click="$router.push({ name: routeName })"
        >
          {{ name }}
        </div>
      </template>
    </div>
    <div class="user-frame__content">
      <router-view v-slot="{ Component }">
        <transition name="route-transition">
          <keep-alive>
            <component :is="Component" v-bind="$attrs" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user.store'

export default defineComponent({
  name: 'UserFrame',
  setup() {
    const userStore = useUserStore()
    const route = useRoute()
    const login = computed(() => userStore.userAccessToken.length > 8)
    const unlogin = computed(() => !login.value)
    const routeList = [
      {
        name: '播放历史',
        routeName: 'PlayHistory',
        active: ['User', 'PlayHistory'],
        logined: login
      },
      {
        name: '追番',
        routeName: 'ComicFavlist',
        active: ['ComicFavlist'],
        logined: login
      },
      {
        name: '视频管理',
        routeName: 'VideoManage',
        active: ['VideoManage'],
        logined: login
      },
      {
        name: '登录',
        routeName: 'Login',
        active: ['Login'],
        logined: unlogin
      },
      {
        name: '注册',
        routeName: 'Register',
        active: ['Register'],
        logined: unlogin
      }
    ]
    const activeRouteName = computed(() => String(route.name))
    return {
      routeList,
      activeRouteName
    }
  }
})
</script>
<style lang="less" scoped>
.user-frame {
  @radius: 8px;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  &__routes {
    display: flex;
    justify-content: center;
    height: 70px;
    transform: translateY(@radius);
    user-select: none;

    &-item {
      position: relative;
      width: 290px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--font-unactive-color);
      cursor: pointer;
      transition: all 0.25s;

      &::after {
        .mask(-1);
        border-radius: @radius;
        transform: translateY(100%);
        transition: all 0.25s;
        background: var(--box-bg-color);
        opacity: 0.6;
      }

      &:hover::after {
        transform: translateY(75%);
      }

      &.active {
        color: var(--font-color);

        &::after {
          opacity: 1;
          transform: translateY(0);
        }
      }
    }
  }

  &__content {
    position: relative;
    flex: 1;
    overflow: hidden;
    background: var(--box-bg-color);
    border-radius: @radius;
  }
}

.route-transition {
  @keyframes slide {
    from {
      transform: translateY(100px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .base {
    position: absolute !important;
    left: 0;
    top: 0;
  }

  &-enter-active {
    .base;
    animation: slide 0.25s;
  }

  &-leave-active {
    .base;
    animation: slide 0.25s reverse;
  }
}
</style>
