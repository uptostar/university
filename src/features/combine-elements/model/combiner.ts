import { computed, ref } from 'vue'
import type { ElementName } from '@/shared'
import { chemistry } from '@/entities/recipe'

/** Слоты верстака. Живут вне компонента, чтобы выбор переживал переход на другую вкладку. */
const slotA = ref<ElementName | null>(null)
const slotB = ref<ElementName | null>(null)

export function useCombiner() {
  /** Что получается из текущей пары. Обычно один элемент, изредка несколько. */
  const results = computed(() => {
    if (!slotA.value || !slotB.value) return []
    return chemistry.combine(slotA.value, slotB.value).map((recipe) => recipe.result)
  })

  /** С чем смешивается первый слот — этим списком и сужается сетка. */
  const partners = computed(() => (slotA.value ? chemistry.partnersOf(slotA.value) : []))

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

  return { slotA, slotB, results, partners, pick, startFrom, clearA, clearB, reset }
}
