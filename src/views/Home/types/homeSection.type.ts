import * as Api from '@apis/index'

export interface Comic {
  // perday: Api.GetHomeMixData['perday']
  perweek: Api.GetHomeMixData['perweek']
  latest: Api.GetHomeMixData['latest']
}

export interface Tabs<T> {
  active: T
  list: {
    name: string
    key: T
  }[]
}
