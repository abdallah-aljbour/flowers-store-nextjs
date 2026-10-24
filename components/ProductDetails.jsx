"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Share2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Truck,
  Instagram,
} from "lucide-react";
import { useToast } from "contexts/ToastContext";
import { useReveal } from "hooks/useReveal";
import Header from "components/Header";
import Footer from "components/Footer";
import HeartButton from "components/ui/HeartButton";
import WhatsAppIcon from "components/ui/WhatsAppIcon";
import { Eyebrow } from "components/ui/SectionHeading";
import { splitName } from "lib/splitName";
import { COLORS, flowerTypeDisplay } from "lib/catalogOptions";
import { handleOrder as openOrder } from "lib/whatsappMessage";
import { getRelatedProducts } from "lib/relatedProducts";
import { SHOP_PATH } from "lib/navigation";

const GALLERY_SIZES = "(min-width: 1024px) 50vw, 100vw";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Product page (DESIGN_SPEC §4.5). Mobile: full-bleed swipe gallery, content sheet,
// sticky order bar. Desktop: breadcrumb, thumbnails + main photo, sticky info column.
export const ProductDetails = ({ product, onBack }) => {
  const { success } = useToast();
  const [index, setIndex] = useState(0);
  const [related, setRelated] = useState([]);

  const images = product.images || [];
  const colors = product.colors || [];
  const { ar, en } = splitName(product.name);
  const title = ar || en;

  useEffect(() => {
    setRelated(getRelatedProducts(product));
  }, [product]);

  useReveal([related]);

  const imageAlt = (i) =>
    `مسكة ${product.flowerType} ${colors.join(" و") || ""} - ${
      product.name
    } - صورة ${i + 1} من ${images.length} - متجر المسكات`;

  const handleOrder = (platform) => openOrder(product, platform);

  const handleShare = async () => {
    const shareData = {
      title: `${product.name} - متجر المسكات`,
      text: `${product.name}\n💐 ${product.flowerType}\n💰 ${product.salePrice} دينار\n\n${product.description}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        success("تمت المشاركة");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        success("تم نسخ رابط المسكة");
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Share error:", err);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header className="max-lg:hidden" />

      {/* Desktop breadcrumb */}
      <nav
        aria-label="مسار التنقل"
        className="hidden lg:flex flex-wrap gap-2 max-w-container w-full mx-auto px-6 pt-[26px] text-sm text-ink-muted"
      >
        <Link href="/" className="hover:text-rose">الرئيسية</Link>
        <span aria-hidden="true">/</span>
        <Link href={SHOP_PATH} className="hover:text-rose">المجموعة</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="text-ink">{title}</span>
      </nav>

      <div className="w-full lg:max-w-container lg:mx-auto lg:px-6 lg:pt-[26px] lg:flex lg:items-start lg:gap-[60px]">
        <section aria-label="صور المسكة" className="lg:flex-[1_1_500px] lg:min-w-0">
          <MobileGallery
            images={images}
            index={index}
            onIndexChange={setIndex}
            imageAlt={imageAlt}
            onBack={onBack}
            onShare={handleShare}
            product={product}
            title={title}
          />
          <DesktopGallery images={images} index={index} onIndexChange={setIndex} imageAlt={imageAlt} />
        </section>

        {/* Content sheet (mobile) / sticky info column (desktop) */}
        <div className="relative -mt-6 rounded-t-[28px] bg-pearl px-5 pt-[26px] flex flex-col gap-[22px] lg:mt-0 lg:rounded-none lg:p-0 lg:flex-[1_1_400px] lg:min-w-0 lg:sticky lg:top-[112px] lg:gap-6">
          <div className="flex flex-col gap-1.5 lg:gap-2">
            <div className="flex items-center gap-2">
              {product.flowerType && (
                <span className="px-3 py-1 rounded-full border border-line-gold text-xs lg:text-[13px] font-medium text-ink">
                  {flowerTypeDisplay(product.flowerType)}
                </span>
              )}
              {product.category && (
                <span className="text-[13px] lg:text-sm text-ink-muted">{product.category}</span>
              )}
            </div>

            <h1 className="mt-1 lg:mt-1.5 flex flex-col gap-1.5 lg:gap-2">
              <span className="font-display font-bold text-[34px] lg:text-[clamp(2.5rem,4vw,3.4rem)] leading-[1.2] lg:leading-[1.15] text-ink">
                {title}
              </span>
              {ar && en && (
                <span dir="ltr" className="text-right font-latin italic font-normal text-[22px] lg:text-[28px] leading-snug text-ink-muted">
                  {en}
                </span>
              )}
            </h1>

            <p className="mt-2 flex items-baseline gap-1.5 lg:gap-2 text-rose">
              <span className="font-display font-bold text-[38px] lg:text-[46px] leading-none">
                {product.salePrice}
              </span>
              <span className="text-[15px] lg:text-base font-medium">دينار أردني</span>
            </p>
          </div>

          <div className="h-px bg-line" />

          {colors.length > 0 && (
            <div className="flex flex-col gap-2.5">
              <h2 className="text-[15px] font-semibold text-ink">الألوان المتاحة</h2>
              <ul className="flex flex-wrap gap-2">
                {colors.map((color, i) => (
                  <li
                    key={i}
                    className="h-9 lg:h-[38px] pr-3.5 pl-3 rounded-full bg-white border border-line flex items-center gap-2 text-[13px] lg:text-sm text-ink"
                  >
                    <span
                      aria-hidden="true"
                      className="w-[18px] h-[18px] rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]"
                      style={{ background: colorFill(color) }}
                    />
                    <bdi>{color}</bdi>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.description && <Description text={product.description} />}

          {/* Desktop order actions */}
          <div className="hidden lg:flex flex-col gap-3">
            <div className="flex gap-2.5">
              <OrderButton onClick={() => handleOrder("whatsapp")} className="flex-1 h-[58px] text-[17px] shadow-[0_12px_28px_rgba(31,122,77,0.24)]" />
              <HeartButton
                productId={product.id}
                productName={title}
                variant="rose-lg"
                iconClassName="w-[22px] h-[22px]"
                className="!w-[58px] !h-[58px]"
              />
            </div>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => handleOrder("instagram")}
                className="mb-tap flex-1 h-[50px] rounded-full border-[1.5px] border-rose bg-white text-rose text-[15px] font-semibold flex items-center justify-center gap-2 transition-colors [@media(hover:hover)]:hover:bg-rose [@media(hover:hover)]:hover:text-white"
              >
                <Instagram className="w-[19px] h-[19px]" strokeWidth={1.6} aria-hidden="true" />
                أو عبر إنستغرام
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="mb-tap flex-1 h-[50px] rounded-full border border-line bg-white text-ink text-[15px] font-medium flex items-center justify-center gap-2 transition-colors hover:border-line-gold"
              >
                <Share2 className="w-[18px] h-[18px]" strokeWidth={1.7} aria-hidden="true" />
                مشاركة
              </button>
            </div>
          </div>

          <ul className="grid grid-cols-2 gap-2.5">
            <li className="bg-champagne rounded-[18px] lg:rounded-[20px] p-3.5 lg:p-4 flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 text-[13px] lg:text-sm leading-relaxed text-ink">
              <Truck className="w-[22px] h-[22px] shrink-0 text-rose" strokeWidth={1.6} aria-hidden="true" />
              توصيل لجميع مناطق الأردن
            </li>
            <li className="bg-champagne rounded-[18px] lg:rounded-[20px] p-3.5 lg:p-4 flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 text-[13px] lg:text-sm leading-relaxed text-ink">
              <WhatsAppIcon className="w-[22px] h-[22px] shrink-0 text-whatsapp" strokeWidth={1.6} />
              الطلب والتنسيق مباشرة عبر واتساب
            </li>
          </ul>
        </div>
      </div>

      {related.length > 0 && <RelatedProducts products={related} />}

      {/* Room for the fixed order bar on mobile */}
      <div aria-hidden="true" className="h-[118px] lg:hidden" />

      <Footer compact className="max-lg:hidden mt-24" />

      <OrderBar price={product.salePrice} onOrder={handleOrder} />
    </div>
  );
};

/* ---------- Mobile gallery: native scroll-snap strip ---------- */

function MobileGallery({ images, index, onIndexChange, imageAlt, onBack, onShare, product, title }) {
  const stripRef = useRef(null);
  const frame = useRef(0);
  const count = images.length;

  // RTL: scrollLeft is 0 at the first slide and negative towards the left
  const dirSign = () =>
    stripRef.current && getComputedStyle(stripRef.current).direction === "rtl" ? -1 : 1;

  const handleScroll = () => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const el = stripRef.current;
      if (!el || !el.clientWidth) return;
      const i = Math.round(Math.abs(el.scrollLeft) / el.clientWidth);
      if (i !== index && i >= 0 && i < count) onIndexChange(i);
    });
  };

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const goTo = (i) => {
    const el = stripRef.current;
    if (!el || !count) return;
    const target = (i + count) % count;
    el.scrollTo({
      left: dirSign() * target * el.clientWidth,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
    onIndexChange(target);
  };

  // Keep the strip in sync when the index changes from the desktop thumbnails
  useEffect(() => {
    const el = stripRef.current;
    if (!el || !el.clientWidth) return;
    const current = Math.round(Math.abs(el.scrollLeft) / el.clientWidth);
    if (current !== index) el.scrollTo({ left: dirSign() * index * el.clientWidth });
  }, [index]);

  const overlayButton =
    "mb-tap w-11 h-11 rounded-full bg-pearl/[0.94] flex items-center justify-center text-ink";

  return (
    <div className="lg:hidden relative w-full aspect-[4/5] max-h-[82vh] bg-champagne-photo">
      <div
        ref={stripRef}
        onScroll={handleScroll}
        className="absolute inset-0 flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory overscroll-x-contain scrollbar-hide"
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="relative shrink-0 w-full h-full snap-start"
            aria-hidden={i !== index ? "true" : undefined}
          >
            <FadeImage
              src={src}
              alt={imageAlt(i)}
              sizes={GALLERY_SIZES}
              priority={i === 0}
              loading={i === 0 ? undefined : i === 1 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {/* Legibility gradient for the top icons */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[110px] bg-gradient-to-b from-ink/[0.22] to-ink/0"
      />

      <div className="absolute top-3 inset-x-4 flex justify-between">
        <button type="button" onClick={onBack} aria-label="رجوع" className={overlayButton}>
          <ArrowRight className="w-5 h-5" strokeWidth={1.8} aria-hidden="true" />
        </button>
        <div className="flex gap-2">
          <button type="button" onClick={onShare} aria-label="مشاركة" className={overlayButton}>
            <Share2 className="w-[19px] h-[19px]" strokeWidth={1.7} aria-hidden="true" />
          </button>
          <HeartButton productId={product.id} productName={title} variant="overlay" />
        </div>
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="الصورة التالية"
            className="mb-tap absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-pearl/[0.88] flex items-center justify-center text-ink"
          >
            <ChevronLeft className="w-[18px] h-[18px]" strokeWidth={1.8} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="الصورة السابقة"
            className="mb-tap absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-pearl/[0.88] flex items-center justify-center text-ink"
          >
            <ChevronRight className="w-[18px] h-[18px]" strokeWidth={1.8} aria-hidden="true" />
          </button>

          <div className="absolute bottom-[34px] inset-x-0 flex justify-center gap-0.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`الصورة ${i + 1} من ${count}`}
                aria-current={i === index ? "true" : undefined}
                className="w-8 h-8 flex items-center justify-center"
              >
                <span
                  className={`h-1 rounded-full transition-[width,background-color] duration-300 ease-soft ${
                    i === index ? "w-[22px] bg-white" : "w-2 bg-white/60"
                  }`}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- Desktop gallery: vertical thumbnails + main photo ---------- */

function DesktopGallery({ images, index, onIndexChange, imageAlt }) {
  const count = images.length;

  return (
    <div className="hidden lg:flex gap-3.5">
      {count > 1 && (
        <div className="flex flex-col gap-3 shrink-0">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onIndexChange(i)}
              aria-label={`الصورة ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className={`relative w-[84px] h-[108px] rounded-2xl overflow-hidden bg-champagne-photo border-[1.5px] transition-[opacity,border-color] duration-200 ${
                i === index ? "border-rose" : "border-transparent opacity-[0.72] hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="84px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="relative flex-1 min-w-0 aspect-[4/5] rounded-[32px] overflow-hidden bg-champagne-photo">
        {images[index] && (
          <FadeImage
            key={index}
            src={images[index]}
            alt={imageAlt(index)}
            sizes={GALLERY_SIZES}
            priority={index === 0}
          />
        )}
        {count > 1 && (
          <span
            dir="ltr"
            className="absolute bottom-[18px] left-[18px] px-3 py-1.5 rounded-full bg-pearl/[0.92] text-[13px] text-ink"
          >
            {index + 1} / {count}
          </span>
        )}
      </div>
    </div>
  );
}

// next/image on a champagne placeholder, fading in once loaded (no spinner).
// The priority (first) photo shows at once: a fade from opacity 0 delays LCP.
function FadeImage({ src, alt, sizes, priority = false, loading }) {
  const [loaded, setLoaded] = useState(priority);
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : loading}
      quality={90}
      onLoad={() => setLoaded(true)}
      className={`object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
    />
  );
}

/* ---------- Description: 4-line clamp + read more ---------- */

function Description({ text }) {
  const ref = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);

  useLayoutEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (!el || expanded) return;
      setOverflows(el.scrollHeight > el.clientHeight + 1);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [text, expanded]);

  return (
    <div className="flex flex-col gap-2.5">
      <h2 className="text-[15px] font-semibold text-ink">عن المسكة</h2>
      <p
        ref={ref}
        id="product-description"
        className={`text-[15px] lg:text-base leading-[1.9] lg:leading-[1.95] text-ink ${
          expanded ? "" : "line-clamp-4"
        }`}
      >
        {text}
      </p>
      {(overflows || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls="product-description"
          className="self-start min-h-tap flex items-center gap-1.5 text-sm font-semibold text-rose"
        >
          <span className="border-b border-line-link pb-0.5">{expanded ? "عرض أقل" : "اقرئي المزيد"}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  );
}

/* ---------- Related products (from the cached catalog) ---------- */

function RelatedProducts({ products }) {
  return (
    <section
      aria-labelledby="related-title"
      className="mb-rv mt-9 lg:mt-0 lg:pt-24 w-full lg:max-w-container lg:mx-auto lg:px-6 flex flex-col gap-3.5 lg:gap-[26px]"
    >
      <div className="px-5 lg:px-0">
        <Eyebrow className="lg:!text-[22px]">You may also love</Eyebrow>
        <h2 id="related-title" className="font-display font-bold text-[26px] lg:text-[clamp(1.9rem,3vw,2.6rem)] leading-[1.3] text-ink">
          قد يعجبكِ أيضًا
        </h2>
      </div>

      <ul className="flex gap-3 overflow-x-auto scrollbar-hide px-5 lg:px-0 lg:grid lg:grid-cols-4 lg:gap-[22px] lg:overflow-visible">
        {products.map((p) => {
          const name = splitName(p.name);
          return (
            <li key={p.id} className="shrink-0 w-[150px] lg:w-auto">
              <Link href={`/product/${p.id}`} className="mb-tap mb-lift flex flex-col gap-1.5 lg:gap-2 text-ink">
                <span className="relative block aspect-[3/4] rounded-[20px] lg:rounded-[24px] overflow-hidden bg-champagne-photo">
                  {p.images?.[0] && (
                    <Image
                      src={p.images[0]}
                      alt={`مسكة ${p.flowerType} ${p.colors?.join(" و") || ""} - ${p.name} - متجر المسكات عمان الأردن`}
                      fill
                      sizes="(min-width: 1024px) 280px, 150px"
                      className="object-cover"
                    />
                  )}
                </span>
                <span className="flex flex-col lg:flex-row lg:items-baseline lg:justify-between gap-0.5 lg:px-1">
                  <span className="font-display font-bold text-base lg:text-xl leading-snug line-clamp-1">
                    {name.ar || name.en}
                  </span>
                  <span className="text-[13px] lg:text-[15px] font-semibold text-rose shrink-0">
                    {p.salePrice} د.أ
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ---------- Mobile sticky order bar ---------- */

function OrderButton({ onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mb-tap relative overflow-hidden rounded-full bg-whatsapp text-white font-semibold flex items-center justify-center gap-2 ${className}`}
    >
      <span aria-hidden="true" className="mb-shine" />
      <WhatsAppIcon className="w-[21px] h-[21px]" />
      اطلبي عبر واتساب
    </button>
  );
}

// Portaled to <body> so position:fixed is never trapped by the page-transition transform
function OrderBar({ price, onOrder }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 mb-bar-in bg-pearl/[0.97] border-t border-line shadow-[0_-10px_30px_rgba(75,63,54,0.06)] px-4 pt-3 pb-[max(22px,env(safe-area-inset-bottom))] flex items-center gap-2.5">
      <p className="flex flex-col pl-1 text-ink">
        <span className="text-[11px] text-ink-muted">السعر</span>
        <span className="font-display font-bold text-[22px] leading-[1.2]">
          {price} <span className="font-sans font-medium text-xs">د.أ</span>
        </span>
      </p>
      <OrderButton
        onClick={() => onOrder("whatsapp")}
        className="flex-1 h-[54px] text-base shadow-whatsapp"
      />
      <button
        type="button"
        onClick={() => onOrder("instagram")}
        aria-label="اطلبي عبر إنستغرام"
        className="mb-tap w-[54px] h-[54px] shrink-0 rounded-full border-[1.5px] border-rose bg-white text-rose flex items-center justify-center"
      >
        <Instagram className="w-[22px] h-[22px]" strokeWidth={1.6} aria-hidden="true" />
      </button>
    </div>,
    document.body
  );
}

// Swatch fill for a stored colour name (bags store hex values directly)
const colorFill = (color) =>
  COLORS.find((c) => c.value === color)?.hex ||
  (/^#[0-9a-f]{3,8}$/i.test(color) ? color : "#9CA3AF");

export default ProductDetails;
