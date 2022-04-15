import { getComicFavInstance } from '@/class/comicFav.class'
import { defineStore } from 'pinia'

export const useFavStore = defineStore('playCache', {
  getters: {
    comicFavs() {
      return getComicFavInstance().fav
    }
  },
  actions: {
    // comicFav: getComicFavInstance().favHandler,
    // isFavComic: getComicFavInstance().has,
    // saveComicFav: getComicFavInstance().saveStore
  }
})
