/**
 * Cross-import по правилам FSD 2.1.
 *
 * Сущностям запрещено импортировать друг друга напрямую, но рецепту нужно рисовать
 * ингредиенты. Папка `@x` — явно объявленная витрина: здесь перечислено ровно то,
 * что `entities/element` разрешает брать `entities/recipe`, и ничего сверх.
 *
 * Импортируется как `@/entities/element/@x/recipe`.
 */
export { default as ElementPill } from '../ui/ElementPill.vue'
export { default as ElementIcon } from '../ui/ElementIcon.vue'
