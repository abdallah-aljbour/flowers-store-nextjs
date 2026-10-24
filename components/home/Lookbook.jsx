import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import HeartButton from "components/ui/HeartButton";
import OrderLink from "components/ui/OrderLink";
import SectionHeading from "components/ui/SectionHeading";
import { splitName } from "lib/splitName";
import { productAlt } from "lib/productAlt";
import { SHOP_PATH } from "lib/navigation";

const productHref = (product) => `/product/${product.id}`;

function names(product) {
  const { ar, en } = splitName(product.name);
  return { ar, en, name: ar || en };
}

function AllLink({ className = "" }) {
  return (
    <Link
      href={SHOP_PATH}
      className={`min-h-tap inline-flex items-center gap-1.5 text-sm lg:text-[15px] font-semibold text-ink hover:text-rose transition-colors ${className}`}
    >
      <span className="border-b border-line-link pb-0.5">كل المجموعة</span>
      <ArrowLeft className="w-4 h-4" strokeWidth={1.8} aria-hidden="true" />
    </Link>
  );
}

// The Bridal Edit (DESIGN_SPEC §4.1-5): feature card · offset pair · wide card.
// `products` = the first 4 catalog products in their existing order.
export default function Lookbook({ products, loading }) {
  const [feature, first, second, wide] = products;

  return (
    <section className="mt-12 lg:mt-0 lg:pt-24 lg:max-w-container lg:mx-auto lg:px-6 flex flex-col gap-7 lg:gap-8">
      <SectionHeading
        eyebrow="The Bridal Edit"
        title="مختارات من المجموعة"
        className="mb-rv px-4 lg:px-0 flex-wrap"
        titleClassName="text-[34px] leading-[1.2] lg:text-[clamp(2rem,3.4vw,3rem)] lg:leading-[1.15]"
        action={<AllLink className="max-lg:hidden" />}
      />

      {loading && products.length === 0 ? (
        <LookbookSkeleton />
      ) : products.length === 0 ? null : (
        <div className="flex flex-col gap-7 lg:flex-row lg:items-start">
          {feature && <FeatureCard product={feature} />}

          <div className="px-4 lg:px-0 lg:flex-1 grid grid-cols-2 gap-x-3.5 gap-y-9 lg:gap-[22px] items-start">
            {first && <PairCard product={first} number={2} />}
            {second && <PairCard product={second} number={3} offset />}
            {wide && <WideCard product={wide} />}
          </div>
        </div>
      )}
    </section>
  );
}

function FeatureCard({ product }) {
  const { ar, en, name } = names(product);

  return (
    <article className="mb-lift relative mx-4 lg:mx-0 lg:flex-1">
      <Link
        href={productHref(product)}
        className="mb-curtain relative block aspect-[4/5] rounded-hero lg:rounded-[32px] overflow-hidden bg-champagne-photo"
      >
        <Image
          src={product.images?.[0] || "/placeholder.jpg"}
          alt={productAlt(product)}
          fill
          sizes="(min-width: 1240px) 600px, (min-width: 1024px) 48vw, 100vw"
          className="object-cover"
          quality={85}
        />
      </Link>

      <span
        dir="ltr"
        aria-hidden="true"
        className="absolute top-4 left-[18px] lg:top-[18px] lg:left-[22px] font-latin text-[22px] lg:text-[26px] text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.25)] pointer-events-none"
      >
        1
      </span>
      <HeartButton
        productId={product.id}
        productName={name}
        variant="photo"
        className="absolute top-3 right-3 lg:top-3.5 lg:right-3.5"
      />

      <div className="mb-rv absolute bottom-3.5 inset-x-3.5 lg:bottom-[18px] lg:inset-x-[18px] rounded-[22px] lg:rounded-[24px] bg-pearl/[0.94] px-4 py-3.5 lg:px-5 lg:py-4 shadow-float flex items-center justify-between gap-3">
        <div className="min-w-0 flex flex-col">
          <h3 className="font-display font-bold text-[22px] lg:text-[26px] leading-[1.2] text-ink">
            <Link href={productHref(product)} className="hover:text-rose transition-colors">
              {name}
            </Link>
          </h3>
          <span dir="ltr" className="text-right font-latin italic text-[15px] lg:text-[17px] text-ink-muted truncate">
            {ar && en ? `${en} · ` : ""}
            {product.salePrice} JOD
          </span>
        </div>
        <OrderLink product={product} name={name} className="shrink-0 h-11 lg:h-[46px] px-3.5 lg:px-[18px] text-sm">
          اطلبي
        </OrderLink>
      </div>
    </article>
  );
}

