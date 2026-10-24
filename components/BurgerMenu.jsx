"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Instagram } from "lucide-react";
import { useWishlist } from "hooks/useWishlist";
import MultiLevelDrawer from "./MultiLevelDrawer";
import Button from "components/ui/Button";
import Chip from "components/ui/Chip";
import ColorSwatch from "components/ui/ColorSwatch";
import WhatsAppIcon from "components/ui/WhatsAppIcon";
import PriceRange from "components/ui/PriceRange";
import SortRow from "components/ui/SortRow";
import { NAV_LINKS, activeNavKey } from "lib/navigation";
import { WHATSAPP_URL, INSTAGRAM_URL } from "lib/contact";
import {
  FLOWER_TYPES,
  COLORS,
  SORT_OPTIONS,
  PRICE_MIN,
  sortLabel,
  isFlowerOptionSelected,
  toggleFlowerOption,
  selectedFlowerOptions,
} from "lib/catalogOptions";

// Site menu. Filter / sort levels only appear when the catalog passes its state
// (filters + handlers); everywhere else the drawer is navigation only.
export default function BurgerMenu({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onClearFilters,
  sortBy,
  onSortChange,
  activeFiltersCount,
  maxPrice,
}) {
  const pathname = usePathname();
  const currentKey = activeNavKey(pathname);
  const { wishlistCount } = useWishlist();
  const hasCatalog = Boolean(filters && onFilterChange);
  const [tempFilters, setTempFilters] = useState(filters);
  const [tempSort, setTempSort] = useState(sortBy);

  useEffect(() => {
    setTempFilters(filters);
    setTempSort(sortBy);
  }, [filters, sortBy]);

  // One option can cover several stored values (e.g. جوري)
  const toggleTempFlowerType = (option) => {
    setTempFilters({
      ...tempFilters,
      flowerTypes: toggleFlowerOption(tempFilters.flowerTypes, option),
    });
  };

  const toggleTempColor = (color) => {
    if (tempFilters.colors.includes(color)) {
      setTempFilters({
        ...tempFilters,
        colors: tempFilters.colors.filter((c) => c !== color),
      });
    } else {
      setTempFilters({
        ...tempFilters,
        colors: [...tempFilters.colors, color],
      });
    }
  };

  const applyFilters = () => {
    onFilterChange("flowerTypes", tempFilters.flowerTypes);
    onFilterChange("colors", tempFilters.colors);
    onFilterChange("priceRange", tempFilters.priceRange);
    onSortChange(tempSort);
    onClose();
  };

  const applyAndGoBack = (goBack) => {
    onFilterChange("flowerTypes", tempFilters.flowerTypes);
    onFilterChange("colors", tempFilters.colors);
    onFilterChange("priceRange", tempFilters.priceRange);
    onSortChange(tempSort);
    goBack();
  };

  const handleClose = () => {
    setTempFilters(filters);
    setTempSort(sortBy);
    onClose();
  };

  const applyButton = (onClick, label = "تطبيق") => (
    <Button onClick={onClick} className="w-full">
      {label}
    </Button>
  );

  const mainLevel = {
    title: "القائمة",
    depth: 0,
    showBack: false,
    content: ({ navigateTo, MenuItem, close }) => (
      <div className="flex flex-col">
        <nav aria-label="القائمة الرئيسية" className="flex flex-col">
          {NAV_LINKS.map((link, i) => {
            const current = link.key === currentKey;
            return (
              <Link
                key={link.key}
                href={link.href}
                onClick={close}
                aria-current={current ? "page" : undefined}
                className="mb-drawer-link h-[60px] flex items-center gap-3.5 border-b border-line"
                style={{ animationDelay: `${0.08 + i * 0.05}s` }}
              >
                <span dir="ltr" className="w-[22px] font-latin text-lg text-rose">
                  {i + 1}
                </span>
                <span
                  className={`flex-1 font-display font-bold text-[25px] ${
                    current ? "text-rose" : "text-ink"
                  }`}
                >
                  {link.label}
                </span>
                {link.key === "wishlist" && wishlistCount > 0 && (
                  <span
                    aria-label={`${wishlistCount} في المفضلة`}
                    className="min-w-[26px] h-[26px] px-1.5 rounded-full border-[1.5px] border-rose text-rose text-[13px] font-semibold flex items-center justify-center"
                  >
                    {wishlistCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {hasCatalog && (
          <div className="mt-6">
            <span dir="ltr" className="block text-right font-latin italic text-rose text-lg mb-1">
              Refine
            </span>
            <MenuItem
              label="تصفية"
              badge={activeFiltersCount > 0 ? activeFiltersCount : ""}
              onClick={() => navigateTo("filters")}
            />
            <MenuItem
              label="الترتيب"
              badge={tempSort !== "default" ? sortLabel(tempSort) : ""}
              onClick={() => navigateTo("sort")}
            />
          </div>
        )}
      </div>
    ),
    footer: (
      <div className="flex flex-col gap-2.5">
        <Button variant="whatsapp" href={WHATSAPP_URL} external className="w-full min-h-[52px]">
          <WhatsAppIcon className="w-5 h-5" />
          تواصلي معنا عبر واتساب
        </Button>
        <Button href={INSTAGRAM_URL} external className="w-full min-h-[52px]">
          <Instagram className="w-5 h-5" strokeWidth={1.7} aria-hidden="true" />
          إنستغرام
        </Button>
        <p className="mt-1.5 text-center text-xs text-ink-muted">متجر المسكات · عمّان، الأردن</p>
      </div>
    ),
  };

  const catalogLevels = hasCatalog
    ? {
        // LEVEL 2: Filters Menu
        filters: {
          title: "تصفية",
          depth: 1,
          content: ({ navigateTo, MenuItem }) => (
            <div>
              <MenuItem
                label="نوع الورد"
                badge={
                  selectedFlowerOptions(tempFilters.flowerTypes).length || ""
                }
                onClick={() => navigateTo("flowerTypes")}
              />
              <MenuItem
                label="اللون"
                badge={tempFilters.colors.length > 0 ? tempFilters.colors.length : ""}
                onClick={() => navigateTo("colors")}
              />
              <MenuItem
                label="السعر"
                badge={
                  tempFilters.priceRange[0] !== PRICE_MIN || tempFilters.priceRange[1] !== maxPrice
                    ? `${tempFilters.priceRange[0]}–${tempFilters.priceRange[1]}`
                    : ""
                }
                onClick={() => navigateTo("priceRange")}
              />
            </div>
          ),
          footer: (
            <div className="flex items-center gap-3">
              {activeFiltersCount > 0 && (
                <Button
                  variant="text"
                  onClick={() => {
                    onClearFilters();
                    setTempFilters({
                      flowerTypes: [],
                      colors: [],
                      priceRange: [PRICE_MIN, maxPrice],
                    });
                  }}
                >
                  مسح الكل
                </Button>
              )}
              <div className="flex-1">{applyButton(applyFilters, "تطبيق التصفية")}</div>
            </div>
          ),
        },

        // LEVEL 3: Flower Types
        flowerTypes: {
          title: "نوع الورد",
          depth: 2,
          content: () => (
            <div className="flex flex-wrap gap-2 pt-1">
              {FLOWER_TYPES.map((flower) => (
                <Chip
                  key={flower.label}
                  selected={isFlowerOptionSelected(tempFilters.flowerTypes, flower)}
                  showCheck
                  onClick={() => toggleTempFlowerType(flower)}
                >
                  {flower.label}
                </Chip>
              ))}
            </div>
          ),
          footer: ({ goBack }) => applyButton(() => applyAndGoBack(goBack)),
        },

        // LEVEL 3: Colors
        colors: {
          title: "اللون",
          depth: 2,
          content: () => (
            <div className="grid grid-cols-4 gap-x-2 gap-y-4 pt-1">
              {COLORS.map((color) => (
                <ColorSwatch
                  key={color.value}
                  label={color.value}
                  color={color.hex}
                  selected={tempFilters.colors.includes(color.value)}
                  onClick={() => toggleTempColor(color.value)}
                />
              ))}
            </div>
          ),
          footer: ({ goBack }) => applyButton(() => applyAndGoBack(goBack)),
        },

        // LEVEL 3: Price Range
        priceRange: {
          title: "السعر",
          depth: 2,
          content: () => (
            <PriceRange
              value={tempFilters.priceRange}
              min={PRICE_MIN}
              max={maxPrice}
              onChange={(priceRange) => setTempFilters({ ...tempFilters, priceRange })}
            />
          ),
          footer: ({ goBack }) => applyButton(() => applyAndGoBack(goBack)),
        },

        // LEVEL 2: Sort Menu
        sort: {
          title: "الترتيب",
          depth: 1,
          content: () => (
            <fieldset className="flex flex-col gap-2.5 pt-1">
              <legend className="sr-only">الترتيب</legend>
              {SORT_OPTIONS.map((option) => (
                <SortRow
                  key={option.value}
                  label={option.label}
                  checked={tempSort === option.value}
                  onChange={() => setTempSort(option.value)}
                />
              ))}
            </fieldset>
          ),
          footer: applyButton(applyFilters, "تطبيق الترتيب"),
        },
      }
    : {};

  return (
    <MultiLevelDrawer
      isOpen={isOpen}
      onClose={handleClose}
      levels={{ main: mainLevel, ...catalogLevels }}
      initialLevel="main"
    />
  );
}
