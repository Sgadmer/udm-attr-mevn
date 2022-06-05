import CryptoJS from 'crypto-js'

const storeNames = {
  USER: 'USER',
}

const handleStoryName = {
  get(target, name) {
    if (process.env.NODE_ENV === 'production') {
      return CryptoJS.AES.encrypt(target[name], 'C!IqxTy2P70JrMF`')
    } else return target[name]
  }
}

export const STORE_NAMES = new Proxy(storeNames, handleStoryName)
