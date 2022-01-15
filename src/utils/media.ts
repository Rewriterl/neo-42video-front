import { wait } from './adLoadsh'

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

export async function getVideoScreenshot(videoUrl: string, time: number) {
  try {
    const video = document.createElement('video')
    video.src = videoUrl
    video.crossOrigin = '*'
    await new Promise((resolve) => (video.oncanplay = resolve))
    video.currentTime = time
    await wait(300)

    const canvas = document.createElement('canvas')
    canvas.width = 192
    canvas.height = 108
    canvas.getContext('2d')!.drawImage(video, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/png')
  } catch (e) {
    console.log(e)
    return ''
  }
}
