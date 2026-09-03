import { computed } from 'vue'
import { useStored, type ElementName } from '@/shared'
import { chemistry } from '@/entities/recipe'

/** Что уже получено в игре. Живёт в localStorage и переживает перезагрузку. */
const obtained = useStored<ElementName[]>('chem720', [])

export function useProgress() {
  /** Базовые элементы и «Время» есть всегда — их не отмечают вручную. */
  const set = computed(() => new Set([...chemistry.base, ...obtained.value]))

  const total = computed(() => chemistry.elements.length)
  const count = computed(() => chemistry.elements.filter((name) => set.value.has(name)).length)
  const percent = computed(() => (total.value === 0 ? 0 : (count.value / total.value) * 100))

  function has(element: ElementName): boolean {
    return set.value.has(element)
  }

  function toggle(element: ElementName, value: boolean): void {
    if (chemistry.isBase(element)) return
    const without = obtained.value.filter((name) => name !== element)
    obtained.value = value ? [...without, element] : without
  }

  function clear(): void {
    obtained.value = []
  }

  return { obtained, total, count, percent, has, toggle, clear }
}
