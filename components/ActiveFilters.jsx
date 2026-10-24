"use client";

import { X } from "lucide-react";
import { PRICE_MIN, sortLabel, selectedFlowerOptions } from "lib/catalogOptions";

// Removable chips for the active filters + sort (moved from the old header; same handlers).
export default function ActiveFilters({
  filters,
  onFilterChange,
  onClearFilters,
  sortBy,
  onSortChange,
  maxPrice,
  className = "",
}) {
  const flowerOptions = selectedFlowerOptions(filters.flowerTypes);
  const priceActive = filters.priceRange[0] !== PRICE_MIN || filters.priceRange[1] !== maxPrice;
  const activeFiltersCount = flowerOptions.length + filters.colors.length + (priceActive ? 1 : 0);

  if (activeFiltersCount === 0 && sortBy === "default") return null;

  // Removes every stored value of the option (e.g. both جوري spellings)
  const removeFlowerType = (option) => {
    onFilterChange(
      "flowerTypes",
      filters.flowerTypes.filter((t) => !option.values.includes(t))
    );
  };

  const removeColor = (color) => {
    onFilterChange(
      "colors",
      filters.colors.filter((c) => c !== color)
    );
  };

  const removePriceFilter = () => {
    onFilterChange("priceRange", [PRICE_MIN, maxPrice]);
  };

  const chip = (key, label, onRemove, removeLabel) => (
    <button
      key={key}
      type="button"
      onClick={onRemove}
      aria-label={removeLabel}
      className="mb-tap inline-flex items-center gap-1.5 min-h-[36px] px-3 rounded-full bg-white border border-rose/40 text-rose text-[13px] font-medium"
    >
      <span>{label}</span>
      <X className="w-3.5 h-3.5" strokeWidth={1.8} aria-hidden="true" />
    </button>
  );

  return (
    <div className={`mt-2 flex flex-wrap items-center gap-2 ${className}`}>
      {flowerOptions.map((option) =>
        chip(`t-${option.label}`, option.label, () => removeFlowerType(option), `إزالة ${option.label}`)
      )}

      {filters.colors.map((color) =>
        chip(`c-${color}`, color, () => removeColor(color), `إزالة ${color}`)
      )}

      {priceActive &&
        chip(
          "price",
          `${filters.priceRange[0]}–${filters.priceRange[1]} د.أ`,
          removePriceFilter,
          "إزالة فلتر السعر"
        )}

      {sortBy !== "default" &&
        chip("sort", sortLabel(sortBy), () => onSortChange("default"), "إلغاء الترتيب")}

      <button
        type="button"
        onClick={() => {
          onClearFilters();
          onSortChange("default");
        }}
        className="min-h-[36px] px-2 text-[13px] font-medium text-ink underline decoration-line-link underline-offset-4"
      >
        مسح الكل
      </button>
    </div>
  );
}
