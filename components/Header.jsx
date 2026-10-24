"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Heart, Search } from "lucide-react";
import BurgerMenu from "./BurgerMenu";
import Logo from "components/ui/Logo";
import Button from "components/ui/Button";
import WishlistBadge from "components/ui/WishlistBadge";
import WhatsAppIcon from "components/ui/WhatsAppIcon";
import { useWishlist } from "hooks/useWishlist";
import { NAV_LINKS, SHOP_PATH, activeNavKey } from "lib/navigation";
import { WHATSAPP_URL } from "lib/contact";
import { countActiveFilters } from "lib/catalogOptions";

const iconLink =
  "mb-tap relative w-11 h-11 shrink-0 rounded-full bg-white flex items-center justify-center";

// Site header (DESIGN_SPEC §3.7 / §3.8). Pass `catalog` (filters, sort and their
// handlers) on the catalog page to add the filter / sort levels to the menu drawer.
export default function Header({ catalog }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const currentKey = activeNavKey(pathname);
  const { wishlistCount } = useWishlist();
  const onWishlist = currentKey === "wishlist";

  const activeFiltersCount = catalog ? countActiveFilters(catalog.filters, catalog.maxPrice) : 0;

  const wishlistLabel =
    wishlistCount > 0 ? `المفضلة، ${wishlistCount} محفوظة` : "المفضلة";

  const wishlistButton = (
    <Link
      href="/wishlist"
      aria-label={wishlistLabel}
      aria-current={onWishlist ? "page" : undefined}
      className={`${iconLink} ${onWishlist ? "border-[1.5px] border-rose" : "border border-line"}`}
    >
      <Heart
        className={`w-5 h-5 text-rose ${onWishlist ? "fill-rose" : ""}`}
        strokeWidth={1.6}
        aria-hidden="true"
      />
      <WishlistBadge count={wishlistCount} />
    </Link>
  );

  return (
    <>
      <header className="sticky top-0 z-50 bg-pearl/90 backdrop-blur-md border-b border-line">
        {/* Mobile */}
        <div className="lg:hidden h-16 px-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="فتح القائمة"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            className={`${iconLink} border border-line text-ink`}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h10" />
            </svg>
          </button>

          <Link href="/" aria-label="متجر المسكات — الرئيسية" className="flex">
            <Logo size={54} priority />
          </Link>

          {wishlistButton}
        </div>

        {/* Desktop */}
        <div className="hidden lg:flex max-w-container mx-auto px-6 py-2.5 items-center justify-between gap-4">
          <Link href="/" aria-label="متجر المسكات — الرئيسية" className="flex">
            <Logo size={68} priority />
          </Link>

          <nav aria-label="القائمة الرئيسية" className="flex gap-[34px] text-[15px] font-medium">
            {NAV_LINKS.map((link) => {
              const current = link.key === currentKey;
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  aria-current={current ? "page" : undefined}
                  className={`pb-1 border-b-[1.5px] transition-colors ${
                    current ? "text-rose border-rose" : "text-ink border-transparent hover:text-rose"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <Link href={SHOP_PATH} aria-label="بحث في المجموعة" className={`${iconLink} border border-line text-ink`}>
              <Search className="w-5 h-5" strokeWidth={1.6} aria-hidden="true" />
            </Link>
            {wishlistButton}
            {/* Opens the drawer on desktop too, so catalog filters stay reachable */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="فتح القائمة"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              className={`${iconLink} border border-line text-ink ${catalog ? "" : "hidden"}`}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h10" />
              </svg>
            </button>
            <Button variant="whatsapp" href={WHATSAPP_URL} external className="!min-h-[44px] !px-[18px] text-sm">
              <WhatsAppIcon className="w-[18px] h-[18px]" />
              تواصلي معنا
            </Button>
          </div>
        </div>
      </header>

      <BurgerMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        filters={catalog?.filters}
        onFilterChange={catalog?.onFilterChange}
        onClearFilters={catalog?.onClearFilters}
        sortBy={catalog?.sortBy}
        onSortChange={catalog?.onSortChange}
        activeFiltersCount={activeFiltersCount}
        maxPrice={catalog?.maxPrice}
      />
    </>
  );
}
