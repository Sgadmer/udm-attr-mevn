import { defineStore } from 'pinia'

interface IUiStore {
  isScrollBlocked: boolean
}

export const useUIStore = defineStore('ui', {
  
  state: (): IUiStore => {
    return {
      isScrollBlocked: false,
    }
  },
  getters: {
    getIsScrollBlocked: (state): boolean => state.isScrollBlocked,
  },
  actions: {
    setIsScrollBlocked(isBlocked: boolean): void {
      const body = document.querySelector('body')
      
      if (isBlocked) body.classList.add('global_scroll-blocked')
      else body.classList.remove('global_scroll-blocked')
  
      this.isScrollBlocked = isBlocked
    }
  },
})
