"use client";

import { useState } from "react";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import FilterBottomSheet from "./FilterBottomSheet";
import { FLOWER_TYPES, COLORS, SORT_OPTIONS, countActiveFilters, sortLabel } from "lib/catalogOptions";

const toolButton =
  "mb-tap inline-flex items-center gap-2 min-h-tap px-4 rounded-full bg-white text-sm font-medium transition-colors";

// Mobile catalog tools: outline Filter + Sort buttons that open bottom sheets (DESIGN_SPEC §4.2/§4.3)
export default function FilterBar({ filters, onFilterChange, sortBy, onSortChange, maxPrice, className = "" }) {
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [showSortSheet, setShowSortSheet] = useState(false);

  const activeFiltersCount = countActiveFilters(filters, maxPrice);
  const sortActive = sortBy !== "default";

  return (
    <>
      <div className={`flex gap-2 ${className}`}>
        <button
          type="button"
          onClick={() => {
            setShowSortSheet(false);
            setShowFilterSheet(true);
          }}
          aria-haspopup="dialog"
          className={`${toolButton} ${
            activeFiltersCount > 0 ? "border-[1.5px] border-rose text-rose" : "border border-line text-ink"
          }`}
        >
          <SlidersHorizontal className="w-[18px] h-[18px]" strokeWidth={1.7} aria-hidden="true" />
          {activeFiltersCount > 0 ? `تصفية · ${activeFiltersCount}` : "تصفية"}
        </button>

        <button
          type="button"
          onClick={() => {
            setShowFilterSheet(false);
            setShowSortSheet(true);
          }}
          aria-haspopup="dialog"
          className={`${toolButton} ${
            sortActive ? "border-[1.5px] border-rose text-rose" : "border border-line text-ink"
          }`}
        >
          <ArrowUpDown className="w-[18px] h-[18px]" strokeWidth={1.7} aria-hidden="true" />
          الترتيب: {sortLabel(sortBy)}
        </button>
      </div>

      {/* Filter Bottom Sheet */}
      {showFilterSheet && (
        <FilterBottomSheet
          title="تصفية"
          eyebrow="Refine"
          type="filter"
          filters={filters}
          flowerTypes={FLOWER_TYPES}
          colors={COLORS}
          maxPrice={maxPrice}
          onClose={() => setShowFilterSheet(false)}
          onApply={(newFilters) => {
            Object.keys(newFilters).forEach((key) => {
              onFilterChange(key, newFilters[key]);
            });
            setShowFilterSheet(false);
          }}
        />
      )}

      {/* Sort Bottom Sheet */}
      {showSortSheet && (
        <FilterBottomSheet
          title="الترتيب"
          eyebrow="Sort by"
          type="radio"
          options={SORT_OPTIONS}
          selected={sortBy}
          onClose={() => setShowSortSheet(false)}
          onApply={(value) => {
            onSortChange(value);
            setShowSortSheet(false);
          }}
        />
      )}
    </>
  );
}
