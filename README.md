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
- подключение cart remote для Header и product page;
- самостоятельный deploy как Next.js zone.

На текущем этапе catalog zone может работать самостоятельно на `3001` и через shell на `3000`.

## Технологии

- Next.js App Router;
- React Server Components;
- TypeScript strict;
- Tailwind CSS 4;
- `@w1zll/shop-ui`;
- `@module-federation/runtime`;
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
NEXT_PUBLIC_CART_MANIFEST_URL=http://localhost:3002/mf-manifest.json
NEXT_PUBLIC_ACCOUNT_MANIFEST_URL=http://localhost:3003/mf-manifest.json
```

`API_INTERNAL_URL` используется только на сервере и не должен попадать в клиентский bundle.
`NEXT_PUBLIC_SITE_URL` задаёт публичный origin shell для canonical и Open Graph URL.
`NEXT_PUBLIC_CART_MANIFEST_URL` используется только в браузере для загрузки cart remote.
`NEXT_PUBLIC_ACCOUNT_MANIFEST_URL` используется только в браузере для загрузки account remote.

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

Для проверки cart remote рядом должны быть запущены:

```text
shop-api      http://localhost:4000
shop-mf-cart  http://localhost:3002
```

При standalone запуске catalog проксирует `/api/v1/*` на `http://localhost:4000`, чтобы cart
remote мог выполнять same-origin browser-запросы к Cart API.

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
- Header использует `CartIndicator` из cart remote. Account controls остаются временной заглушкой.

## Module Federation

Catalog использует Module Federation Runtime в client components и не подключает Next Federation Plugin.

Подключены exposed-компоненты cart remote:

```text
cart/CartIndicator
cart/AddToCartButton
```

`CartIndicator` рендерится в Header. `AddToCartButton` рендерится на `/product/[slug]`.
SEO-критичный контент страницы товара остаётся серверным: название, описание, цена, metadata и JSON-LD
не зависят от успешной загрузки remote.

Если remote недоступен, catalog показывает fallback-кнопку и fallback-индикатор корзины.

## Проверки

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Деплой на Vercel

Catalog разворачивается как Next.js-приложение. В `vercel.json` зафиксированы команды install/build, чтобы Vercel до установки зависимостей настроил доступ к приватному `@w1zll/shop-ui`.

Настройки проекта:

```text
Framework Preset: Next.js
Install Command: corepack enable && pnpm config set @w1zll:registry https://npm.pkg.github.com && pnpm config set '//npm.pkg.github.com/:_authToken' "$NPM_TOKEN" && pnpm install --frozen-lockfile
Build Command: pnpm build
```

Переменные окружения:

```text
NODE_VERSION=24
NPM_TOKEN=<GitHub Packages token с read:packages>
API_INTERNAL_URL=https://<render-api-host>/api/v1
NEXT_PUBLIC_SITE_URL=https://<shell-host>
NEXT_PUBLIC_CART_MANIFEST_URL=https://<cart-remote-host>/mf-manifest.json
NEXT_PUBLIC_ACCOUNT_MANIFEST_URL=https://<account-remote-host>/mf-manifest.json
```

После настройки shell proxy manifest URLs должны стать same-origin:

```text
NEXT_PUBLIC_CART_MANIFEST_URL=/mf/cart/mf-manifest.json
NEXT_PUBLIC_ACCOUNT_MANIFEST_URL=/mf/account/mf-manifest.json
```

## Текущие ограничения

- данные берутся из API, но при недоступном API используется локальный fallback;
- фильтры, сортировка и пагинация пока реализованы как URL links;
- account в Header пока не подключён к Module Federation remote.
