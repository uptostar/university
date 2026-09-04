import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useStored } from '@/shared'
import {
  ALPHABETS,
  isAmbiguous,
  readingOf,
  signOf,
  textToPicks,
  variantsLeft,
  WORD_BREAK,
  type Pick,
} from '@/entities/epigraphy'

/**
 * Разбираемая надпись: какой таблицей читаем и какие знаки уже набраны.
 * Всё в localStorage — на задание даётся четыре минуты, и перезагрузка страницы
 * посреди разбора не должна стоить набранного.
 */
export const useEpigraphyStore = defineStore('epigraphy', () => {
  const setId = useStored<string>('epigraphy-set', ALPHABETS[0].id)
  const picks = useStored<Pick[]>('epigraphy-picks', [])

  const set = computed(() => ALPHABETS.find((item) => item.id === setId.value) ?? ALPHABETS[0])

  /** Собранный перевод: неразгаданные знаки стоят группой букв. */
  const reading = computed(() => readingOf(set.value, picks.value))

  /** Сколько прочтений ещё возможно — столько вариантов придётся перебирать головой. */
  const variants = computed(() => variantsLeft(set.value, picks.value))

  /** Знаки с несколькими буквами, по которым выбор ещё не сделан. */
  const undecided = computed(
    () =>
      picks.value.filter((pick) => {
        const sign = signOf(set.value, pick.id)
        return sign && isAmbiguous(sign) && pick.letter === null
      }).length,
  )

  const signCount = computed(() => picks.value.filter((pick) => pick.id !== WORD_BREAK).length)

  /**
   * Сменить письменность. Знаки у наборов свои, поэтому набранное не переносится —
   * иначе в надписи остались бы плитки из чужой таблицы.
   */
  function selectSet(id: string): void {
    if (id === setId.value) return
    setId.value = id
    picks.value = []
  }

  function push(id: string): void {
    picks.value = [...picks.value, { id, letter: null }]
  }

  /** Промежуток между словами. Два подряд смысла не имеют. */
  function pushBreak(): void {
    if (!picks.value.length || picks.value.at(-1)?.id === WORD_BREAK) return
    push(WORD_BREAK)
  }

  /** Выбрать букву для неоднозначного знака. Повторный клик по той же снимает выбор. */
  function choose(index: number, letter: string): void {
    picks.value = picks.value.map((pick, i) =>
      i === index ? { ...pick, letter: pick.letter === letter ? null : letter } : pick,
    )
  }

  function backspace(): void {
    picks.value = picks.value.slice(0, -1)
  }

  function clear(): void {
    picks.value = []
  }

  /** Обратный разбор: написал догадку — получил знаки, чтобы сверить со стеной. */
  function fromText(text: string): void {
    picks.value = textToPicks(set.value, text)
  }

  return {
    setId,
    picks,
    set,
    sets: ALPHABETS,
    reading,
    variants,
    undecided,
    signCount,
    selectSet,
    push,
    pushBreak,
    choose,
    backspace,
    clear,
    fromText,
  }
})
