import { DF_SYSTEM_COLOR } from './static'
import { ThemeColorVar } from './type'

/**
 * 主题类
 */
class Theme {
  constructor() {
    this.init()
  }

  /**
   * 主题样式初始化
   */
  private init() {
    this.colorVarInit()
  }

  /**
   * 颜色初始化
   * @param editedVar 颜色配置列表
   */
  public colorVarInit(editedVar?: ThemeColorVar[]) {
    ;(editedVar || DF_SYSTEM_COLOR).forEach((item) => {
      document.documentElement.style.setProperty(item.var, item.value)
    })
  }
}
/**
 * 主题实例
 */
let themeInstance: Theme | null
export function createTheme() {
  if (!themeInstance) {
    themeInstance = new Theme()
  }
}
export function getThemeInstance() {
  return themeInstance
}
