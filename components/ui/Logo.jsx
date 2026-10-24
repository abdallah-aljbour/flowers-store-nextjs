import Image from "next/image";

// Maskat Blooms vector logo (public/brand). Square artwork.
// loading="eager": fetched with the page but without a high-priority preload, so it does not
// compete with the hero photo (the LCP) on slow connections.
export default function Logo({ size = 54, tone = "taupe", priority = false, loading, className = "" }) {
  return (
    <Image
      src={`/brand/maskat-blooms-logo-${tone}.svg`}
      alt="Maskat Blooms — متجر المسكات"
      width={size}
      height={size}
      priority={priority}
      loading={priority ? undefined : loading}
      unoptimized
      className={`block ${className}`}
    />
  );
}
