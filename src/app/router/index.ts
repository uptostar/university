import { createRouter, createWebHistory } from 'vue-router'
import { applyRouteMeta } from './meta'

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    description: string
  }
}

/**
 * Обычные URL, а не хеш: `/chem` индексируется поисковиком как отдельная страница,
 * а `#/chem` для него — та же самая главная.
 *
 * GitHub Pages на прямой заход по вложенному пути отдаёт 404, поэтому в workflow
 * собранный index.html копируется в 404.html — сервер отдаёт приложение на любой путь,
 * а дальше маршрут разбирает уже роутер.
 */
export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'subjects',
      component: () => import('@/pages/subjects').then((m) => m.SubjectsPage),
      meta: {
        title: 'Шпаргалки к экзаменам — ивент в GTA 5 RP',
        description:
          'Разборы к универскому ивенту: предметы открываются по одному в день с 1 сентября. ' +
          'Внутри поиск, пошаговые подсказки и чеклист прогресса.',
      },
    },
    {
      path: '/chem',
      name: 'chemistry',
      component: () => import('@/pages/chemistry').then((m) => m.ChemistryPage),
      meta: {
        title: 'Химия: все 715 рецептов — Верстак алхимика',
        description:
          'Выбираешь элемент — список сужается до тех, с чем он реально смешивается. ' +
          'Пошаговые цепочки крафта с нуля, разбивка по уровням и чеклист на 720 элементов.',
      },
    },
    {
      path: '/inf',
      name: 'informatics',
      component: () => import('@/pages/informatics').then((m) => m.InformaticsPage),
      meta: {
        title: 'Информатика: подбор пароля к терминалу',
        description:
          'Решатель для взлома терминала: вводишь слова с экрана и число совпадений, ' +
          'а он отсеивает невозможное и подсказывает, какое слово жать следующим.',
      },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach((to) => applyRouteMeta(to.meta))
