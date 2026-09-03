import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useStored } from '@/shared'
import {
  commonLength,
  extractFromDump,
  extractWords,
  filterCandidates,
  oddLengthWords,
  outcomes,
  rankGuesses,
  type Attempt,
} from '@/entities/terminal'

/** В терминале даётся пять попыток. */
export const MAX_ATTEMPTS = 5

/**
 * Сессия взлома: список слов с экрана и уже сделанные попытки.
 * Всё лежит в localStorage — обновление страницы посреди подбора ничего не теряет.
 */
export const useTerminalStore = defineStore('terminal', () => {
  const words = useStored<string[]>('terminal-words', [])
  const history = useStored<Attempt[]>('terminal-history', [])
  /** Обрывки из последнего разбора дампа — их показываем, чтобы дописать руками. */
  const leftovers = ref<string[]>([])

  const length = computed(() => commonLength(words.value))
  const oddWords = computed(() => oddLengthWords(words.value))

  /** Слова, которые ещё могут оказаться паролем. */
  const candidates = computed(() => filterCandidates(words.value, history.value))

  /** Кандидаты, отсортированные по выгодности хода: первый — рекомендуемый. */
  const ranked = computed(() => rankGuesses(candidates.value))

  const attemptsLeft = computed(() => MAX_ATTEMPTS - history.value.length)
  const solved = computed(
    () => history.value.at(-1)?.likeness === length.value && length.value > 0,
  )
  /** Ни одного подходящего слова — где-то ошиблись при вводе числа. */
  const contradiction = computed(
    () => words.value.length > 0 && candidates.value.length === 0 && !solved.value,
  )

  /** Сколько кандидатов останется при каждом возможном ответе на это слово. */
  function preview(word: string): number[] {
    return outcomes(word, candidates.value)
  }

  function setWords(text: string): void {
    words.value = extractWords(text)
    history.value = []
    leftovers.value = []
  }

  /** Достаёт слова из вставленного экрана терминала. Возвращает то, что удалось собрать. */
  function setWordsFromDump(text: string): string[] {
    const result = extractFromDump(text)
    words.value = result.words
    leftovers.value = result.leftovers
    history.value = []
    return result.words
  }

  function attempt(word: string, matched: number): void {
    history.value = [...history.value, { word, likeness: matched }]
  }

  function undo(): void {
    history.value = history.value.slice(0, -1)
  }

  function resetAttempts(): void {
    history.value = []
  }

  function clear(): void {
    words.value = []
    history.value = []
    leftovers.value = []
  }

  return {
    words,
    history,
    leftovers,
    length,
    oddWords,
    candidates,
    ranked,
    attemptsLeft,
    solved,
    contradiction,
    preview,
    setWords,
    setWordsFromDump,
    attempt,
    undo,
    resetAttempts,
    clear,
  }
})
