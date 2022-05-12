import { useUserStore } from '~@store/user'

export default defineNuxtRouteMiddleware((to, from) => {
  const $userStore = useUserStore()
  
  
  if (!$userStore.getUserInfo.existType && to.name !== 'index') {
    return navigateTo('/')
  }
  
  if (
    $userStore.getUserInfo.existType &&
    to.name !== 'index' &&
    to.name !== $userStore.getUserInfo.existType
  
  ) {
    return navigateTo('/')
  }
  
})
