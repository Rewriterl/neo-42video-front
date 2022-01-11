import { getax } from '@/common/request/index'
import { getVal, wait } from '@/utils/adLoadsh'
import * as ApiReturns from './type'
export * from './type'

const newError = () => new Error('bad request')

/**
 * 根据名称获取动漫列表
 * @param param
 * @returns
 */
export async function searchComic(param: {
  name: string
  page: number
}): Promise<ApiReturns.SearchComicReturn> {
  try {
    const {
      data: {
        data: { results, pagetotal }
      }
    } = await getax(`api/search/${param.name}?page=${param.page}`)
    if (results instanceof Array) {
      return {
        data: results,
        total: (pagetotal || 0) * 24
      }
    } else {
      throw newError()
    }
  } catch {
    return {
      data: [],
      total: 0
    }
  }
}

/**
 * 获取动漫详情
 * @param id
 * @returns
 */
export async function getComicMain(
  id: number | string
): Promise<ApiReturns.GetComicMainReturn | null> {
  try {
    const {
      data: { data }
    } = await getax(`api/getAnime/${id}`)
    const playlist = Object.entries(data.playlist || {})
      .map(([k, v]) => ({
        name: `播放源 - ${k}`,
        value: (v as any[]).map((item) => ({
          name: item.title || '-',
          value: item.link
        }))
      }))
      .filter((item) => item.value.length > 0)
    return {
      playlist,
      title: data.title,
      season: data.season || '未知',
      region: data.region || '未知',
      rank: data.rank || '',
      master: data.master || '未知',
      lang: data.lang || '未知',
      firstDate: data.first_date || '未知',
      cover: data.cover || '',
      voiceActors: data.actors || [],
      cates: data.categories || []
    }
  } catch {
    return null
  }
}

/**
 * 获取视频地址
 * @param key
 * @returns
 */
export async function getVideoUrl(key: string | number) {
  try {
    const {
      data: { data }
    } = await getax(`api/getVideo?link=${key}`)
    if (data.vurl) {
      return data.vurl
    } else {
      throw newError()
    }
  } catch {
    console.log('bad')
    return null
  }
}

/**
 * 获取最新更新动漫
 * @returns
 */
// export async function getLatestComic(): Promise<ApiReturns.GetLatestComic | null> {
//   try {
//     const {
//       data: {
//         data: { results, pagetotal }
//       }
//     } = await getax('api/latest')
//     if (results instanceof Array) {
//       return {
//         data: results,
//         total: (pagetotal || 0) * 24
//       }
//     } else {
//       throw newError()
//     }
//   } catch {
//     return {
//       data: [],
//       total: 0
//     }
//   }
// }

/**
 * 获取每日更新动漫
 * @returns
 */
export async function getHomeMixData(): Promise<ApiReturns.GetHomeMixData | null> {
  try {
    const { data } = await getax('api/getIndex')
    // console.log(data)
    return {
      // perweek: Object.entries(data.perday || {}).map(([k, v]): any => ({
      //   name: `星期${+k}`,
      //   value: v
      // })),hots
      hots: getVal<any[]>(() => data.data.hots.results, []).map((item) => ({
        cover: item.cover,
        id: item.id,
        season: item.season,
        title: item.title
      })),
      latest: getVal<any[]>(() => data.data.latest.results, [])
        .slice(0, 10)
        .map((item) => ({
          cover: '',
          id: item.id,
          season: `${item.date}  ${item.season}`,
          title: item.title
        })),
      banner: getVal<any[]>(() => data.data.banner, []).map((item) => ({
        cover: item.cover,
        id: item.id || -1,
        title: item.title || '未知'
      }))
    }
    // return
  } catch {
    return null
  }
}

export async function filterComic(param: {
  /** 类型 */
  label?: string
  /** 地区 */
  region?: string
  /** 年份 */
  year?: string
  /** 状态 */
  status?: string
  /** 排序 */
  order: string | number
  page: number
}): Promise<ApiReturns.FilterComicReturn> {
  // try {
  //   const api =
  //     'api/filter?' +
  //     Object.entries(param)
  //       .filter(([k, v]) => v !== '')
  //       .map(([k, v]) => `${k}=${v}`)
  //       .join('&')
  //   const {
  //     data: {
  //       data: { results, pagetotal }
  //     }
  //   } = await getax(api)
  //   if (results instanceof Array) {
  //     return {
  //       data: results,
  //       total: (pagetotal || 0) * 24
  //     }
  //   } else {
  //     throw newError()
  //   }
  // } catch {
  //   return {
  //     data: [],
  //     total: 0
  //   }
  // }
  return {
    data: [],
    total: 0
  }
}
