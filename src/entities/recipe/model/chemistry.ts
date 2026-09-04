import source from '../api/recipes.txt?raw'
import { parseRecipes } from './parse'
import { RecipeGraph } from './graph'

/**
 * Элементы, которые выдаются даром, помимо базовых.
 *
 * Раньше сюда входило «Время»: оно открывалось само после сотни элементов.
 * Теперь его синтезируют из Солнца и Луны, поэтому список пуст —
 * но точка расширения оставлена, такие подарки в ивентах появляются регулярно.
 */
export const FREEBIES: string[] = []

const { base, recipes } = parseRecipes(source)

/** Единственный экземпляр графа на всё приложение. */
export const chemistry = new RecipeGraph(base, recipes, FREEBIES)
