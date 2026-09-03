/** Приводит строку к виду, по которому удобно искать: без регистра и без «ё». */
export function normalize(value: string): string {
  return value.toLowerCase().replace(/ё/g, 'е').trim()
}

/** Сортировка по алфавиту с учётом русской локали. */
export function byRussianAlphabet(a: string, b: string): number {
  return a.localeCompare(b, 'ru')
}

const MONTHS = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
]

/** «3 сентября» */
export function formatDay(date: Date): string {
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`
}

/** «через 3 дн.» / «завтра» */
export function formatIn(days: number): string {
  if (days <= 0) return 'сегодня'
  if (days === 1) return 'завтра'
  return `через ${days} дн.`
}

/** Двузначный порядковый номер: 1 → «01». */
export function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

/** Трёхзначный номер рецепта: 7 → «007». */
export function pad3(n: number): string {
  return String(n).padStart(3, '0')
}
