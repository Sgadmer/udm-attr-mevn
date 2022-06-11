import { defineStore } from 'pinia'
import { STORE_NAMES } from '~/constants/storeNames'

interface IUserStore {
  isKeepAuth: boolean
  userInfo: Record<string, any>
}

export const useUserStore = defineStore('user', {
  
  state: (): IUserStore => {
    return {
      isKeepAuth: false,
      userInfo: {},
    }
  },
  getters: {
    getIsKeepAuth: (state): boolean => state.isKeepAuth,
    getUserInfo: (state): Record<string, any> => state.userInfo,
  },
  actions: {
    setIsKeepAuth(isKeep: boolean): void {
      this.isKeepAuth = isKeep
    },
    setUserInfo(userInfo: Record<string, any>): void {
      this.userInfo = userInfo
    },
  },
  persist: {
    key: STORE_NAMES.USER
  }
})
