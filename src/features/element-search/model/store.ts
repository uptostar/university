import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { normalize, type ElementName } from '@/shared'

/** Строка поиска общая для всех вкладок химии — переключение не сбрасывает запрос. */
export const useSearchStore = defineStore('element-search', () => {
  const query = ref('')

  const normalized = computed(() => normalize(query.value))
  const isActive = computed(() => normalized.value.length > 0)

  /** Предикат для фильтрации списков. Берётся из стора, чтобы правило было одно на всё. */
  function matches(element: ElementName): boolean {
    return !isActive.value || normalize(element).includes(normalized.value)
  }

  function reset(): void {
    query.value = ''
  }

  return { query, normalized, isActive, matches, reset }
})
