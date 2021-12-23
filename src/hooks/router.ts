import router from '../router/index'

/**
 * 前往动漫详情
 * @param id
 * @returns
 */
export function toComicMain(id: number | string) {
  return router.push({
    name: 'ComicMain',
    params: {
      id
    }
  })
}
