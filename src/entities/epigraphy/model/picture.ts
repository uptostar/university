import type { Sign, SignSet } from './types'

/**
 * Картинка знака. Лежит в `public/signs/<набор>/<знак>.png` — это вырезанная
 * плитка из игры, так что знак опознаётся сличением с тем, что на экране.
 */
export function pictureUrl(set: SignSet, sign: Sign): string {
  return `${import.meta.env.BASE_URL}signs/${set.id}/${sign.id}.png`
}
