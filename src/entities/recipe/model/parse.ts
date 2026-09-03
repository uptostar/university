import type { ElementName } from '@/shared'
import type { Recipe } from './types'

export interface ParsedRecipes {
  /** Четыре стартовых элемента. */
  base: ElementName[]
  /** Рецепты в порядке из файла; номер проставляется при разборе. */
  recipes: Recipe[]
}

/**
 * Разбирает recipes.txt.
 *
 * Первая значимая строка — базовые элементы через «|».
 * Дальше по строке на рецепт: «Элемент + Элемент = Результат».
 * Строки, начинающиеся с «#», и пустые пропускаются.
 */
export function parseRecipes(source: string): ParsedRecipes {
  const lines = source
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'))

  const [baseLine, ...rest] = lines
  const base = (baseLine ?? '').split('|').map((name) => name.trim())

  const recipes: Recipe[] = []
  for (const line of rest) {
    const match = line.match(/^(.+?)\+(.+?)=(.+)$/)
    if (!match) continue
    recipes.push({
      number: recipes.length + 1,
      a: match[1].trim(),
      b: match[2].trim(),
      result: match[3].trim(),
    })
  }

  return { base, recipes }
}
