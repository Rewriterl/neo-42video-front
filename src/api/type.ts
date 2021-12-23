type Page<T> = {
  data: T
  total: number
}

export type SearchReturn = Page<
  {
    category: string[]
    cover: string
    description: string
    id: string
    season: string
    title: string
  }[]
>

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

export type GetLatestComic = Page<
  {
    category: string[]
    cover: string
    description: string
    id: string
    season: string
    title: string
  }[]
>

export type GetDaysWeek = {
  name: string
  value: {
    category: string[]
    cover: string
    description: string
    id: string
    season: string
    title: string
  }[]
}[]
