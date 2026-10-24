"use client";

import { useState } from "react";
import Image from "next/image";

// next/image (fill) with a champagne shimmer underneath until the photo has loaded, then a
// fade-in. The parent must be positioned (it already is for `fill`). The shimmer element is
// removed once loaded, so nothing keeps animating behind the photo.
// Priority photos (above the fold, often the LCP) show as soon as they arrive, without the
// fade: hiding them until JS runs would delay the largest paint.
export default function ProductImage({ alt, priority = false, className = "", onLoad, ...props }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <span aria-hidden="true" className="mb-shimmer absolute inset-0" />}
      <Image
        {...props}
        alt={alt}
        fill
        priority={priority}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        className={`${className} transition-opacity duration-500 motion-reduce:transition-none ${
          loaded || priority ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}
