"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import HeartButton from "components/ui/HeartButton";
import { splitName } from "lib/splitName";
import { flowerTypeDisplay } from "lib/catalogOptions";

// Catalog card (DESIGN_SPEC §3.5): 3:4 photo, flower-type pill, heart, bilingual name, price.
// No card background or shadow. Navigation is a plain <Link>; app/template.js gives feedback.
export const ProductCard = ({ product, sizes, priority = false, className = "" }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const mainImage = product.images?.[0] || "/placeholder.jpg";
  const { ar, en } = splitName(product.name);

  return (
    <article className={`mb-lift relative ${className}`}>
      <Link href={`/product/${product.id}`} className="mb-tap block group">
        <div className="mb-curtain relative aspect-[3/4] rounded-card lg:rounded-[24px] overflow-hidden bg-champagne-photo">
          <Image
            src={mainImage}
            alt={`مسكة ${product.flowerType} ${
              product.colors?.join(" و") || ""
            } - ${product.name} - متجر المسكات عمان الأردن`}
            fill
            sizes={sizes || "(max-width: 1024px) 50vw, 300px"}
            className={`object-cover transition-opacity duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            priority={priority}
            loading={priority ? undefined : "lazy"}
            quality={85}
          />

          {product.flowerType && (
            <span className="absolute bottom-2.5 right-2.5 lg:bottom-3 lg:right-3 px-2.5 py-1 rounded-full bg-pearl/[0.92] text-[11px] lg:text-xs font-medium text-ink">
              {flowerTypeDisplay(product.flowerType)}
            </span>
          )}
        </div>

        <div className="mt-2 px-0.5 flex flex-col gap-0.5">
          <h3 className="font-display font-bold text-lg lg:text-[21px] leading-[1.3] text-ink line-clamp-2">
            {ar || en}
          </h3>
          {ar && en && (
            <span dir="ltr" className="text-right font-latin italic text-sm lg:text-base text-ink-muted truncate">
              {en}
            </span>
          )}
          <span className="text-sm lg:text-[15px] font-semibold text-rose">
            {product.salePrice} د.أ
          </span>
        </div>
      </Link>

      <HeartButton
        productId={product.id}
        productName={ar || en}
        variant="photo"
        className="absolute top-1.5 right-1.5 lg:top-2 lg:right-2"
      />
    </article>
  );
};

export default ProductCard;
