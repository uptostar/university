import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Сайт живёт на https://uptostar.github.io/university/ — отсюда base.
// Если переедешь на свой домен или на <логин>.github.io, поставь '/'.
export default defineConfig({
  base: '/university/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
