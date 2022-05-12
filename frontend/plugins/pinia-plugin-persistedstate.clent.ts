import { createNuxtPersistedState } from 'pinia-plugin-persistedstate'
import { defineNuxtPlugin, useCookie } from '#app'
import CryptoJS from 'crypto-js'


export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.$pinia.use(createNuxtPersistedState(useCookie, {
    serializer: {
      serialize: function (state) {
        return CryptoJS.AES.encrypt(JSON.stringify(state), 'y^:7aviu2IHF|j&?').toString()
      },
      deserialize: function (stateString) {
        const bytes = CryptoJS.AES.decrypt(stateString, 'y^:7aviu2IHF|j&?')
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
        return decryptedData
      },
    }
  }))
})
