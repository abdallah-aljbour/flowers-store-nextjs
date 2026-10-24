"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductImage from "components/ui/ProductImage";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";
import { useProducts } from "hooks/useProducts";
import { useReveal } from "hooks/useReveal";
import Header from "components/Header";
import Footer from "components/Footer";
import Button from "components/ui/Button";
import WhatsAppIcon from "components/ui/WhatsAppIcon";
import WhatsAppFab from "components/ui/WhatsAppFab";
import HomeIntro from "components/home/HomeIntro";
import Lookbook from "components/home/Lookbook";
import PackageStory from "components/home/PackageStory";
import PhotoStrip from "components/home/PhotoStrip";
import { splitName } from "lib/splitName";
import { productAlt } from "lib/productAlt";
import { SHOP_PATH } from "lib/navigation";
import { WHATSAPP_URL, WA_CTA } from "lib/contact";

// Hero photo: the bride with white tulips (product "مكس الجمال", Cloudinary)
const HERO_IMAGE =
  "https://res.cloudinary.com/dz74tentr/image/upload/v1775604429/e-commerce/cs6herdrk55ejs21qlpy.jpg";

// Hero entrance delays start after the logo intro (--mb-hero-base is set by HomeIntro)
const heroDelay = (seconds) => ({
  animationDelay: `calc(var(--mb-hero-base, 0s) + ${seconds}s)`,
});

// Home landing (DESIGN_SPEC §4.1). Products come from the existing catalog hook:
// first 4 in their stored order for the lookbook, the next 8 for the photo strip.
export default function HomeContent({ initialProducts = null }) {
  // Server data → full page on the first render (and on back to Home, so the scroll restores);
  // no scroll to the top on mount (Home has no pages)
  const { products, loading, error } = useProducts({ initialProducts, scrollOnPageChange: false });

  const edit = error ? [] : products.slice(0, 4);
  const strip = error ? [] : products.slice(4, 12);

  useReveal([products]);

  return (
    <div className="min-h-screen flex flex-col" suppressHydrationWarning>
      <HomeIntro />
      <Header />

      <main className="flex-1">
        <Hero featured={edit[0]} />
        <HomeSearch />
        <Lookbook products={edit} loading={loading && !error} />
        {error && (
          <p className="mx-4 mt-6 lg:max-w-container lg:mx-auto lg:px-6 text-[15px] text-ink-muted">
            تعذّر تحميل المجموعة الآن.{" "}
            <Link href={SHOP_PATH} className="font-semibold text-rose underline underline-offset-4">
              تصفّحي المجموعة
            </Link>
          </p>
        )}
        <PackageStory />
        <PhotoStrip products={strip} loading={loading && !error} />
        <HowToOrder />
      </main>

      <Footer className="max-lg:pb-[72px]" />

      <WhatsAppFab style={heroDelay(0.65)} />
    </div>
  );
}

function Hero({ featured }) {
  const words = [
    { text: "تصاميم", delay: 0.2 },
    { text: "مميزة", delay: 0.29 },
    { text: "لأجمل", delay: 0.38, br: true },
    { text: "المناسبات", delay: 0.47, accent: true },
  ];

  return (
    <section className="relative mx-3 mt-2 h-[580px] rounded-hero overflow-hidden bg-champagne-photo flex flex-col justify-end px-5 py-6 lg:h-auto lg:overflow-visible lg:rounded-none lg:bg-transparent lg:max-w-container lg:mx-auto lg:px-6 lg:pt-12 lg:pb-0 lg:grid lg:grid-cols-2 lg:gap-14 lg:items-center">
      {/* Photo column (mobile: full card behind the text) */}
      <div className="absolute inset-0 lg:relative lg:inset-auto lg:order-2 lg:min-h-[640px]">
        <div className="absolute inset-0 overflow-hidden lg:left-[72px] lg:rounded-[34px] lg:bg-champagne-photo">
          <Image
            src={HERO_IMAGE}
            alt="عروس تحمل مسكة توليب بيضاء"
            fill
            priority
            sizes="(min-width: 1240px) 520px, (min-width: 1024px) 42vw, 100vw"
            className="mb-zoom object-cover object-[center_30%]"
            style={heroDelay(0)}
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 lg:hidden"
          style={{
            background:
              "linear-gradient(to top, #FFFDF9 0%, rgba(255,253,249,.94) 36%, rgba(255,253,249,0) 66%)",
          }}
        />
        {featured && <FloatingCard product={featured} />}
      </div>

      {/* Text column */}
      <div className="relative flex flex-col gap-3 lg:gap-[22px] lg:order-1">
        <span
          className="mb-hero-in self-start px-3 py-1.5 lg:px-3.5 rounded-full bg-champagne text-xs lg:text-[13px] font-medium text-ink"
          style={heroDelay(0.1)}
        >
          مجموعة العرائس
        </span>

        <h1 className="font-display font-bold text-[40px] leading-[1.25] lg:text-[clamp(2.75rem,5.2vw,4.5rem)] lg:leading-[1.18] text-ink overflow-hidden">
          {words.map(({ text, delay, br, accent }) => (
            <span key={text}>
              {br && <br />}
              <span
                className={`mb-word ${accent ? "font-accent text-rose italic font-normal" : ""}`}
                style={heroDelay(delay)}
              >
                {text}
              </span>{" "}
            </span>
          ))}
        </h1>

        <p className="mb-hero-in text-[15px] leading-[1.7] lg:text-lg lg:leading-[1.8] text-ink-muted lg:max-w-[30rem]" style={heroDelay(0.56)}>
          <span className="lg:hidden">كل مسكة قطعة فنية فريدة، مع توصيل لجميع مناطق الأردن.</span>
          <span className="max-lg:hidden">
            كل مسكة قطعة فنية فريدة، نختار وردها بعناية ونصممها لتعكس جمال يومك، مع توصيل لجميع مناطق الأردن.
          </span>
        </p>

        <div className="mb-hero-in mt-1 lg:mt-0 flex flex-wrap items-center gap-2.5 lg:gap-3.5" style={heroDelay(0.65)}>
          <Button href={SHOP_PATH} className="min-h-[50px] lg:min-h-[54px] lg:px-7 lg:text-base">
            تسوّقي المجموعة
            <ArrowLeft className="w-[18px] h-[18px]" strokeWidth={1.8} aria-hidden="true" />
          </Button>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            {...WA_CTA}
            className="mb-tap min-h-[50px] lg:min-h-[54px] px-1.5 inline-flex items-center gap-2 text-sm lg:text-[15px] font-medium text-ink"
          >
            <WhatsAppIcon className="w-[18px] h-[18px] text-whatsapp" />
            <span className="border-b border-line-link pb-0.5">تواصلي معنا</span>
          </a>
        </div>
      </div>
    </section>
  );
}

