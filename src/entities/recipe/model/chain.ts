import type { ElementName } from '@/shared'
import type { RecipeGraph } from './graph'
import type { Recipe } from './types'

/**
 * Порядок синтезов от базовых элементов до цели.
 *
 * На каждом шаге берётся рецепт с наименьшей глубиной ингредиентов — так цепочка
 * получается кратчайшей. Обход в глубину, ингредиенты добавляются раньше результата,
 * поэтому список сразу готов к выполнению сверху вниз.
 *
 * В данных есть циклы (Пиво + Пшеница = Светлое пиво, Вино + Время = Уксус),
 * поэтому ветка, вошедшая сама в себя, обрывается через stack.
 */
export function buildChain(graph: RecipeGraph, target: ElementName): Recipe[] {
  const steps: Recipe[] = []
  const done = new Set<ElementName>()
  const stack = new Set<ElementName>()

  function visit(element: ElementName): void {
    if (graph.isBase(element) || done.has(element) || stack.has(element)) return

    const options = graph.recipesFor(element)
    if (options.length === 0) return

    stack.add(element)

    let best = options[0]
    let bestDepth = Infinity
    for (const recipe of options) {
      const depth = Math.max(graph.depthOf(recipe.a), graph.depthOf(recipe.b))
      if (depth < bestDepth) {
        bestDepth = depth
        best = recipe
      }
    }

    visit(best.a)
    visit(best.b)
    stack.delete(element)

    done.add(element)
    steps.push(best)
  }

  visit(target)
  return steps
}
