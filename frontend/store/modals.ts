import { defineStore } from 'pinia'
import { EModalsNames } from '~@constants/modals'
import { useUIStore } from './ui'

interface IModalsStore {
  currentModalName: EModalsNames | null;
}

export const useModalsStore = defineStore('modals', {
  
  state: (): IModalsStore => {
    return {
      currentModalName: null,
    }
  },
  getters: {
    getCurrentModalName: (state): string => state.currentModalName,
  },
  actions: {
    setCurrentModalName(name: EModalsNames | null): void {
      const $uiStore = useUIStore()
      
      if (name) $uiStore.setIsScrollBlocked(true)
      else $uiStore.setIsScrollBlocked(false)
      
      this.currentModalName = name
    }
  },
  
})
