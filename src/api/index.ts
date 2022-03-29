import { dfGetax, getax } from '@/common/request/index'
import { getVal } from '@/utils/adLoadsh'
import * as FnReturns from './type'
import * as ApiReturns from './api.type'
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
}): Promise<FnReturns.SearchComicReturn> {
  try {
    const {
      data: {
        data: { results, pagetotal }
      }
    } = await getax<ApiReturns.Search>(
      `api/search/${param.name}?page=${param.page}`
    )
    if (results instanceof Array) {
      return {
        data: results,
        total: (pagetotal || 0) * 20
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
 * 动漫筛选
 * @param param
 * @returns
 */
export async function filterComic(param: {
  /** 分类 */
  type?: number
  /** 类型 */
  category?: string
  /** 排序 */
  order?: string
  /** 字母 */
  letter?: string
  /** 年份 */
  year?: number
  page: number
}): Promise<FnReturns.FilterComicReturn> {
  try {
    const api = Object.entries(param).reduce((total, [k, v]) => {
      return v !== '' ? `${total}&${k}=${v}` : total
    }, 'api/filter?')

    const { data } = await getax<ApiReturns.Filter>(api)
    return {
      data: getVal<any[]>(() => data.data.results, []).map((item) => ({
        cover: item.cover,
        id: item.id,
        season: item.season,
        title: item.title
      })),
      total: data?.data?.total || 0
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
): Promise<FnReturns.GetComicMainReturn | null> {
  try {
    const {
      data: { data }
    } = await getax<ApiReturns.GetAnime>(`api/getAnime/${id}`)
    // const playlist = Object.entries(data.playlist || {}).map(([k, v]) => ({
    //   name: `播放源 - ${k}`,
    //   value: (v as any[]).map((item) => ({
    //     name: item.title || '-',
    //     value: item.link
    //   }))
    // }))
    const playlist = getVal<any[]>(() => data.playlist[0], []).map(
      (item, index) => ({
        name: String(item.title),
        value: index
      })
    )
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
 * 获取视频地址集
 * @param key
 * @returns
 */
export async function getVideoUrl(
  key: string | number
): Promise<FnReturns.GetVideoUrlReturn> {
  try {
    const {
      data: { data = {} }
    } = await getax<ApiReturns.GetVideo>(`api/getVideo/${key}`)
    return Object.entries(data).map(([k, v]) => ({
      key: k,
      value: (v instanceof Array ? v : []).map((url) =>
        url.replaceAll("'", '').split('?url=').pop()
      ) as string[]
    }))
  } catch {
    console.log('bad')
    return []
  }
}

/**
 * 获取混合列表（热门、最新更新、轮播、每周更新列表、番外、完结日漫、国漫）
 * @returns
 */
export async function getHomeMixData(): Promise<FnReturns.GetHomeMixData | null> {
  try {
    const { data } = await getax<ApiReturns.GetIndex>('api/getIndex')
    const listFormat = (list: any[]) =>
      list.slice(0, 10).map((item) => ({
        cover: item.cover,
        id: item.id,
        season: item.season,
        title: item.title
      }))
    return {
      hots: getVal<any[]>(() => data.data.hots.results, []).map((item) => ({
        cover: item.cover,
        id: item.id,
        season: item.season,
        title: item.title
      })),
      latest: listFormat(getVal<any[]>(() => data.data.latest, [])),
      banner: getVal<any[]>(() => data.data.banner, []).map((item) => ({
        cover: item.cover,
        id: item.id || -1,
        title: item.title || '未知'
      })),
      perweek: Object.entries(getVal<any>(() => data.data.perweek, {})).map(
        ([k, v]) => ({
          name: `周${['一', '二', '三', '四', '五', '六', '日'][+k]}`,
          key: k,
          value: ((v || []) as any[]).map((e) => ({
            id: e.id,
            season: e.season || '未知',
            title: e.title || '未知'
          }))
        })
      ),
      tv: listFormat(getVal<any[]>(() => data.data.theatre_comic, [])),
      endJp: listFormat(getVal<any[]>(() => data.data.japancomic, [])),
      cn: listFormat(getVal<any[]>(() => data.data.chinese_comic, []))
    }
    // return
  } catch (e) {
    console.error(e)
    return null
  }
}

/**
 * 获取动漫筛选条件
 * @returns
 */
export async function getComicFilterConfig(): Promise<FnReturns.GetComicFilterConfig> {
  try {
    const { data } = await getax<ApiReturns.GetConfig>('api/getConfig')
    return getVal<any[]>(() => data.data.filtersConfig, []).map((item) => ({
      id: item.id,
      name: item.name,
      value: (item.categories || []).map((key: any) => ({
        name: key.classname,
        value: key.classid
      }))
    }))
  } catch {
    return []
  }
}

/**
 * 获取动漫的相关图片列表-来源pixiv
 * @param param
 */
export async function getComicImglist({
  name = '',
  limit = 20,
  offset = 0
}: {
  /** 动漫名称 */
  name?: string
  /** 分页大小 */
  limit?: number
  /** 偏移数量 */
  offset?: number
}): Promise<FnReturns.GetComicImglistReturn> {
  try {
    const realName = name
      .split(' ')[0]
      .split('/')[0]
      .split('(')[0]
      .replace(
        /(第一季|第二季|第四季|第五季|第六季|第七季|BD|无修|剧场版|？)/,
        ''
      )
    const { data } = await dfGetax<ApiReturns.VilipixIllust>(
      `https://www.vilipix.com/api/illust/tag/${realName}?limit=${limit}&offset=${offset}`
    )
    return (data.rows || []).map((item) => ({
      date: item.create_date,
      title: item.alt,
      url: item.url,
      id: item.id,
      desc: item.description,
      w: item.width,
      h: item.height
    }))
  } catch (e) {
    return []
  }
}
