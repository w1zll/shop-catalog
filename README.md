# Shop Catalog

`shop-catalog` - отдельная Next.js catalog zone демонстрационного магазина на микрофронтендах.

## Ответственность

- `/catalog`;
- `/category/[slug]`;
- `/product/[slug]`;
- `/search`;
- серверная загрузка данных каталога;
- базовые SEO metadata, canonical, Open Graph и JSON-LD;
- самостоятельный deploy как Next.js zone.

На текущем этапе реализован самостоятельный catalog bootstrap без интеграции с shell rewrites.

## Технологии

- Next.js App Router;
- React Server Components;
- TypeScript strict;
- Tailwind CSS 4;
- `@w1zll/shop-ui`;
- server-only API client;
- Vitest;
- React Testing Library.

## Переменные окружения

Создать локальный `.env` из `.env.example` и заполнить значения вручную.

```bash
cp .env.example .env
```

```text
API_INTERNAL_URL=http://localhost:4000/api/v1
```

`API_INTERNAL_URL` используется только на сервере и не должен попадать в клиентский bundle.

## Локальная разработка

Перед установкой зависимостей нужен доступ к GitHub Packages для `@w1zll/shop-ui`.
Токен не хранится в репозитории. Registry для scope настроен в `.npmrc`, auth token должен быть в user-level `~/.npmrc`.

```bash
pnpm install
pnpm dev
```

Локальный адрес:

```text
http://localhost:3001
```

## Маршруты

```text
/catalog
/category/[slug]
/product/[slug]
/search
```

## Asset Prefix

Для будущего подключения через shell static assets публикуются с prefix:

```text
/catalog-static
```

## Проверки

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Текущие ограничения

- данные берутся из API, но при недоступном API используется локальный fallback;
- фильтры, сортировка и пагинация пока реализованы как URL links;
- кнопка добавления в корзину на странице товара подготовлена как UI-заглушка до подключения cart remote;
- shell rewrites пока не подключены.
