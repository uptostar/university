/**
 * Сколько букв стоит на своих местах — ровно то число, которое показывает терминал.
 * Слова разной длины сравнивать бессмысленно, поэтому такой случай считается нулём.
 */
export function likeness(a: string, b: string): number {
  if (a.length !== b.length) return 0
  let same = 0
  for (let i = 0; i < a.length; i++) if (a[i] === b[i]) same++
  return same
}

/**
 * Вытаскивает слова из произвольного текста: подойдёт и аккуратный список,
 * и вставленный целиком мусор с экрана терминала.
 *
 * `minLength` отсекает случайные одиночные буквы среди символов.
 * Регистр приводится к верхнему, повторы убираются.
 */
export function extractWords(text: string, minLength = 1): string[] {
  const found = text.toUpperCase().match(/\p{L}+/gu) ?? []
  const seen = new Set<string>()
  const words: string[] = []
  for (const word of found) {
    if (word.length < minLength || seen.has(word)) continue
    seen.add(word)
    words.push(word)
  }
  return words
}

/** Самая частая длина в списке — почти всегда настоящая длина пароля. */
export function commonLength(words: string[]): number {
  const counts = new Map<number, number>()
  for (const word of words) counts.set(word.length, (counts.get(word.length) ?? 0) + 1)

  let best = 0
  let bestCount = 0
  for (const [length, count] of counts) {
    if (count > bestCount || (count === bestCount && length > best)) {
      best = length
      bestCount = count
    }
  }
  return best
}

/** Слова, выбивающиеся из общей длины: чаще всего опечатка при вводе. */
export function oddLengthWords(words: string[]): string[] {
  const length = commonLength(words)
  return words.filter((word) => word.length !== length)
}

export interface DumpResult {
  /** Слова, в которых мы уверены: их длина совпала с длиной пароля. */
  words: string[]
  /** Обрывки, которые не удалось собрать. Их придётся дописать руками. */
  leftovers: string[]
  /** Длина пароля, определённая по большинству целых слов. */
  length: number
}

/**
 * Разбор вставленного экрана терминала.
 *
 * Слово может разорваться переносом строки: «ПАЧ» в конце одной строки и «КА» в начале
 * следующей. Подряд идущие обрывки склеиваются, если их сумма даёт ровно длину пароля.
 *
 * Надёжно это работает только на одноколоночном тексте. Экран терминала обычно свёрстан
 * в две колонки, и там продолжение слова оказывается не следующим куском, а через один —
 * такие обрывки честно возвращаются в `leftovers`, а не склеиваются наугад.
 */
export function extractFromDump(text: string): DumpResult {
  // Адреса ячеек (0xF55A) — латинские буквы вперемешку с цифрами, для разбора это чистый шум.
  const cleaned = text.toUpperCase().replace(/0X[0-9A-F]+/g, ' ')

  // Слова написаны одним алфавитом. Берём тот, которым набрано больше текста,
  // иначе редкие латинские огрызки склеиваются с русскими обрывками.
  const cyrillic = cleaned.match(/\p{Script=Cyrillic}+/gu) ?? []
  const latin = cleaned.match(/\p{Script=Latin}+/gu) ?? []
  const weight = (runs: string[]) => runs.reduce((sum, run) => sum + run.length, 0)
  const runs = weight(cyrillic) >= weight(latin) ? cyrillic : latin
  if (runs.length === 0) return { words: [], leftovers: [], length: 0 }

  // Длину считаем только по кускам от трёх букв: обрывки и случайные буквы её бы перекосили.
  const solid = runs.filter((run) => run.length >= 3)
  const length = commonLength(solid.length > 0 ? solid : runs)
  if (length === 0) return { words: [], leftovers: [], length: 0 }

  const seen = new Set<string>()
  const words: string[] = []
  const leftovers: string[] = []

  for (let i = 0; i < runs.length; i++) {
    let word = runs[i]

    // Обрывок — пробуем дотянуть его следующими кусками ровно до нужной длины.
    while (
      word.length < length &&
      i + 1 < runs.length &&
      word.length + runs[i + 1].length <= length
    ) {
      i++
      word += runs[i]
    }

    if (word.length !== length) {
      // Слишком короткий кусок — почти всегда половина разорванного слова.
      if (word.length < length) leftovers.push(word)
      continue
    }
    if (seen.has(word)) continue
    seen.add(word)
    words.push(word)
  }

  return { words, leftovers, length }
}
