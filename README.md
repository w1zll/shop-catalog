# Shop Catalog

`shop-catalog` - отдельная Next.js catalog zone демонстрационного магазина на микрофронтендах.

## Ответственность

- `/catalog`;
- `/category/[slug]`;
- `/product/[slug]`;
- `/search`;
- серверная загрузка данных каталога;
- базовые SEO metadata, canonical, Open Graph и JSON-LD;
- подготовка к работе за shell rewrites как Next Multi-Zone;
- самостоятельный deploy как Next.js zone.

На текущем этапе catalog zone может работать самостоятельно на `3001` и через shell на `3000`.

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
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`API_INTERNAL_URL` используется только на сервере и не должен попадать в клиентский bundle.
`NEXT_PUBLIC_SITE_URL` задаёт публичный origin shell для canonical и Open Graph URL.

## Локальная разработка

Перед установкой зависимостей нужен доступ к GitHub Packages для `@w1zll/shop-ui`.
Токен не хранится в репозитории. Registry для scope настроен в `.npmrc`, auth token должен быть в user-level `~/.npmrc`.

```bash
pnpm install
pnpm dev
```

Локальный адрес catalog zone:

```text
http://localhost:3001
```

Интегрированное приложение открывается через shell:

```text
http://localhost:3000
```

## Маршруты

```text
/catalog
/category/[slug]
/product/[slug]
/search
```

## Asset Prefix

Для подключения через shell static assets публикуются с prefix:

```text
/catalog-static
```

Shell должен проксировать `/catalog-static/*` в catalog zone.

## Multi-Zones

- Catalog владеет только маршрутами `/catalog`, `/category/[slug]`, `/product/[slug]` и `/search`.
- Внутренние переходы внутри catalog zone используют `next/link`.
- Переходы из catalog zone в shell-маршруты (`/`, `/cart`, `/account`) выполняются обычными ссылками `<a>`, чтобы не запускать client-side navigation другого Next-приложения.
- Header визуально синхронизирован с shell, но индикатор корзины и аккаунта остаются временными заглушками до подключения remotes.

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
- индикатор корзины и аккаунт в Header пока не подключены к Module Federation remotes.
