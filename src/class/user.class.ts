import { ref } from 'vue'
import { jsonParse } from 'adicw-utils'

const JWT_HEADER = 'Bearer '
const USER_STORE_KEY = 'USER'

export interface UserInfo {
  id: string
  avatar: string
  birth: string
  sign: string
}

export type UserDetails = {
  /** 用户id */
  id?: string
  userName?: string
  password?: string
  phone?: string
  email?: string
  userinfo?: UserInfo
  username?: string
  authorities?: Authority[]
  refreshToken?: string
  accessToken?: string
}

class User {
  private userDetails_ = ref<UserDetails>(<UserDetails>{})

  public get userDetails() {
    return this.userDetails_.value
  }

  public set userDetails(userDetails: UserDetails) {
    this.userDetails_.value = userDetails
  }

  // 在main.ts加载的时候使用单例模式创建store的实例之后使用此方法初始化属性jwt
  // public getStore() {
  //   this.userDetails.jwt = localStorage.getItem('user') || ''
  // }
  public saveStore() {
    localStorage.setItem(
      USER_STORE_KEY,
      JSON.stringify(this.userDetails_.value)
    )
    console.log(localStorage.getItem(USER_STORE_KEY))
  }

  public getStore() {
    this.userDetails_.value = jsonParse<UserDetails>(
      localStorage.getItem(USER_STORE_KEY) || '{}',
      <UserDetails>{}
    )
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
