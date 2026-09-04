import type { Pick, Sign, SignSet } from './types'

/** Промежуток между словами: на стене он есть, а буквы за ним не стоит. */
export const WORD_BREAK = '/'

/** Как показывается ещё не выбранная группа букв: `[ВОУ]`. */
function group(sign: Sign): string {
  return `[${sign.letters.join('')}]`
}

/**
 * Как назвать знак словами — для alt картинки и подсказки при наведении.
 * У пиктограммы это рисунок, у буквенного знака — сама буква.
 */
export function describe(sign: Sign): string {
  return sign.picture ?? `знак «${sign.letters.join('')}»`
}

export function signOf(set: SignSet, id: string): Sign | undefined {
  return set.signs.find((sign) => sign.id === id)
}

/** Читается ли знак единственным способом. */
export function isAmbiguous(sign: Sign): boolean {
  return sign.letters.length > 1
}

/**
 * Буква → знак. Каждая буква встречается ровно в одном знаке, поэтому обратный
 * разбор («написал слово — покажи знаки») однозначен.
 */
export function letterIndex(set: SignSet): Map<string, Sign> {
  const index = new Map<string, Sign>()
  for (const sign of set.signs) for (const letter of sign.letters) index.set(letter, sign)
  return index
}

/** Буква знака: сама буква, выбранный вариант или null, пока выбор не сделан. */
export function letterOf(set: SignSet, pick: Pick): string | null {
  const sign = signOf(set, pick.id)
  if (!sign) return null
  if (!isAmbiguous(sign)) return sign.letters[0]
  return pick.letter
}

/** Собранный перевод. Неразобранные знаки стоят группой букв в скобках. */
export function readingOf(set: SignSet, picks: Pick[]): string {
  return picks
    .map((pick) => {
      if (pick.id === WORD_BREAK) return ' '
      const sign = signOf(set, pick.id)
      if (!sign) return ''
      return letterOf(set, pick) ?? group(sign)
    })
    .join('')
}

/** Сколько прочтений ещё возможно: перемножаем группы, где выбор не сделан. */
export function variantsLeft(set: SignSet, picks: Pick[]): number {
  let total = 1
  for (const pick of picks) {
    const sign = signOf(set, pick.id)
    if (sign && isAmbiguous(sign) && pick.letter === null) total *= sign.letters.length
  }
  return total
}

/**
 * Разбирает русский текст в знаки — чтобы сверить догадку с тем, что на стене.
 *
 * «Ё» здесь отдельная буква со своим знаком, поэтому к «е» её приводить нельзя.
 * Всё, чему знака нет, просто выбрасывается; подряд идущие пробелы схлопываются.
 */
export function textToPicks(set: SignSet, text: string): Pick[] {
  const index = letterIndex(set)
  const picks: Pick[] = []

  for (const char of text.toUpperCase()) {
    if (/\s/.test(char)) {
      if (picks.length && picks.at(-1)?.id !== WORD_BREAK) picks.push({ id: WORD_BREAK, letter: null })
      continue
    }
    const sign = index.get(char)
    if (sign) picks.push({ id: sign.id, letter: char })
  }

  if (picks.at(-1)?.id === WORD_BREAK) picks.pop()
  return picks
}
