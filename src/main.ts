import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/app/App.vue'
import { router } from '@/app/router'
import { useThemeStore } from '@/features/toggle-theme'
import '@/app/styles/tokens.css'
import '@/app/styles/base.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Тема применяется до монтирования, иначе страница успевает мигнуть светлой.
useThemeStore().init()

app.mount('#app')
