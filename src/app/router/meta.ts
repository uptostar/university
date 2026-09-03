import type { RouteMeta } from 'vue-router'
import { SITE_URL } from '@/shared'

/**
 * Обновляет заголовок и описание при переходе между страницами.
 *
 * Соцсети и мессенджеры разметку не увидят: они читают исходный HTML и скрипты не выполняют,
 * поэтому в превью всегда попадёт то, что прописано в index.html. Здесь это нужно для вкладки
 * браузера, истории и закладок — и для поисковиков, которые страницу всё-таки отрисовывают.
 */
export function applyRouteMeta(meta: RouteMeta): void {
  if (meta.title) document.title = meta.title
  if (meta.description) {
    setMeta('name', 'description', meta.description)
    setMeta('property', 'og:description', meta.description)
  }
  if (meta.title) setMeta('property', 'og:title', meta.title)
  setLink('canonical', SITE_URL + location.pathname)
  setMeta('property', 'og:url', SITE_URL + location.pathname)
}

function setMeta(kind: 'name' | 'property', key: string, value: string): void {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${kind}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(kind, key)
    document.head.appendChild(tag)
  }
  tag.content = value
}

function setLink(rel: string, href: string): void {
  let tag = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!tag) {
    tag = document.createElement('link')
    tag.rel = rel
    document.head.appendChild(tag)
  }
  tag.href = href
}
