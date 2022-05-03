import { defineNuxtConfig } from 'nuxt'
import url from 'url'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  alias: {
    '@assets': url.fileURLToPath(new URL('./frontend/assets', import.meta.url)),
    '@styles': url.fileURLToPath(new URL('./frontend/assets/styles', import.meta.url)),
    '@constants': url.fileURLToPath(new URL('./frontend/constants', import.meta.url)),
    '@models': url.fileURLToPath(new URL('./frontend/models', import.meta.url)),
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
    }
  },
  build: {
    transpile: ['@vueform/slider', 'swiper'],
  },
  buildModules: [
    '@pinia/nuxt',
    '@vuelidate/core',
  ],
  builder: process.env.NODE_ENV === 'production' ? 'webpack' : 'vite',
  css: [
    'modern-normalize/modern-normalize.css', // Файл из node_modules
    'swiper/css/bundle',
    '@/assets/styles/main.scss', // Файл из проекта
  ],   // Эти стили будут применены к каждой странице
  components: {
    dirs: [
      '~/components/common',
      '~/components/shared',
      '~/components/ui'
    ]
  },
  experimental: {
    reactivityTransform: true,
  },
  runtimeConfig: {
    // The private keys which are only available within server-side
    apiSecret: 'Im_Avaliable_Only_On_Server', //Доступно только на сервере
    // Keys within public, will be also exposed to the client-side
    public: {
      apiBase: 'Im_Avaliable_On_Server_And_Client' //Доступно на сервере и на фронте
    }
  },
  srcDir: 'frontend/',
  serverMiddleware: [
    { path: '/api', handler: './backend/index.ts' }, // `/api/**` does NOT handle /api
    { path: '/api/**', handler: './backend/index.ts' },
  ],
  telemetry: false,
})
