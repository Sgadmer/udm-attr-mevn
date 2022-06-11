import { defineStore } from 'pinia'

interface IToursStore {
  accountTours: Record<string, any>[]
  selectedTourId?: string
}

export const useToursStore = defineStore('tours', {
  
  state: (): IToursStore => {
    return {
      accountTours: [],
      selectedTourId: null,
    }
  },
  getters: {
    getAccountTours: (state): Record<string, any>[] => state.accountTours,
    getSelectedTourId: (state): string => state.selectedTourId,
    getSelectedTour: (state): Record<string, any> => {
      return state.accountTours.find(tour => tour._id === state.selectedTourId)
    },
  },
  actions: {
    setAccountTours(accountTours: Record<string, any>[]): void {
      this.accountTours = accountTours
    },
    setSelectedTourId(tourId?: string): void {
      this.selectedTourId = tourId
    }
  }
})
