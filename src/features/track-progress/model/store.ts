import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useStored, type ElementName } from '@/shared'
import { chemistry } from '@/entities/recipe'

/** Что уже получено в игре. Список синхронизируется с localStorage. */
export const useProgressStore = defineStore('progress', () => {
  const obtained = useStored<ElementName[]>('chem720', [])

  /** Только то, что игрок отметил сам. */
  const marked = computed(() => new Set(obtained.value))

  /** Всё, чем игрок владеет: отмеченное плюс базовые элементы и «Время» — они есть всегда. */
  const owned = computed(() => new Set([...chemistry.base, ...obtained.value]))

  const total = computed(() => chemistry.elements.length)
  const count = computed(() => chemistry.elements.filter((name) => owned.value.has(name)).length)
  const percent = computed(() => (total.value === 0 ? 0 : (count.value / total.value) * 100))

  /** Владеет ли — для счётчика и для чекбоксов, где база показывается отмеченной и заблокированной. */
  function has(element: ElementName): boolean {
    return owned.value.has(element)
  }

  /**
   * Отмечено ли вручную — для зачёркивания плиток.
   * Базовые элементы гасить нельзя: снять с них отметку игрок всё равно не может,
   * и перечёркнутая «Вода» выглядит как ошибка, а не как достижение.
   */
  function isMarked(element: ElementName): boolean {
    return marked.value.has(element)
  }

  function toggle(element: ElementName, value: boolean): void {
    if (chemistry.isBase(element)) return
    const without = obtained.value.filter((name) => name !== element)
    obtained.value = value ? [...without, element] : without
  }

  function clear(): void {
    obtained.value = []
  }

  return { obtained, marked, owned, total, count, percent, has, isMarked, toggle, clear }
})
