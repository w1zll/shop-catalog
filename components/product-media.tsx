import Image from "next/image";

import { ProductImage } from "../lib/types";

interface ProductMediaProps {
  className?: string;
  fallbackLabel: string;
  image?: ProductImage;
  imageClassName?: string;
  loading?: "eager" | "lazy";
}

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function ProductMedia({
  className,
  fallbackLabel,
  image,
  imageClassName,
  loading = "lazy",
}: ProductMediaProps) {
  const frameClassName = joinClassNames(
    "relative flex items-center justify-center overflow-hidden bg-[var(--shop-secondary)] text-sm text-[var(--shop-muted-foreground)]",
    className,
  );

  if (!image?.url) {
    return <div className={frameClassName}>{fallbackLabel}</div>;
  }

  return (
    <div className={frameClassName}>
      <Image
        alt={image.alt || fallbackLabel}
        className={joinClassNames("object-cover", imageClassName)}
        decoding="async"
        fill
        loading={loading}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        src={image.url}
        unoptimized
      />
    </div>
  );
}
