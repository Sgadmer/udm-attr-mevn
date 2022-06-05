import { createNuxtPersistedState } from 'pinia-plugin-persistedstate'
import { defineNuxtPlugin, useCookie } from '#app'
import CryptoJS from 'crypto-js'


export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.$pinia.use(createNuxtPersistedState(useCookie, {
    serializer: {
      serialize: function (state) {
        if (process.env.NODE_ENV === 'production') {
          return CryptoJS.AES.encrypt(JSON.stringify(state), 'y^:7aviu2IHF|j&?')
        } else return JSON.stringify(state)
      },
      deserialize: function (stateString) {
        if (process.env.NODE_ENV === 'production') {
          const bytes = CryptoJS.AES.decrypt(stateString, 'y^:7aviu2IHF|j&?')
          return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
        } else return JSON.parse(stateString)
      },
    }
  }))
})
