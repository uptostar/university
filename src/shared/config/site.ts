/**
 * Настройки сайта в одном месте.
 *
 * DONATION_URL — ссылка на твою страницу сбора: donationalerts.com/r/<ник>.
 * Оставишь пустой строкой — кнопка доната просто не появится.
 *
 * Виджеты DonationAlerts (алерты, прогресс цели) сюда не подходят: они рассчитаны
 * на источник «Браузер» в OBS и поверх стрима, а не на обычную страницу.
 */
export const DONATION_URL = "https://www.donationalerts.com/r/yesentooky";

/** Адрес сайта без слеша на конце. Нужен для canonical и Open Graph. */
export const SITE_URL = 'https://university-5rp.ru'

/** Название сайта — идёт в og:site_name и в микроразметку. */
export const SITE_NAME = 'Шпаргалки к экзаменам'

/** Подпись автора в подвале. Пустая строка — подписи не будет. */
export const AUTHOR = "Yesentooky";

/** Куда ведёт имя автора: профиль, канал, что угодно. Можно оставить пустым. */
export const AUTHOR_URL = "";
