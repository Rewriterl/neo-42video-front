<template>
  <div class="comic-favlist">
    <ListVueTransition class="comic-favlist__content">
      <ComicFavCard
        v-for="comic in favs"
        :key="comic.comicId"
        :detail="comic"
      />
    </ListVueTransition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useFavStore } from '@/stores/fav.store'
import ComicFavCard from '../../components/ComicFavCard.vue'
import ListVueTransition from '@/components/Transition/ListVueTransition.vue'
import { usePageOut } from '@/hooks/utils'

export default defineComponent({
  name: 'ComicFavlist',
  components: {
    ComicFavCard,
    ListVueTransition
  },
  setup() {
    const favStore = useFavStore()
    const favs = computed(() => favStore.comicFavs)
    usePageOut(() => {
      favStore.saveComicFav()
    })
    return {
      favs
    }
  }
})
</script>
<style lang="less" scoped>
.comic-favlist {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 30px;
  box-sizing: border-box;
  overflow-y: auto;
  &__content {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 30px;
  }
}
</style>
