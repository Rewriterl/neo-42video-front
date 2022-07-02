import { defineStore } from 'pinia'
import { getUserInstance } from '@/class/user.class'

export const useUserStore = defineStore('userStore', {
  getters: {
    userAccessToken() {
      return getUserInstance().jwt
    }
  },
  actions: {
    saveUser(jwt: string) {
      getUserInstance().jwt = jwt
    }
  }
})
