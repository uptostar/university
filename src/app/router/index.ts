import { createRouter, createWebHashHistory } from 'vue-router'

// Хеш-роутинг выбран намеренно: GitHub Pages отдаёт 404 на прямой заход
// по /university/chem при history-режиме, и лечится это костылём с 404.html.
// С хешем ссылка вида .../university/#/chem работает и при обновлении страницы,
// и если открыть собранный dist/index.html локально с диска.
export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'subjects',
      component: () => import('@/pages/subjects').then((m) => m.SubjectsPage),
    },
    {
      path: '/chem',
      name: 'chemistry',
      component: () => import('@/pages/chemistry').then((m) => m.ChemistryPage),
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
