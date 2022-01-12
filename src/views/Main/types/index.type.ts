import * as Api from '@apis/index'
import { ComputedRef } from 'vue'

export type Playlist = Api.GetComicMainReturn['playlist']
export type ComicName = Api.GetComicMainReturn['title']
export interface Anthology {
  current: string
  bads: string[]
  list: ComputedRef<
    {
      name: string
      orgId: string
      values: {
        name: string
        value: string
      }[]
    }[]
  >
}
