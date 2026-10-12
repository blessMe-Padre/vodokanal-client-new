# AGENTS.md — МУП «Находка-Водоканал» (клиент)

Клиентский сайт на Next.js App Router. UI и комментарии — на русском. Отвечай пользователю по-русски.

## Стек

- Next.js `15.4.8` (dev: `next dev --turbopack`), React `19.2.1`, TypeScript (strict)
- Стили: Sass + CSS Modules (`style.module.scss`), глобальный `src/app/globals.css`
- UI: `framer-motion`, `swiper`; формы: `react-hook-form`
- Сервер: `nodemailer`, `docx`, `xlsx`, `formidable`, `node-cron`, `sharp`
- CMS: внешний Strapi-like REST (`NEXT_PUBLIC_API_SERVER`)

## Структура

```
src/app/
  layout.tsx, page.tsx, globals.css, mixins.scss
  (pages)/          # маршруты без префикса в URL
  section/          # блоки главной (MainBanner, Services, Kontrakt, News)
  components/       # UI, формы, Header/Footer; barrel: index.tsx
  api/              # Route Handlers (заявления, контакты, показания, cron)
  utils/            # fetchData, makeDocx, mail*, makeExcel, logger
src/lib/            # cron, server-init (подключается из layout)
docs/               # linting.md, calculator.md
public/             # статика
```

Алиас: `@/*` → `./src/*`.

## Конвенции кода

- Компонент: папка PascalCase + `ComponentName.tsx` + `style.module.scss` рядом
- Mixins: `@use '@/app/mixins' as *` (адаптив: `adaptiv-value`)
- По умолчанию — Server Components; интерактив — `'use client'`
- Страницы часто: тонкий `page.tsx` (metadata + SSR) + `PageContent.tsx` / `ContentPage.tsx` (client)
- Импорты: порядок из `docs/linting.md` (группы + пустая строка + алфавит)
- Не раздувать diff: только нужные файлы, без лишних README/рефакторинга

## Данные

- CMS: `src/app/utils/fetchData.ts` — `fetch(NEXT_PUBLIC_API_SERVER + url)`, `revalidate: 600`
- Медиа: `${NEXT_PUBLIC_API_SERVER}${url}` или `/placeholder.svg`
- Strapi-slug’ы копировать из существующих (`stranicza-…`, `novostis`, `kontakties`) — не выдумывать
- Формы → `fetch('/api/…')` в client; почта/docx — в `app/api` + `utils/mail*` / `makeDocx*`

## Важные компоненты

| Что | Путь | Заметка |
|-----|------|---------|
| Header / Footer | `components/Header`, `Footer` | client, контакты через `fetchData` |
| Главная | `page.tsx` + `section/*` | |
| Виджет Госуслуг | `components/GosuslugiWidget/` | **не** в barrel; импорт прямым путём |
| Калькулятор | `components/Calculator/` | логика: `docs/calculator.md` |
| Заявления | `components/Statements/*` | → `/api/statement` |
| Контент CMS | `ContentRenderer` | rich text из Strapi |

### Виджет ПОС Госуслуг

- Официальный скрипт: `https://pos.gosuslugi.ru/bin/script.min.js`
- Инициализация: `Widget("https://pos.gosuslugi.ru/form", 376184)` → iframe `?opaId=376184`
- Классы `pos-banner-btn_2` и id `js-show-iframe-wrapper` **не менять**
- Стили виджета — обычный CSS (`gosuslugi-widget.css`) через server-обёртку; не CSS Modules с `#id`
- Не добавлять в `components/index.tsx` (глобальные стили / barrel тянет лишнее)


Env (в репо нет `.env`): `NEXT_PUBLIC_API_SERVER`, `NEXT_PUBLIC_BASE_URL`, плюс SMTP/секреты для mail-роутов.

## Git / коммиты

- Коммиты только по явной просьбе пользователя
- Не пушить и не менять git config без запроса

## Типичные задачи

- **Страница из CMS:** `(pages)/…/page.tsx` + `fetchData('/api/stranicza-…?populate=*')` + `Breadcrumbs` / `ContentRenderer`
- **Клиентская логика:** отдельный `'use client'` файл
- **Стили:** `style.module.scss` + переменные из `globals.css` (`--main-color` и т.д.)
- **Форма + письмо:** образец `StatementForm*` + route в `app/api`

## Подводные камни

1. Barrel `@/app/components` — циклические импорты при неосторожном расширении `index.tsx`
2. Глобальный CSS только из layout / server-обёрток; client + global CSS ломает Next
3. Turbopack: ID-селекторы в CSS Modules → ошибка «Ambiguous CSS module class»
4. Смешение TS/JS (`utils/mail*.js`, `Metrika.jsx`) — допустимо (`allowJs`)
5. В App Router предпочтительно `next/navigation`, не `next/router`
6. Images: hostname только из `next.config.ts` `remotePatterns`
