import { defineStore } from 'pinia'
import { getUserInstance, UserDetails } from '@/class/user.class'

export const useUserStore = defineStore('userStore', {
  getters: {
    userAccessToken() {
      return 'Bearer ' + (getUserInstance().userDetails.accessToken || '')
    }
  },
  actions: {
    saveStore() {
      getUserInstance().saveStore()
    },
    saveUser(userDetials: UserDetails) {
      getUserInstance().userDetails = userDetials
      console.log(getUserInstance().userDetails)
    }
  }
})
