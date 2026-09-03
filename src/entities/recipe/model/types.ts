import type { ElementName } from '@/shared'

export interface Recipe {
  /** Порядковый номер в списке — по нему сверяются с гайдом. */
  number: number
  a: ElementName
  b: ElementName
  result: ElementName
}

/** Элемент, с которым что-то смешивается, и что из этого выходит. */
export interface Partner {
  element: ElementName
  results: ElementName[]
}
