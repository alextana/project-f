// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['@nuxt/ui', 'nuxt-tiptap-editor', '@vueuse/nuxt'],
  tiptap: {
    prefix: 'Tiptap',
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'dark',
  },
  vite: {
    plugins: [tailwindcss()],
  },
})