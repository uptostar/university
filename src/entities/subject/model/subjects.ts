export type SubjectState = 'ready' | 'pending' | 'locked'

export interface Subject {
  /** Название предмета. */
  name: string
  /** Значок на карточке. */
  emoji: string
  /** Имя маршрута, если гайд уже написан. */
  route?: string
  /** Подпись под названием у предмета с готовым гайдом. */
  note?: string
}

/**
 * Порядок = день открытия. Первый предмет открывается EVENT_START,
 * каждый следующий — на день позже. Добавил предмет — просто вписал в конец.
 */
export const SUBJECTS: Subject[] = [
  { name: 'Педагогика', emoji: '📚' },
  {
    name: 'Информатика',
    emoji: '💻',
    route: 'informatics',
    note: 'подбор пароля к терминалу',
  },
  { name: 'Химия', emoji: '⚗️', route: 'chemistry', note: 'поиск, цепочки и чеклист' },
  { name: 'Предмет 04', emoji: '❔' },
  { name: 'Предмет 05', emoji: '❔' },
  { name: 'Предмет 06', emoji: '❔' },
  { name: 'Предмет 07', emoji: '❔' },
  { name: 'Предмет 08', emoji: '❔' },
  { name: 'Предмет 09', emoji: '❔' },
  { name: 'Предмет 10', emoji: '❔' },
]

/** Первый день ивента: 1 сентября 2026. Месяцы в JS считаются с нуля. */
export const EVENT_START = { year: 2026, month: 8, day: 1 }
