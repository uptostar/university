import { likeness } from './words'
import type { Attempt, RankedGuess } from './types'

/**
 * Слова, которые ещё могут быть паролем: у настоящего пароля совпадение
 * с каждым введённым словом обязано в точности равняться показанному числу.
 */
export function filterCandidates(words: string[], history: Attempt[]): string[] {
  return words.filter((word) =>
    history.every((attempt) => likeness(word, attempt.word) === attempt.likeness),
  )
}

/**
 * Сколько кандидатов останется при каждом возможном ответе терминала.
 * Индекс массива — число совпадений, значение — размер остатка.
 */
export function outcomes(guess: string, candidates: string[]): number[] {
  const counts = new Array<number>(guess.length + 1).fill(0)
  for (const candidate of candidates) counts[likeness(candidate, guess)]++
  return counts
}

/**
 * Оценка ходов по минимаксу: хорош тот, после которого даже при самом
 * неудачном ответе останется как можно меньше вариантов.
 *
 * Пробуем только слова из числа кандидатов: попытки ограничены, и ход,
 * который заодно может оказаться паролем, всегда выгоднее заведомо ложного.
 */
export function rankGuesses(candidates: string[]): RankedGuess[] {
  const total = candidates.length

  return candidates
    .map((word) => {
      const counts = outcomes(word, candidates)
      let worst = 0
      let weighted = 0

      counts.forEach((size, matched) => {
        // Полное совпадение — это победа, а не «остаток», поэтому в худший случай не идёт.
        if (matched !== word.length && size > worst) worst = size
        weighted += size * size
      })

      return {
        word,
        worst,
        expected: total === 0 ? 0 : weighted / total,
        chance: total === 0 ? 0 : 1 / total,
      }
    })
    .sort((a, b) => a.worst - b.worst || a.expected - b.expected || a.word.localeCompare(b.word, 'ru'))
}

/** Ответы, которые терминал в принципе не может показать на это слово. */
export function impossibleResults(guess: string, candidates: string[]): Set<number> {
  const counts = outcomes(guess, candidates)
  const impossible = new Set<number>()
  counts.forEach((size, matched) => {
    if (size === 0) impossible.add(matched)
  })
  return impossible
}
