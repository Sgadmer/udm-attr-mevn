import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      findError: (errorsList, fieldName: string): boolean => {
        for (let i = 0; i < errorsList.length; i++) {
          if (errorsList[i].$property === fieldName) {
            return true
          }
        }
        return false
      }
    }
  }
})
