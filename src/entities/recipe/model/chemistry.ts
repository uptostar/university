import source from '../api/recipes.txt?raw'
import { parseRecipes } from './parse'
import { RecipeGraph } from './graph'

/**
 * «Время» не выдаётся ни одним рецептом — в игре оно открывается само
 * после сотни элементов. Для графа это такой же стартовый элемент, как вода.
 */
export const FREEBIES = ['Время']

const { base, recipes } = parseRecipes(source)

/** Единственный экземпляр графа на всё приложение. */
export const chemistry = new RecipeGraph(base, recipes, FREEBIES)
