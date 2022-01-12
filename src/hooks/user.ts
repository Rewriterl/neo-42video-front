import { getPlayProgressInstance } from '@/class/playProgress.class'

export function usePlayProgressCache() {
  return getPlayProgressInstance()
}
