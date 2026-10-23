import Image from "next/image";

// Maskat Blooms vector logo (public/brand). Square artwork.
export default function Logo({ size = 54, tone = "taupe", priority = false, className = "" }) {
  return (
    <Image
      src={`/brand/maskat-blooms-logo-${tone}.svg`}
      alt="Maskat Blooms — متجر المسكات"
      width={size}
      height={size}
      priority={priority}
      unoptimized
      className={`block ${className}`}
    />
  );
}
