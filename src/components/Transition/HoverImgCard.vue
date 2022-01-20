<template>
  <!-- <div ref="cardElShadow" class="card-shadow"></div> -->
  <div ref="cardEl" class="hover-img-card" :style="cardStyle">
    <div class="hover-img-card-fronf">
      <div ref="cardElTitle" class="hover-img-card-title">
        3D perspective title
      </div>
      <div ref="cardElSubtitle" class="hover-img-card-subtitle">
        3D perspective subtitle
      </div>
      <div ref="cardElShine" class="hover-img-card-shine"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { useEventListener } from '@/utils/vant/useEventListener'
import { computed, CSSProperties, defineComponent, reactive, ref } from 'vue'
export default defineComponent({
  name: 'HoverImgCard',
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const cardEl = ref<HTMLElement>(),
      cardElTitle = ref<HTMLElement>(),
      cardElSubtitle = ref<HTMLElement>(),
      cardElShine = ref<HTMLElement>()
    // cardElShadow = ref<HTMLElement>()
    const currentMousePos = reactive({ x: 0, y: 0 })
    const mouseFromCenter = reactive({ x: 0, y: 0 })

    const onMouseMove = (e: Event) => {
      const event = e as MouseEvent
      var wHeight = window.innerHeight,
        wWidth = window.innerWidth

      currentMousePos.x = event.pageX
      currentMousePos.y = event.pageY
      mouseFromCenter.x = currentMousePos.x - wWidth / 2
      mouseFromCenter.y = currentMousePos.y - wHeight / 2

      var around1 =
          -1 * (((currentMousePos.y * 100) / wHeight) * 0.2 - 10) + 'deg',
        around2 = 1 * (((currentMousePos.x * 100) / wWidth) * 0.2 - 10) + 'deg',
        trans1 = ((currentMousePos.x * 100) / wHeight) * 0.3 + 'px',
        trans2 = ((currentMousePos.y * 100) / wHeight) * 0.3 + 'px',
        dy = event.pageY - wHeight / 2, //@h/2 = center of poster
        dx = event.pageX - wWidth / 2, //@w/2 = center of poster
        theta = Math.atan2(dy, dx), // angle between cursor and center of poster in RAD
        angle = (theta * 180) / Math.PI - 90,
        mousePositionX = (currentMousePos.x / wWidth) * 100,
        mousePositionY = 50 + (currentMousePos.y / wHeight) * 10

      // gradient angle and opacity for card shine effect
      cardElShine.value!.style.background =
        'linear-gradient(' +
        angle +
        'deg, rgba(255,255,255,' +
        (currentMousePos.y / wHeight) * 0.7 +
        ') 0%,rgba(255,255,255, 0) 80%)'

      // card pos and angle
      cardEl.value!.style.transform = `translate3d(${trans1},${trans2},0) scale(1) rotatex(${around1}) rotatey(${around2})`
      cardEl.value!.style.backgroundPosition = `${mousePositionX}% ${
        (currentMousePos.y / wHeight) * 50
      }%`

      // card shadow pos and angle
      // cardElShadow.value!.style.transform =
      //   'scale(.9,.9) translateX(' +
      //   (mouseFromCenter.x * -0.02 + 12) +
      //   'px) translateY(' +
      //   (mouseFromCenter.y * -0.02 + 12) +
      //   'px) scale(1.0) rotateY(' +
      //   (mouseFromCenter.x / 25) * 0.5 +
      //   'deg) rotateX(' +
      //   mouseFromCenter.y / -25 +
      //   'deg)'

      cardElTitle.value!.style.transform = `translateX(${
        (mouseFromCenter.x / 25) * 0.7
      }px) translateY(${(mouseFromCenter.y / 25) * 1.65}px)`

      cardElSubtitle.value!.style.transform = `translate3d(${
        (mouseFromCenter.x / 25) * 0.5
      }px,${(mouseFromCenter.y / 25) * 1.15}px,${60}px)`
    }

    const cardStyle = computed(
      () =>
        ({
          backgroundImage: `url(${props.src})`
        } as CSSProperties)
    )
    useEventListener('mousemove', onMouseMove)

    return {
      onMouseMove,
      cardEl,
      cardElTitle,
      cardElSubtitle,
      cardElShine,
      cardStyle
      // cardElShadow
    }
  }
})
</script>
<style lang="less" scoped>
// perspective: 600px; 父元素添加

.hover-img-card-shadow,
.hover-img-card {
  width: 300px;
  aspect-ratio: 1/1.4;
  z-index: 1;
  border-radius: 10px;
}
.hover-img-card {
  background: #fff 50% 50%;
  background-size: 200%;

  .hover-img-card-shine {
    position: absolute;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    z-index: 1;
    border-radius: 10px;
    background: -webkit-linear-gradient(
      315deg,
      rgba(245, 245, 255, 0.1) 0%,
      rgba(255, 255, 255, 0) 60%
    );
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0) 60%
    );
    z-index: -1;
  }
  .hover-img-card-shadow {
    top: 10px;
    transform-style: preserve-3d;
    transform: translateZ(40px);
    z-index: -1;
    background: #b3b3b3;
    transform: scale(0.5, 0.5);
    box-shadow: 0 0 30px 10px #aaa;
  }
  .hover-img-card-front,
  .hover-img-card-title,
  .hover-img-card-subtitle {
    position: absolute;
    color: #fff;
    transform-style: preserve-3d;
  }
  .hover-img-card-front {
    border-radius: 10px;
    width: 100%;
    height: 100%;
    z-index: 0;
    background-color: rgba(0, 0, 0, 0.1);
  }
  .hover-img-card-title {
    font-weight: 700;
    text-align: left;
    left: 30px;
    bottom: 140px;
    font-size: 35px;
    line-height: 30px;
    text-shadow: 0 5px 8px rgba(0, 0, 0, 0.65);
    transform: translateZ(0px);
    overflow: hidden;
    margin: 0;
    width: 80%;
  }
  .hover-img-card-subtitle {
    font-weight: normal;
    text-align: left;
    left: 30px;
    width: 80%;
    bottom: 80px;
    font-size: 25px;
    line-height: 20px;
    text-shadow: 0 3px 6px rgba(0, 0, 0, 0.8);
    transform: translateZ(0px);
  }
}
</style>
