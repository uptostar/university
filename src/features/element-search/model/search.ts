import { computed, ref } from 'vue'
import { normalize, type ElementName } from '@/shared'

/** Строка поиска общая для всех вкладок химии — переключение не сбрасывает запрос. */
const query = ref('')

export function useElementSearch() {
  const normalized = computed(() => normalize(query.value))

  function matches(element: ElementName): boolean {
    return normalized.value === '' || normalize(element).includes(normalized.value)
  }

  function reset(): void {
    query.value = ''
  }

  return { query, normalized, matches, reset }
}
