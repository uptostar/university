import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { ElementName } from '@/shared'
import { chemistry } from '@/entities/recipe'

/** Слоты верстака. В сторе, чтобы выбор переживал переключение вкладок. */
export const useCombinerStore = defineStore('combiner', () => {
  const slotA = ref<ElementName | null>(null)
  const slotB = ref<ElementName | null>(null)

  /** Что получается из текущей пары. Обычно один элемент, изредка несколько. */
  const results = computed(() => {
    if (!slotA.value || !slotB.value) return []
    return chemistry.combine(slotA.value, slotB.value).map((recipe) => recipe.result)
  })

  /** С чем смешивается первый слот — этим списком и сужается сетка. */
  const partners = computed(() => (slotA.value ? chemistry.partnersOf(slotA.value) : []))

  /** Пара сложилась и что-то дала. */
  const resolved = computed(() => (slotA.value && slotB.value ? results.value[0] : undefined))

  /**
   * Один клик заполняет ближайший пустой слот.
   * Если оба заняты — начинаем новую пару с выбранного элемента.
   */
  function pick(element: ElementName): void {
    if (!slotA.value) slotA.value = element
    else if (!slotB.value) slotB.value = element
    else {
      slotA.value = element
      slotB.value = null
    }
  }

  /** Явный выбор первого элемента: с него начинается новая пара. */
  function startFrom(element: ElementName): void {
    slotA.value = element
    slotB.value = null
  }

  function clearA(): void {
    slotA.value = null
    slotB.value = null
  }

  function clearB(): void {
    slotB.value = null
  }

  function reset(): void {
    slotA.value = null
    slotB.value = null
  }

  return { slotA, slotB, results, partners, resolved, pick, startFrom, clearA, clearB, reset }
})
