import { defineNuxtPlugin } from '#app'
import { useUserStore } from '~@store/user'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:suspense:resolve', () => {
    const $userStore = useUserStore()
    if (!$userStore.getIsKeepAuth) {
      $userStore.$reset()
      navigateTo('/')
    }
  })
  
})
