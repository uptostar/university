import { createApp } from 'vue'
import App from '@/app/App.vue'
import { router } from '@/app/router'
import { initTheme } from '@/features/toggle-theme'
import '@/app/styles/tokens.css'
import '@/app/styles/base.css'

initTheme()

createApp(App).use(router).mount('#app')
