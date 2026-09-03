import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Сайт живёт на своём домене university-5rp.ru, то есть в корне — base остаётся '/'.
// Если вернёшься на адрес вида <логин>.github.io/<репозиторий>/, поставь '/university/'.
export default defineConfig({
  base: '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
