import { Category, Product, ProductList, ProductListQuery } from "./types";

export const fallbackCategories: Category[] = [
  {
    id: "electronics",
    name: "Электроника",
    slug: "electronics",
    description: "Гаджеты, аксессуары и умные устройства для работы и дома.",
    imageUrl: null,
    parentId: null,
    productsCount: 2,
  },
  {
    id: "home",
    name: "Дом",
    slug: "home",
    description: "Товары для кухни, хранения, освещения и спокойного быта.",
    imageUrl: null,
    parentId: null,
    productsCount: 1,
  },
  {
    id: "sport",
    name: "Спорт",
    slug: "sport",
    description: "Инвентарь и аксессуары для активного режима.",
    imageUrl: null,
    parentId: null,
    productsCount: 1,
  },
];

export const fallbackProducts: Product[] = [
  {
    id: "airbeat-lite-headphones",
    name: "Беспроводные наушники AirBeat Lite",
    slug: "airbeat-lite-headphones",
    description: "Легкие TWS-наушники с шумоподавлением и зарядным кейсом.",
    brand: "AirBeat",
    priceCents: 649000,
    oldPriceCents: 799000,
    stock: 42,
    isFeatured: true,
    attributes: { color: "black" },
    category: { id: "electronics", name: "Электроника", slug: "electronics" },
    images: [],
  },
  {
    id: "pulse-pro-smartwatch",
    name: "Смарт-часы Pulse Pro",
    slug: "pulse-pro-smartwatch",
    description: "Часы с AMOLED-экраном, пульсометром и спортивными режимами.",
    brand: "Pulse",
    priceCents: 1299000,
    oldPriceCents: null,
    stock: 31,
    isFeatured: true,
    attributes: { display: "AMOLED" },
    category: { id: "electronics", name: "Электроника", slug: "electronics" },
    images: [],
  },
  {
    id: "glow-desk-lamp",
    name: "Настольная лампа Glow Desk",
    slug: "glow-desk-lamp",
    description: "Лампа с регулировкой яркости и теплой цветовой температурой.",
    brand: "Glow",
    priceCents: 279000,
    oldPriceCents: null,
    stock: 41,
    isFeatured: true,
    attributes: { led: true },
    category: { id: "home", name: "Дом", slug: "home" },
    images: [],
  },
  {
    id: "grip-mat-yoga",
    name: "Коврик для йоги Grip Mat",
    slug: "grip-mat-yoga",
    description: "Нескользящий коврик толщиной 6 мм для домашних тренировок.",
    brand: "Grip Mat",
    priceCents: 259000,
    oldPriceCents: null,
    stock: 44,
    isFeatured: true,
    attributes: { thicknessMm: 6 },
    category: { id: "sport", name: "Спорт", slug: "sport" },
    images: [],
  },
];

function readPositiveInteger(value: string | undefined, fallback: number) {
  const parsedValue = Number(value);

  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
}

function sortFallbackProducts(products: Product[], sort: ProductListQuery["sort"]) {
  const sortedProducts = [...products];

  if (sort === "price-asc") {
    sortedProducts.sort((left, right) => left.priceCents - right.priceCents);
  } else if (sort === "price-desc") {
    sortedProducts.sort((left, right) => right.priceCents - left.priceCents);
  } else if (sort === "name-asc") {
    sortedProducts.sort((left, right) => left.name.localeCompare(right.name, "ru"));
  }

  return sortedProducts;
}

export function createFallbackProductList(
  products = fallbackProducts,
  query: ProductListQuery = {},
): ProductList {
  const prices = products.map((product) => product.priceCents);
  const limit = readPositiveInteger(query.limit, products.length || 12);
  const total = products.length;
  const totalPages = Math.ceil(total / limit);
  const page = Math.min(readPositiveInteger(query.page, 1), Math.max(totalPages, 1));
  const offset = (page - 1) * limit;
  const items = sortFallbackProducts(products, query.sort).slice(offset, offset + limit);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
    availableFilters: {
      brands: [...new Set(products.map((product) => product.brand))].sort(),
      minPriceCents: prices.length > 0 ? Math.min(...prices) : null,
      maxPriceCents: prices.length > 0 ? Math.max(...prices) : null,
      hasInStock: products.some((product) => product.stock > 0),
    },
  };
}
