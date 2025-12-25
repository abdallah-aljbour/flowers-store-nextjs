"use client";

import { useState } from "react";
import { Filter, ArrowUpDown, X } from "lucide-react";
import FilterBottomSheet from "./FilterBottomSheet";

export default function FilterBar({
  filters,
  onFilterChange,
  onClearAll,
  sortBy,
  onSortChange,
}) {
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [showSortSheet, setShowSortSheet] = useState(false);

  const flowerTypes = [
    "توليب",
    "ورد جوري",
    "ليليوم",
    "أوركيد",
    "كاميليا",
    "بيبي روز",
    "ميكس",
  ];
  const colors = [
    "أحمر",
    "وردي",
    "أبيض",
    "أصفر",
    "بنفسجي",
    "برتقالي",
    "أزرق",
    "متعدد الألوان",
  ];

  const activeFiltersCount =
    filters.flowerTypes.length +
    filters.colors.length +
    (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 40 ? 1 : 0);

  return (
    <>
      {/* Action Buttons */}
      <div className="sticky top-[73px] px-4 pt-1 pb-3 border-b border-gray-200 bg-white z-40">
        <div className="flex gap-2 justify-start">
          {/* Filter Button */}
          <button
            onClick={() => {
              setShowSortSheet(false);
              setShowFilterSheet(true);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border font-medium transition-all ${
              activeFiltersCount > 0
                ? "bg-pandora-pink text-white border-pandora-pink shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:border-pandora-pink"
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>تصفية</span>
            {activeFiltersCount > 0 && (
              <span className="bg-white text-pandora-pink px-2 py-0.5 rounded-full text-xs font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort Button */}
          <button
            onClick={() => {
              setShowFilterSheet(false);
              setShowSortSheet(true);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border font-medium transition-all ${
              sortBy !== "default"
                ? "bg-pandora-pink text-white border-pandora-pink shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:border-pandora-pink"
            }`}
          >
            <ArrowUpDown className="w-4 h-4" />
            <span>ترتيب</span>
            {sortBy !== "default" && <span className="text-xs">✓</span>}
          </button>

          {/* Reset Button - يظهر فقط لما يكون في فلاتر */}
          {(activeFiltersCount > 0 || sortBy !== "default") && (
            <button
              onClick={() => {
                onClearAll();
                onSortChange("default");
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 text-red-600 border border-red-200 font-medium hover:bg-red-100 transition-all"
            >
              <X className="w-4 h-4" />
              <span>مسح</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Bottom Sheet */}
      {showFilterSheet && (
        <FilterBottomSheet
          title="تصفية المنتجات 🔍"
          type="filter"
          filters={filters}
          flowerTypes={flowerTypes}
          colors={colors}
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
          title="الترتيب 🔄"
          type="radio"
          options={[
            { value: "default", label: "🔄 الترتيب الافتراضي" },
            { value: "price-low", label: "💰 الأرخص أولاً" },
            { value: "price-high", label: "💎 الأغلى أولاً" },
          ]}
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
