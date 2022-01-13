import * as Api from '@apis/index'

export interface Comic {
  // perday: Api.GetHomeMixData['perday']
  hots: Api.GetHomeMixData['hots']
  latest: Api.GetHomeMixData['latest']
  banner: Api.GetHomeMixData['banner']
  perweek: Api.GetHomeMixData['perweek']
}

export interface Tabs<T> {
  active: T
  list: {
    name: string
    key: T
  }[]
}