// Desktop only: first product floating over the hero photo
function FloatingCard({ product }) {
  const { ar, en } = splitName(product.name);

  return (
    <Link
      href={`/product/${product.id}`}
      className="max-lg:hidden mb-hero-in mb-lift absolute left-0 bottom-12 w-[230px] bg-pearl rounded-[24px] p-2.5 flex flex-col gap-2 text-ink shadow-[0_24px_48px_rgba(75,63,54,0.14)]"
      style={heroDelay(0.8)}
    >
      <span className="relative block h-[156px] rounded-[18px] overflow-hidden bg-champagne-photo">
        <ProductImage
          src={product.images?.[0] || "/placeholder.jpg"}
          alt={productAlt(product)}
          sizes="210px"
          className="object-cover"
        />
      </span>
      <span className="flex justify-between items-baseline gap-2 px-1 pb-1">
        <span className="font-display font-bold text-lg leading-tight truncate">{ar || en}</span>
        <span className="shrink-0 text-sm font-semibold text-rose">{product.salePrice} د.أ</span>
      </span>
    </Link>
  );
}

// Search pill → /shop?q=… (empty → /shop with the search field focused)
function HomeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `${SHOP_PATH}?q=${encodeURIComponent(q)}` : `${SHOP_PATH}?focus=search`);
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="mx-4 mt-6 lg:max-w-container lg:mx-auto lg:mt-10 lg:px-6"
    >
      <div className="relative">
        <label htmlFor="home-search" className="sr-only">
          البحث في المجموعة
        </label>
        <input
          id="home-search"
          type="search"
          enterKeyHint="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحثي عن مسكة، نوع ورد، لون…"
          className="w-full h-12 lg:h-14 pr-12 lg:pr-14 pl-5 rounded-full bg-champagne border border-line text-base text-ink placeholder:text-ink-muted focus:outline-none focus:bg-white focus:border-rose transition-colors [&::-webkit-search-cancel-button]:appearance-none"
        />
        <button
          type="submit"
          aria-label="بحث"
          className="absolute right-0.5 lg:right-1.5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-ink-muted hover:text-rose"
        >
          <Search className="w-[18px] h-[18px]" strokeWidth={1.7} aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}

const STEPS = [
  { text: "اختاري مسكتك من المجموعة" },
  { text: "احفظيها في المفضلة لتقارني بهدوء" },
  { text: "اطلبيها عبر واتساب برسالة جاهزة", whatsapp: true },
];

function HowToOrder() {
  return (
    <section className="mb-rv mx-4 mt-12 lg:max-w-container lg:mx-auto lg:mt-20 lg:px-6">
      <div className="rounded-[24px] lg:rounded-[32px] bg-champagne px-5 py-6 lg:p-10 flex flex-col gap-4 lg:gap-7">
        <h2 className="font-display font-bold text-[25px] lg:text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.3] text-ink">
          كيف تطلبين؟
        </h2>
        <ol className="flex flex-col gap-3.5 lg:grid lg:grid-cols-3 lg:gap-6">
          {STEPS.map(({ text, whatsapp }, i) => (
            <li key={text} className="flex items-center gap-3.5 lg:gap-4">
              <span
                dir="ltr"
                aria-hidden="true"
                className={`shrink-0 w-9 h-9 lg:w-12 lg:h-12 rounded-full flex items-center justify-center font-latin font-semibold text-lg lg:text-[22px] ${
                  whatsapp ? "bg-whatsapp text-white" : "bg-white border-[1.5px] border-rose text-rose"
                }`}
              >
                {i + 1}
              </span>
              <span className="text-[15px] lg:text-[17px] text-ink">{text}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
