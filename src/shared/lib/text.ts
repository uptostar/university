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

/**
 * Русское склонение после числа: plural(2, 'синтез', 'синтеза', 'синтезов') → 'синтеза'.
 *
 * Три формы: 1 синтез · 2–4 синтеза · 5–20 синтезов, и дальше по последней цифре,
 * кроме 11–14 — они всегда как «много».
 */
export function plural(count: number, one: string, few: string, many: string): string {
  const mod100 = Math.abs(count) % 100
  const mod10 = mod100 % 10
  if (mod100 >= 11 && mod100 <= 14) return many
  if (mod10 === 1) return one
  if (mod10 >= 2 && mod10 <= 4) return few
  return many
}

/** Число вместе со склонённым словом: «3 синтеза». */
export function pluralize(count: number, one: string, few: string, many: string): string {
  return `${count} ${plural(count, one, few, many)}`
}

/** Двузначный порядковый номер: 1 → «01». */
export function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

/** Трёхзначный номер рецепта: 7 → «007». */
export function pad3(n: number): string {
  return String(n).padStart(3, '0')
}
