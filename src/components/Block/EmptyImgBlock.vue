<template>
  <div class="empty-img-block">
    <img :src="realSrc" />
    <p>{{ content }}</p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
export default defineComponent({
  name: 'EmptyImgBlock',
  props: {
    content: {
      type: String,
      default: '什么都没有'
    },
    src: {
      type: String,
      default: '404.png'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    }
  },
  setup(props) {
    const realSrc = computed(() => `src/assets/img/${props.src}`)
    return {
      realSrc
    }
  }
})
</script>
<style lang="less" scoped>
.empty-img-block {
  position: absolute;
  top: 0;
  left: 0;
  width: v-bind(width);
  height: v-bind(height);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  &::after {
    .mask;
  }
  img {
    width: 300px;
  }
  p {
    color: var(--font-color);
    padding-top: 24px;
    font-size: 16px;
    letter-spacing: 14px;
  }
}
</style>
