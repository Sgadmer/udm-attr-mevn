import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
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
      ]
    }
  },
  build: {
    analyze: true
  },
  srcDir: 'frontend/',
  css: ['@/assets/styles/main.scss'],   // Эти стили будут применены к каждой странице
  serverMiddleware: [
    { path: '/api', handler: './backend/index.ts' }, // `/api/**` does NOT handle /api
    { path: '/api/**', handler: './backend/index.ts' },
  ],
  telemetry: false,
  builder: process.env.NODE_ENV === 'production' ? 'webpack' : 'vite',
})
