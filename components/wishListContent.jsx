"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Plus } from "lucide-react";
import { useWishlist } from "hooks/useWishlist";
import { useReveal } from "hooks/useReveal";
import { productsService } from "services/productsService";
import Header from "components/Header";
import Footer from "components/Footer";
import Button from "components/ui/Button";
import HeartButton from "components/ui/HeartButton";
import WhatsAppIcon from "components/ui/WhatsAppIcon";
import { Eyebrow } from "components/ui/SectionHeading";
import { splitName } from "lib/splitName";
import { flowerTypeDisplay } from "lib/catalogOptions";
import { whatsappOrderUrl } from "lib/whatsappMessage";
import { SHOP_PATH } from "lib/navigation";

export default function WishlistPageContent() {
  const { wishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (wishlist.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // جلب المنتجات من Firebase
        const allProducts = await productsService.getAll();
        const wishlistProducts = allProducts.filter((p) =>
          wishlist.includes(p.id)
        );
        setProducts(wishlistProducts);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlist]);

  // Display only: drop a removed item right away instead of waiting for the refetch
  const saved = products.filter((p) => wishlist.includes(p.id));
  const showSkeleton = loading && saved.length === 0;
  const isEmpty = !loading && saved.length === 0;

  useReveal([saved.length]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-container mx-auto">
        {/* Heading */}
        <div className="px-4 pt-6 pb-2 lg:px-6 lg:pt-12 flex flex-wrap items-end justify-between gap-3 lg:gap-4">
          <div className="flex flex-col gap-0.5 lg:gap-1">
            <Eyebrow className="!text-xl lg:!text-2xl">Saved for you</Eyebrow>
            <h1 className="font-display font-bold text-ink text-4xl leading-[1.2] lg:text-[clamp(2.5rem,4.4vw,3.75rem)] lg:leading-[1.15]">
              المفضلة
            </h1>
            <p role="status" className="mt-0.5 lg:mt-1 text-sm lg:text-[17px] text-ink-muted">
              {saved.length > 0 ? savedLabel(saved.length) : ""}
            </p>
          </div>

          {!isEmpty && (
            <>
              <Button variant="text" href={SHOP_PATH} className="lg:hidden text-sm font-semibold">
                تابعي التسوّق
              </Button>
              <Button href={SHOP_PATH} className="max-lg:hidden min-h-[50px] px-6">
                تابعي التسوّق
                <ArrowLeft className="w-[18px] h-[18px]" strokeWidth={1.8} aria-hidden="true" />
              </Button>
            </>
          )}
        </div>

        {showSkeleton ? (
          <WishlistSkeleton />
        ) : isEmpty ? (
          <EmptyState />
        ) : (
          <>
            {/* Mobile: rows */}
            <ul className="lg:hidden px-4 pt-3.5 flex flex-col gap-3">
              {saved.map((product) => (
                <WishlistRow key={product.id} product={product} />
              ))}
            </ul>
            <Link
              href={SHOP_PATH}
              className="mb-tap lg:hidden mx-4 mt-[22px] mb-10 h-14 rounded-full border border-dashed border-line-gold flex items-center justify-center gap-2 text-sm font-medium text-ink"
            >
              <Plus className="w-[18px] h-[18px] text-rose" strokeWidth={1.8} aria-hidden="true" />
              أضيفي المزيد من المجموعة
            </Link>

            {/* Desktop: card grid + "add more" tile */}
            <ul className="max-lg:hidden px-6 pt-9 grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-x-[22px] gap-y-9">
              {saved.map((product) => (
                <WishlistCard key={product.id} product={product} />
              ))}
              <li>
                <Link
                  href={SHOP_PATH}
                  className="mb-tap h-full min-h-[360px] rounded-[26px] border border-dashed border-line-gold flex flex-col items-center justify-center gap-3.5 text-ink transition-colors hover:bg-champagne"
                >
                  <span className="w-16 h-16 rounded-full border-[1.5px] border-rose flex items-center justify-center">
                    <Plus className="w-[26px] h-[26px] text-rose" strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <span className="font-display font-bold text-[22px]">أضيفي المزيد</span>
                  <span className="text-sm text-ink-muted">تصفّحي المجموعة الكاملة</span>
                </Link>
              </li>
            </ul>
          </>
        )}
      </main>

      <Footer compact className="mt-12 lg:mt-24" />
    </div>
  );
}

// "N تصاميم محفوظة" with Arabic number agreement
function savedLabel(n) {
  if (n === 1) return "تصميم واحد محفوظ";
  if (n === 2) return "تصميمان محفوظان";
  if (n >= 3 && n <= 10) return `${n} تصاميم محفوظة`;
  return `${n} تصميماً محفوظاً`;
}

function tagLine(product) {
  return [product.flowerType && flowerTypeDisplay(product.flowerType), product.category]
    .filter(Boolean)
    .join(" · ");
}

function productAlt(product) {
  return `مسكة ${product.flowerType} ${
    product.colors?.join(" و") || ""
  } - ${product.name} - متجر المسكات عمان الأردن`;
}

function OrderLink({ product, name, className = "", children }) {
  return (
    <a
      href={whatsappOrderUrl(product)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`اطلبي ${name} عبر واتساب`}
      className={`mb-tap inline-flex items-center justify-center gap-1.5 rounded-full bg-whatsapp text-white font-semibold ${className}`}
    >
      <WhatsAppIcon className="w-4 h-4 shrink-0" strokeWidth={1.8} />
      {children}
    </a>
  );
}

