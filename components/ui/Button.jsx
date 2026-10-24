import Link from "next/link";
import { WA_CTA } from "lib/contact";

// Button variants from DESIGN_SPEC §3.1. Renders a <Link> when `href` is set,
// a plain <a> when `external`, otherwise a <button>.
const VARIANTS = {
  // Pearl Outline — the primary action everywhere
  primary:
    "bg-white text-rose border-[1.5px] border-rose font-semibold rounded-full [@media(hover:hover)]:[&:not(:disabled):hover]:bg-rose [@media(hover:hover)]:[&:not(:disabled):hover]:text-white disabled:border-rose-disabled disabled:text-rose-disabled disabled:cursor-not-allowed",
  // The only filled, saturated button on the site
  whatsapp: "bg-whatsapp text-white font-semibold rounded-full",
  // Underlined text link, no box
  text: "text-ink font-medium underline decoration-line-link decoration-1 underline-offset-[6px] hover:decoration-rose",
  // 44×44 circle
  icon: "bg-white border border-line text-ink rounded-full",
  // 44×44 circle on top of photos
  "icon-photo": "bg-white/95 text-ink rounded-full",
};

const SIZES = {
  md: "min-h-[48px] px-[22px] text-[15px]",
  lg: "min-h-[54px] px-7 text-base",
};

export function buttonClasses({ variant = "primary", size = "md", className = "" } = {}) {
  const isIcon = variant === "icon" || variant === "icon-photo";
  const isText = variant === "text";
  return [
    "mb-tap inline-flex items-center justify-center gap-2 transition-colors duration-200 select-none",
    VARIANTS[variant],
    isIcon ? "w-11 h-11 shrink-0 p-0" : isText ? "min-h-tap px-1" : SIZES[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export default function Button({
  variant = "primary",
  size = "md",
  href,
  external = false,
  className = "",
  children,
  ...props
}) {
  const classes = buttonClasses({ variant, size, className });
  const cta = variant === "whatsapp" ? WA_CTA : null;

  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...cta} {...props}>
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes} {...cta} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...cta} {...props}>
      {children}
    </button>
  );
}
