import source from '../api/emoji.txt?raw'
import type { ElementName } from '@/shared'

/**
 * Свои картинки вместо эмодзи.
 * Положи PNG в public/icons с именем элемента (`public/icons/Лава.png`)
 * и поставь здесь true. Для элементов без файла останется эмодзи.
 */
export const USE_IMAGES = false

const FALLBACK = '🔹'

const emoji = new Map<ElementName, string>()
for (const line of source.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const at = trimmed.indexOf('=')
  if (at > 0) emoji.set(trimmed.slice(0, at), trimmed.slice(at + 1))
}

export function emojiOf(element: ElementName): string {
  return emoji.get(element) ?? FALLBACK
}

export function imageUrlOf(element: ElementName): string {
  return `${import.meta.env.BASE_URL}icons/${encodeURIComponent(element)}.png`
}
