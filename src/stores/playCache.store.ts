import { defineStore } from 'pinia'
import moment from 'moment'

import { usePlayCache } from '@/hooks/user'
const { playHistoryCache, playProgressCache } = usePlayCache()
import { sToMs } from '@/utils/adLoadsh'

export const usePlayCacheStore = defineStore('playCache', {
  getters: {
    playHistory() {
      return playHistoryCache.cache.map((item) => {
        const cache = playProgressCache.cache.find(
          (cache) => cache.comicId === item.id
        )
        return {
          ...item,
          playProgress: sToMs(cache?.progress || 0),
          playEpisode: cache?.name || false,
          date: moment(item.date).format('YYYY-MM-DD hh:mm')
        }
      })
    }
  }
})
