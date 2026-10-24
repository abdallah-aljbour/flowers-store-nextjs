import { Amiri, IBM_Plex_Sans_Arabic, Cormorant_Garamond } from "next/font/google";
import localFont from "next/font/local";

// Preloading: only the Arabic files of the body font. The display and Latin faces load
// when used (display: swap), so the fonts don't compete with CSS and the hero.
// Only the weights the design uses are loaded (font-medium falls back to Plex 400).

// Arabic display: headings, product names (all bold)
export const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["700"],
  style: ["normal"],
  variable: "--font-amiri",
  display: "swap",
  preload: false,
});

// Hero accent word «المناسبات» in thin Amiri italic. Self-hosted subset (~8 KB)
// with only that word's letters, instead of the full 109 KB italic file.
// Amiri is SIL Open Font License; subset made with fonttools (pyftsubset).
export const amiriAccent = localFont({
  src: "./fonts/amiri-italic-accent.woff2",
  weight: "400",
  style: "italic",
  variable: "--font-amiri-accent",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

// UI + body text
export const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"], // preloaded subset; Latin glyphs still load from the font on use
  weight: ["400", "600"],
  variable: "--font-plex-arabic",
  display: "swap",
});

// Latin: English names, eyebrows, numbers
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
  preload: false,
});
