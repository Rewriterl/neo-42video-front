/**
 * 监听节点是否存在于当前屏幕视野
 * @param el 监听的节点
 * @returns promise
 */
export function domObserver(el: HTMLElement, callback: () => void) {
  const observer = new IntersectionObserver((entries, observer) => {
    const isIn = entries.some((entrie) => entrie.intersectionRatio > 0)
    if (isIn) {
      // 解绑
      observer.unobserve(el)
      callback()
    }
  })
  observer.observe(el)
}

/**
 * 获取图片加载状态
 * @param imgPath 图片地址
 * @returns promise
 */
export function getImgStatus(imgPath: string) {
  return new Promise((resolve, reject) => {
    try {
      const image = new Image()
      image.src = imgPath
      image.onload = resolve
      image.onerror = reject
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * 获取元素的真实样式（无视过渡动画）
 * @param el 节点
 * @param styles 要获取的参数名称数组
 * @returns
 */
export function getRealStyle(el: HTMLElement, styles = ['width', 'height']) {
  const computedStyle: any = window.getComputedStyle(el)
  const res: any = {}
  const numberStyles = ['width', 'height']
  styles.forEach((style: string) => {
    if (numberStyles.indexOf(style) != -1) {
      res[style] = Number(computedStyle[style].replace('px', ''))
    } else {
      res[style] = computedStyle[style]
    }
  })
  return styles.length > 0 ? res : computedStyle
}
