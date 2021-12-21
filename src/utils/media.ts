/**
 * 图片加载
 * @param path 图片地址
 * @returns
 */
export function loadImg(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const iamge = new Image()
    iamge.src = path
    iamge.onload = () => resolve(path)
    iamge.onerror = reject
  })
}
