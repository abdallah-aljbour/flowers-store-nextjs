"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import SectionHeading from "components/ui/SectionHeading";
import { usePauseOffscreen } from "hooks/useReveal";
import { splitName } from "lib/splitName";

const TILE =
  "relative shrink-0 block w-[132px] h-[176px] mx-[5px] rounded-[20px] lg:w-[210px] lg:h-[280px] lg:mx-2 lg:rounded-[24px] overflow-hidden bg-champagne-photo";

// Photo strip (DESIGN_SPEC §4.1-7): the list is rendered twice inside .mb-marquee for a
// seamless RTL loop. Pauses off-screen, on hover/touch and while a tile has focus.
// Reduced motion: no loop, the first copy scrolls sideways.
export default function PhotoStrip({ products, loading }) {
  return (
    <section className="mt-14 lg:mt-[104px] flex flex-col gap-4 lg:gap-[22px]">
      <SectionHeading
        eyebrow="From our atelier"
        title="لمحات من المجموعة"
        className="mb-rv px-4 lg:max-w-container lg:w-full lg:mx-auto lg:px-6"
        titleClassName="text-[28px] lg:text-[clamp(2rem,3.4vw,3rem)] lg:leading-[1.2]"
      />
      {products.length > 0 ? (
        <Strip products={products} />
      ) : loading ? (
        <div aria-hidden="true" className="flex overflow-hidden pt-1 pb-[22px] lg:pb-[26px]">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span key={i} className={`${TILE} motion-safe:animate-pulse ${i % 2 ? "mt-[18px]" : ""}`} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function Strip({ products }) {
  const wrapRef = useRef(null);
  usePauseOffscreen(wrapRef);

  const tiles = (copy) =>
    products.map((product, i) => {
      const { ar, en } = splitName(product.name);
      const name = ar || en;
      return (
        <Link
          key={`${copy}-${product.id}`}
          href={`/product/${product.id}`}
          aria-label={name}
          aria-hidden={copy ? true : undefined}
          tabIndex={copy ? -1 : undefined}
          className={`${TILE} ${i % 2 ? "mt-[18px]" : ""} ${copy ? "motion-reduce:hidden" : ""}`}
        >
          <Image
            src={product.images?.[0] || "/placeholder.jpg"}
            alt=""
            fill
            sizes="(min-width: 1024px) 210px, 132px"
            className="object-cover"
            quality={75}
          />
          <span className="absolute bottom-2 right-2 lg:bottom-3 lg:right-3 max-w-[calc(100%-16px)] truncate px-2.5 py-1 lg:px-3 rounded-full bg-pearl/[0.92] text-xs lg:text-[13px] font-medium text-ink">
            {name}
          </span>
        </Link>
      );
    });

  return (
    <div
      ref={wrapRef}
      className="mb-marquee-wrap overflow-hidden motion-reduce:overflow-x-auto pt-1 pb-[22px] lg:pb-[26px]"
    >
      <div className="mb-marquee items-start">
        {tiles(0)}
        {tiles(1)}
      </div>
    </div>
  );
}
