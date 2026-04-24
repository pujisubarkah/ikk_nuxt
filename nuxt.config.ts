import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
  ],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['@idds/vue', 'vue3-apexcharts', '@vue-leaflet/vue-leaflet'],
    }
  },
  build: {
    transpile: ['@idds/vue', '@tabler/icons-vue']
  },
  css: [
    '~/assets/css/main.css',
    '@idds/vue/index.css'
  ]
})
