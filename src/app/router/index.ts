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
        title: 'Осенний ивент GTA 5 RP: гайды к экзаменам в университете',
        description:
          'Разборы заданий осеннего ивента GTA 5 RolePlay: все 715 рецептов химии с поиском ' +
          'и цепочками крафта, решатель для взлома терминала в информатике. Предметы ' +
          'открываются по одному в день с 1 сентября.',
      },
    },
    {
      path: '/chem',
      name: 'chemistry',
      component: () => import('@/pages/chemistry').then((m) => m.ChemistryPage),
      meta: {
        title: 'Химия: все 715 рецептов — осенний ивент GTA 5 RP',
        description:
          'Полный список синтезов для задания по химии в осеннем ивенте GTA 5 RolePlay. ' +
          'Выбираешь элемент — остаются только рабочие пары; показывает пошаговую цепочку ' +
          'крафта с нуля, раскладку по уровням и чеклист на 720 элементов.',
      },
    },
    {
      path: '/inf',
      name: 'informatics',
      component: () => import('@/pages/informatics').then((m) => m.InformaticsPage),
      meta: {
        title: 'Информатика: взлом терминала и подбор пароля — ивент GTA 5 RP',
        description:
          'Помощник для задания по информатике в осеннем ивенте GTA 5 RolePlay. Вводишь слова ' +
          'с экрана терминала и число совпадений — решатель отсеивает невозможное и ' +
          'подсказывает, какое слово жать, чтобы уложиться в пять попыток.',
      },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach((to) => applyRouteMeta(to.meta))
