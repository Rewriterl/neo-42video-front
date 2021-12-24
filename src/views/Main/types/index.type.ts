import { Option } from '@/components/Form/type'
import * as Api from '@apis/index'

export type Playlist = Api.GetComicMainReturn['playlist']
export type ComicName = Api.GetComicMainReturn['title']
export interface Anthology {
  current: string | number
  bads: Option['value'][]
  isPending: boolean
}
