import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Toaster } from "@w1zll/shop-ui";

import { CatalogFooter } from "../components/catalog-footer";
import { CatalogHeader } from "../components/catalog-header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Shop Catalog",
    template: "%s | Shop Catalog",
  },
  description: "Каталог товаров демонстрационного магазина на микрофронтендах.",
  metadataBase: new URL("http://localhost:3001"),
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <div className="flex min-h-screen flex-col bg-[var(--shop-background)] text-[var(--shop-foreground)]">
          <CatalogHeader />
          <main className="flex-1">{children}</main>
          <CatalogFooter />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
