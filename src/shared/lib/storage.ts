import { ref, watch, type Ref } from 'vue'

/**
 * Реактивное значение, которое само сохраняется в localStorage.
 * Приватный режим и запрет на хранилище не роняют приложение — просто ничего не запоминается.
 */
export function useStored<T>(key: string, fallback: T): Ref<T> {
  const state = ref(read(key, fallback)) as Ref<T>

  watch(
    state,
    (value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch {
        /* хранилище недоступно — работаем без сохранения */
      }
    },
    { deep: true },
  )

  return state
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}
