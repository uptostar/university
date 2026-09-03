import { defineStore } from 'pinia'
import { ref } from 'vue'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'chem-theme'

export const useThemeStore = defineStore('theme', () => {
  /** Выбранная вручную тема. null — идём за настройкой системы. */
  const chosen = ref<Theme | null>(null)

  function systemTheme(): Theme {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  function apply(theme: Theme | null): void {
    if (theme) document.documentElement.setAttribute('data-theme', theme)
    else document.documentElement.removeAttribute('data-theme')
  }

  /** Вызывается один раз при старте приложения. */
  function init(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === 'light' || saved === 'dark') chosen.value = saved
    } catch {
      /* хранилище недоступно — остаёмся на системной теме */
    }
    apply(chosen.value)
  }

  function toggle(): void {
    const next: Theme = (chosen.value ?? systemTheme()) === 'dark' ? 'light' : 'dark'
    chosen.value = next
    apply(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* не сохранилось — не страшно */
    }
  }

  return { chosen, init, toggle }
})
