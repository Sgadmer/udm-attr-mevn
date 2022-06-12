import { defineStore } from 'pinia'
import { useUserStore } from '~@store/user'

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
    getTouristBookStatus: (state): (tourId) => string => {
      const $userStore = useUserStore()
      
      return (tourId => {
        let status = ''
        state.accountTours.forEach(tour => {
          
          if (tour._id === tourId) {
            
            tour.tourists.forEach(tourist => {
              if (tourist.touristId === $userStore.getUserInfo.info._id) {
                status = tourist.bookStatus
              }
            })
          }
          
        })
        return status
      })
      
      
    },
    getTourStatus: (state): (tourId) => string => {
      
      return (tourId => {
        let status = ''
        state.accountTours.forEach(tour => {
          
          if (tour._id === tourId) {
            status = tour.status
          }
          
        })
        return status
      })
      
      
    }
  },
  actions: {
    setAccountTours(accountTours: Record<string, any>[]): void {
      this.accountTours = accountTours
    },
    setSelectedTourId(tourId?: string): void {
      this.selectedTourId = tourId
    },
    updateTour(id: string, newTour: Record<string, any>): void {
      const tourIndex = this.accountTours.findIndex(tour => tour._id === id)
      if (tourIndex >= 0) this.accountTours[tourIndex] = { ...this.accountTours[tourIndex], ...newTour }
    },
    removeLocalTour(removeId: string): void {
      this.accountTours = this.accountTours.filter(tour => tour._id !== removeId)
    },
    loadAllTours(): void {
      const $userStore = useUserStore()
      
      const params: Record<string, any> = {
        status: 'ACTIVE'
      }
      
      if ($userStore.getUserInfo.info && $userStore.getUserInfo.existType === 'tourist') {
        params.excludeTouristId = $userStore.getUserInfo.info._id
      }
      
      $fetch('/api/tour/params', {
        method: 'GET',
        params: params
      }).then((res: Record<string, any>[]) => {
        this.accountTours = res
      })
        .catch(e => {
          console.error(e)
        })
    }
  }
})
