/**
 * 文件引入
 * @param src 文件相当于使用地方的路径
 * @param base 引入文件路径，import.meta.url自动
 * @returns
 */
export function importFile(src: string, base: string) {
  try {
    return new URL(src, base).href
  } catch {
    console.log('bad import')
    return ''
  }
}