function PairCard({ product, number, offset = false }) {
  const { ar, en, name } = names(product);

  return (
    <article className={`mb-lift flex flex-col gap-2 lg:gap-2.5 ${offset ? "mt-16" : ""}`}>
      <span dir="ltr" aria-hidden="true" className="mb-rv text-right font-latin text-xl lg:text-[22px] text-rose">
        {number}
      </span>
      <div className="relative">
        <Link
          href={productHref(product)}
          className="mb-curtain relative block aspect-[3/4] rounded-card lg:rounded-[24px] overflow-hidden bg-champagne-photo"
        >
          <Image
            src={product.images?.[0] || "/placeholder.jpg"}
            alt={productAlt(product)}
            fill
            sizes="(min-width: 1240px) 290px, (min-width: 1024px) 24vw, 50vw"
            className="object-cover"
            quality={85}
          />
        </Link>
        <HeartButton
          productId={product.id}
          productName={name}
          variant="photo"
          iconClassName="w-[18px] h-[18px]"
          className="absolute top-1.5 right-1.5"
        />
      </div>
      <Link href={productHref(product)} className="mb-rv flex flex-col gap-0.5 text-ink group">
        <h3 className="font-display font-bold text-[19px] lg:text-[22px] leading-[1.3] group-hover:text-rose transition-colors">
          {name}
        </h3>
        {ar && en && (
          <span dir="ltr" className="text-right font-latin italic text-sm lg:text-base text-ink-muted truncate">
            {en}
          </span>
        )}
        <span className="text-sm lg:text-[15px] font-semibold text-rose">{product.salePrice} د.أ</span>
      </Link>
    </article>
  );
}

function WideCard({ product }) {
  const { ar, en, name } = names(product);

  return (
    <article className="mb-lift col-span-2 lg:mt-2 rounded-[26px] lg:rounded-[28px] bg-champagne overflow-hidden flex min-h-[220px] lg:min-h-[240px]">
      <div className="mb-rv flex-1 min-w-0 px-[18px] py-5 lg:p-[26px] flex flex-col justify-center gap-1.5">
        <span dir="ltr" aria-hidden="true" className="text-right font-latin text-xl lg:text-[22px] text-rose">
          4
        </span>
        <h3 className="font-display font-bold text-[22px] lg:text-[26px] leading-[1.25] text-ink">
          <Link href={productHref(product)} className="hover:text-rose transition-colors">
            {name}
          </Link>
        </h3>
        {ar && en && (
          <span dir="ltr" className="text-right font-latin italic text-[15px] lg:text-[17px] text-ink-muted">
            {en}
          </span>
        )}
        <span className="text-sm lg:text-[15px] font-semibold text-rose">{product.salePrice} د.أ</span>
        <AllLink className="mt-1.5 self-start lg:hidden" />
      </div>
      <Link
        href={productHref(product)}
        tabIndex={-1}
        aria-hidden="true"
        className="mb-curtain relative w-[46%] shrink-0 bg-champagne-photo"
      >
        <Image
          src={product.images?.[0] || "/placeholder.jpg"}
          alt={productAlt(product)}
          fill
          sizes="(min-width: 1024px) 270px, 46vw"
          className="object-cover"
          quality={85}
        />
      </Link>
    </article>
  );
}

function LookbookSkeleton() {
  const box = "rounded-card bg-champagne-photo";
  return (
    <div aria-hidden="true" className="motion-safe:animate-pulse flex flex-col gap-7 lg:flex-row lg:items-start">
      <div className={`mx-4 lg:mx-0 lg:flex-1 aspect-[4/5] ${box} rounded-hero lg:rounded-[32px]`} />
      <div className="px-4 lg:px-0 lg:flex-1 grid grid-cols-2 gap-x-3.5 gap-y-9 lg:gap-[22px] items-start">
        <div className={`aspect-[3/4] mt-9 ${box}`} />
        <div className={`aspect-[3/4] mt-[100px] ${box}`} />
        <div className="col-span-2 lg:mt-2 h-[220px] lg:h-[240px] rounded-[26px] bg-champagne" />
      </div>
    </div>
  );
}