// Mobile row: image 108×140 · names · tag · price · heart · اطلبي
function WishlistRow({ product }) {
  const { ar, en } = splitName(product.name);
  const name = ar || en;
  const tag = tagLine(product);

  return (
    <li className="mb-rv bg-white border border-line rounded-[24px] p-2.5 flex gap-3.5">
      <Link
        href={`/product/${product.id}`}
        className="mb-tap relative shrink-0 w-[108px] h-[140px] rounded-[18px] overflow-hidden bg-champagne-photo"
      >
        <Image
          src={product.images?.[0] || "/placeholder.jpg"}
          alt={productAlt(product)}
          fill
          sizes="108px"
          className="object-cover"
          quality={80}
        />
      </Link>

      <div className="flex-1 min-w-0 flex flex-col gap-0.5 py-1">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0 flex flex-col gap-0.5">
            <h2 className="font-display font-bold text-[19px] leading-[1.3] text-ink">
              <Link href={`/product/${product.id}`}>{name}</Link>
            </h2>
            {ar && en && (
              <span dir="ltr" className="text-right font-latin italic text-sm text-ink-muted truncate">
                {en}
              </span>
            )}
          </div>
          <HeartButton
            productId={product.id}
            productName={name}
            variant="rose"
            iconClassName="w-[18px] h-[18px]"
            className="-mt-1.5 -ml-1.5"
          />
        </div>

        {tag && <span className="mt-0.5 text-xs text-ink-muted">{tag}</span>}

        <div className="mt-auto pt-2 flex items-center justify-between gap-2">
          <span className="font-display font-bold text-xl text-rose">
            {product.salePrice} <span className="font-sans font-medium text-xs">د.أ</span>
          </span>
          <OrderLink product={product} name={name} className="min-h-tap px-3.5 text-[13px]">
            اطلبي
          </OrderLink>
        </div>
      </div>
    </li>
  );
}

// Desktop card: 3:4 photo with heart · names + price · full-width WhatsApp
function WishlistCard({ product }) {
  const { ar, en } = splitName(product.name);
  const name = ar || en;

  return (
    <li className="mb-lift flex flex-col gap-3">
      <div className="relative">
        <Link
          href={`/product/${product.id}`}
          className="mb-curtain relative block aspect-[3/4] rounded-[26px] overflow-hidden bg-champagne-photo"
        >
          <Image
            src={product.images?.[0] || "/placeholder.jpg"}
            alt={productAlt(product)}
            fill
            sizes="(max-width: 1240px) 33vw, 300px"
            className="object-cover"
            quality={85}
          />
        </Link>
        <HeartButton
          productId={product.id}
          productName={name}
          variant="overlay"
          className="absolute top-3 right-3"
        />
      </div>

      <div className="flex justify-between items-start gap-3 px-1">
        <div className="min-w-0 flex flex-col gap-0.5">
          <h2 className="font-display font-bold text-[22px] leading-[1.3] text-ink">
            <Link href={`/product/${product.id}`} className="hover:text-rose transition-colors">
              {name}
            </Link>
          </h2>
          {ar && en && (
            <span dir="ltr" className="text-right font-latin italic text-base text-ink-muted truncate">
              {en}
            </span>
          )}
        </div>
        <span className="shrink-0 text-base font-semibold text-rose">{product.salePrice} د.أ</span>
      </div>

      <OrderLink product={product} name={name} className="h-[50px] text-[15px] gap-2">
        اطلبي عبر واتساب
      </OrderLink>
    </li>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-9 pt-10 pb-20 gap-3.5">
      <div className="mb-2.5 w-[190px] h-[190px] rounded-full border border-line-gold flex items-center justify-center">
        <div className="w-[170px] h-[170px] rounded-full bg-champagne flex items-center justify-center">
          <svg
            width="92"
            height="92"
            viewBox="0 0 96 96"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="text-rose"
          >
            <path d="M48 22c-3-5-10-6-12-1-2 4 2 9 6 9" />
            <path d="M48 22c3-5 10-6 12-1 2 4-2 9-6 9" />
            <circle cx="48" cy="28" r="6" />
            <circle cx="34" cy="34" r="6" />
            <circle cx="62" cy="34" r="6" />
            <path d="M34 40l10 18M62 40L52 58M48 34v24" />
            <path d="M40 56h16l-3 26h-10z" />
          </svg>
        </div>
      </div>
      <h2 className="font-display font-bold text-[30px] leading-[1.3] text-ink">قائمتكِ فارغة الآن</h2>
      <p className="max-w-[340px] text-[15px] leading-[1.8] text-ink-muted">
        اضغطي على القلب فوق أي مسكة لحفظها هنا، وارجعي لها وقتما تشائين.
      </p>
      <Button href={SHOP_PATH} className="mt-3 min-h-[52px] px-7">
        تصفّحي المجموعة
        <ArrowLeft className="w-[18px] h-[18px]" strokeWidth={1.8} aria-hidden="true" />
      </Button>
    </div>
  );
}

function WishlistSkeleton() {
  return (
    <div aria-hidden="true" className="motion-safe:animate-pulse">
      <div className="lg:hidden px-4 pt-3.5 flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-white border border-line rounded-[24px] p-2.5 flex gap-3.5">
            <div className="w-[108px] h-[140px] rounded-[18px] bg-champagne-photo" />
            <div className="flex-1 py-2 flex flex-col gap-2">
              <div className="h-5 w-3/4 rounded-full bg-champagne" />
              <div className="h-3.5 w-1/2 rounded-full bg-champagne" />
            </div>
          </div>
        ))}
      </div>
      <div className="max-lg:hidden px-6 pt-9 grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-x-[22px] gap-y-9">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="aspect-[3/4] rounded-[26px] bg-champagne-photo" />
            <div className="h-5 w-2/3 rounded-full bg-champagne" />
            <div className="h-[50px] rounded-full bg-champagne" />
          </div>
        ))}
      </div>
    </div>
  );
}
