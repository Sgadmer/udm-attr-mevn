import { defineNuxtConfig } from 'nuxt'
import url from 'url'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  alias: {
    '@assets': url.fileURLToPath(new URL('./frontend/assets', import.meta.url)),
    '@styles': url.fileURLToPath(new URL('./frontend/assets/styles', import.meta.url)),
    '@public': url.fileURLToPath(new URL('./public', import.meta.url)),
    '~@constants': url.fileURLToPath(new URL('./frontend/constants', import.meta.url)),
    '~@models': url.fileURLToPath(new URL('./frontend/models', import.meta.url)),
    '~@store': url.fileURLToPath(new URL('./frontend/store', import.meta.url)),
    '~@utils': url.fileURLToPath(new URL('./frontend/utils', import.meta.url)),
  },
  app: {
    head: {
      meta: [
        // <meta name="viewport" content="width=device-width, initial-scale=1">
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      script: [
        // <script src="https://myawesome-lib.js"></script>
        // { src: 'https://awesome-lib.js' }
      ],
      link: [
        // <link rel="stylesheet" href="https://myawesome-lib.css">
        // { rel: 'stylesheet', href: 'https://awesome-lib.css' }
      ],
      // please note that this is an area that is likely to change
      style: [
        // <style type="text/css">:root { color: red }</style>
        // { children: ':root { color: red }', type: 'text/css' }
      ],
      title: 'UDM-ATTRACTION',
      htmlAttrs: {
        lang: 'ru',
      },
    },
    // cdnURL: "https://udm-attr.herokuapp.com/"
  },
  build: {
    transpile: ['@vueform/slider', 'swiper'],
  },
  buildModules: [
    '@pinia/nuxt',
    '@vuelidate/core',
  ],
  builder: process.env.NODE_ENV === 'production' ? 'vite' : 'vite', //'vite' : 'vite'  'webpack' : 'webpack'
  css: [
    'modern-normalize/modern-normalize.css', // Файлы из node_modules
    'swiper/css/bundle',
    '@vuepic/vue-datepicker/dist/main.css',
    '@/assets/styles/main.scss', // Файлы из проекта
  ],   // Эти стили будут применены к каждой странице
  components: {
    dirs: [
      '~/components/common',
      '~/components/shared',
      '~/components/ui'
    ]
  },
  dir: {
    public: url.fileURLToPath(new URL('./public', import.meta.url))
  },
  experimental: {
    reactivityTransform: true,
  },
  runtimeConfig: {
    // The private keys which are only available within server-side
    //Доступно только на сервере
    apiSecret: 'Im_Avaliable_Only_On_Server',
    
    // Keys within public, will be also exposed to the client-side
    //Доступно на сервере и на фронте
    public: {
      apiBase: 'Im_Avaliable_On_Server_And_Client',
      // cdnURL: "https://udm-attr.herokuapp.com/"
    }
  },
  srcDir: 'frontend/',
  serverMiddleware: [
    { path: '/api', handler: './backend/index.ts' }, // `/api/**` does NOT handle /api
    { path: '/api/**', handler: './backend/index.ts' },
  ],
  telemetry: false,
  vite: {
    publicDir: url.fileURLToPath(new URL('./public', import.meta.url))
  }
})
