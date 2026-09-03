import { EVENT_START, SUBJECTS, type Subject, type SubjectState } from './subjects'

/** Москва круглый год UTC+3, перевода часов нет — можно считать смещение константой. */
const MSK_OFFSET_MS = 3 * 60 * 60 * 1000

/** Новый день ивента начинается в 07:00 по Москве, а не в полночь. */
export const DAY_STARTS_AT_HOUR = 7

export interface ScheduledSubject extends Subject {
  /** Порядковый номер, он же день ивента. */
  index: number
  unlockAt: Date
  state: SubjectState
  /** Открылся именно сегодня. */
  isFresh: boolean
}

export interface Schedule {
  subjects: ScheduledSubject[]
  today: Date
  openCount: number
  readyCount: number
  /** Ближайший ещё закрытый предмет, если такие остались. */
  next?: ScheduledSubject
  /** Сколько дней до него. */
  daysToNext: number
  /** Часов до ближайшей смены дня — она в 07:00 МСК. */
  hoursToRollover: number
}

/**
 * Текущий день ивента.
 *
 * Считается от московского времени и с оглядкой на то, что день переключается в 07:00:
 * в 3 часа ночи по Москве идёт ещё вчерашний день ивента. Локальный часовой пояс игрока
 * значения не имеет — сдвигаем метку времени и читаем уже UTC-поля.
 */
export function currentEventDay(now: Date = new Date()): Date {
  const shifted = new Date(now.getTime() + MSK_OFFSET_MS - DAY_STARTS_AT_HOUR * 60 * 60 * 1000)
  return new Date(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate())
}

/** Сколько часов осталось до следующей смены дня. */
export function hoursUntilRollover(now: Date = new Date()): number {
  const shifted = now.getTime() + MSK_OFFSET_MS - DAY_STARTS_AT_HOUR * 60 * 60 * 1000
  const sinceDayStart = ((shifted % 86_400_000) + 86_400_000) % 86_400_000
  return Math.ceil((86_400_000 - sinceDayStart) / 3_600_000)
}

export function unlockDateOf(index: number): Date {
  return new Date(EVENT_START.year, EVENT_START.month, EVENT_START.day + index)
}

/** Раскладывает предметы по дням и считает, что открыто на переданный день ивента. */
export function buildSchedule(now: Date = new Date()): Schedule {
  const today = currentEventDay(now)

  const subjects = SUBJECTS.map((subject, index): ScheduledSubject => {
    const unlockAt = unlockDateOf(index)
    const isOpen = today.getTime() >= unlockAt.getTime()
    const state: SubjectState = !isOpen ? 'locked' : subject.route ? 'ready' : 'pending'
    return {
      ...subject,
      index,
      unlockAt,
      state,
      isFresh: isOpen && unlockAt.getTime() === today.getTime(),
    }
  })

  const next = subjects.find((subject) => subject.state === 'locked')

  return {
    subjects,
    today,
    openCount: subjects.filter((subject) => subject.state !== 'locked').length,
    readyCount: subjects.filter((subject) => subject.state === 'ready').length,
    next,
    daysToNext: next ? Math.round((next.unlockAt.getTime() - today.getTime()) / 86_400_000) : 0,
    hoursToRollover: hoursUntilRollover(now),
  }
}
