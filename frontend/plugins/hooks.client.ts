import { defineNuxtPlugin } from '#app'
import { useUserStore } from '~@store/user'
import { useToursStore } from '~@store/tours'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:suspense:resolve', () => {
    const $userStore = useUserStore()
    
    if (!$userStore.getIsKeepAuth) {
      $userStore.$reset()
      navigateTo('/')
    }
  })
  
  nuxtApp.hook('page:start', () => {
    const $toursStore = useToursStore()
    $toursStore.setAccountTours([])
  })
  
})
