import { ref } from 'vue'

const JWT_HEADER = 'Bearer '

class User {
  private jwt_ = ref<string>()

  public get jwt() {
    return JWT_HEADER + this.jwt_.value
  }

  public set jwt(jwt: string) {
    this.jwt_.value = jwt
  }

  // 在main.ts加载的时候使用单例模式创建store的实例之后使用此方法初始化属性jwt
  public getStore() {
    this.jwt_.value = localStorage.getItem('jwt') || ''
  }
}

let instance: User | null
export function createUser() {
  if (!instance) {
    instance = new User()
  }
  return instance
}

export function getUserInstance() {
  return instance!
}
