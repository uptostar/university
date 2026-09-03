import { pluralize } from '@/shared'

/**
 * Как называть ступень дерева. Формулировки живут в сущности, а не в виджетах,
 * чтобы «Базовые» на всех экранах назывались одинаково.
 */
export function levelTitle(depth: number): string {
  if (depth === -1) return 'Недостижимо из базы'
  if (depth === 0) return 'Базовые'
  return `Уровень ${depth}`
}

export function levelNote(depth: number): string {
  if (depth === -1) return 'ни один рецепт не выводит их из четырёх стартовых'
  if (depth === 0) return 'есть с самого начала, смешивать ничего не нужно'
  if (depth === 1) return 'один синтез от базовых'
  return `${pluralize(depth, 'синтез', 'синтеза', 'синтезов')} от базовых`
}

/** Подпись для оси диаграммы: у недостижимых числа нет. */
export function levelBadge(depth: number): string {
  return depth === -1 ? '—' : String(depth)
}
