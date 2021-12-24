type Page<T> = {
  data: T
  total: number
}

export interface ComicPageList {
  category: string[]
  cover: string
  description: string
  id: string
  season: string
  title: string
}

export type SearchComicReturn = Page<ComicPageList[]>

export interface GetComicMainReturn {
  playlist: {
    name: string
    value: {
      name: string
      value: string
    }[]
  }[]
  title: string
}

// export type GetLatestComic = Page<ComicPageList[]>

export type GetDaysWeek = {
  name: string
  value: ComicPageList[]
}[]

export type FilterComicReturn = Page<ComicPageList[]>

export interface GetHomeMixData {
  /** 每天排行 */
  perday: { name: string; value: { title: string; episode: string }[] }[]
  /** 每周排行 */
  perweek: {
    cover: string
    id: string
    status: string
    title: string
  }[]
  /** 最新 */
  latest: ComicPageList[]
}
