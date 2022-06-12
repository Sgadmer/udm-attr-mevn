import { defineStore } from 'pinia'

interface IAdminStore {
  selectedTab: 'Tourists' | 'Agents' | 'Tours'
}

export const useAdminStore = defineStore('admin', {
  
  state: (): IAdminStore => {
    return {
      selectedTab: 'Tourists'
    }
  },
  getters: {
    getSelectedTab: (state): string => state.selectedTab,
  },
  actions: {
    setSelectedTab(tabName: string): void {
      this.selectedTab = tabName
    }
  },
})
