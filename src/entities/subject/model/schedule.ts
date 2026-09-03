import { EVENT_START, SUBJECTS, type Subject, type SubjectState } from './subjects'

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
}

/** Сегодняшняя дата без времени — чтобы сравнения по дням были точными. */
export function startOfToday(now: Date = new Date()): Date {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

export function unlockDateOf(index: number): Date {
  return new Date(EVENT_START.year, EVENT_START.month, EVENT_START.day + index)
}

/** Раскладывает предметы по дням и считает, что открыто на переданную дату. */
export function buildSchedule(today: Date = startOfToday()): Schedule {
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
  }
}
