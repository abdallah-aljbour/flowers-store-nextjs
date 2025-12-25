"use client";

import { useState } from "react";
import { Flower, Palette, DollarSign, X, ChevronDown } from "lucide-react";
import FilterBottomSheet from "./FilterBottomSheet";

export default function FilterBar({ filters, onFilterChange, onClearAll }) {
  const [activeSheet, setActiveSheet] = useState(null);

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
      {/* Filter Chips */}
      <div className="sticky top-[73px] px-4 py-3 border-b border-gray-200 bg-white z-40">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {/* نوع الورد */}
          <button
            onClick={() => setActiveSheet("flowerType")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-colors whitespace-nowrap ${
              filters.flowerTypes.length > 0
                ? "bg-pandora-pink text-white border-pandora-pink"
                : "bg-gray-50 text-gray-700 border-gray-200"
            }`}
          >
            <Flower className="w-4 h-4" />
            <span className="text-sm font-medium">
              نوع الورد{" "}
              {filters.flowerTypes.length > 0 &&
                `(${filters.flowerTypes.length})`}
            </span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {/* اللون */}
          <button
            onClick={() => setActiveSheet("color")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-colors whitespace-nowrap ${
              filters.colors.length > 0
                ? "bg-pandora-pink text-white border-pandora-pink"
                : "bg-gray-50 text-gray-700 border-gray-200"
            }`}
          >
            <Palette className="w-4 h-4" />
            <span className="text-sm font-medium">
              اللون {filters.colors.length > 0 && `(${filters.colors.length})`}
            </span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {/* السعر */}
          <button
            onClick={() => setActiveSheet("price")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-colors whitespace-nowrap ${
              filters.priceRange[0] !== 0 || filters.priceRange[1] !== 40
                ? "bg-pandora-pink text-white border-pandora-pink"
                : "bg-gray-50 text-gray-700 border-gray-200"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span className="text-sm font-medium">
              السعر{" "}
              {(filters.priceRange[0] !== 0 || filters.priceRange[1] !== 200) &&
                `(${filters.priceRange[0]}-${filters.priceRange[1]})`}
            </span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {/* مسح الكل */}
          {activeFiltersCount > 0 && (
            <button
              onClick={onClearAll}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 whitespace-nowrap"
            >
              <X className="w-4 h-4" />
              <span className="text-sm font-medium">مسح الكل</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Sheets */}
      {activeSheet === "flowerType" && (
        <FilterBottomSheet
          title="نوع الورد 🌸"
          options={flowerTypes}
          selected={filters.flowerTypes}
          onClose={() => setActiveSheet(null)}
          onApply={(selected) => {
            onFilterChange("flowerTypes", selected);
            setActiveSheet(null);
          }}
        />
      )}

      {activeSheet === "color" && (
        <FilterBottomSheet
          title="اللون 🎨"
          options={colors}
          selected={filters.colors}
          onClose={() => setActiveSheet(null)}
          onApply={(selected) => {
            onFilterChange("colors", selected);
            setActiveSheet(null);
          }}
        />
      )}

      {activeSheet === "price" && (
        <FilterBottomSheet
          title="السعر 💰"
          type="range"
          priceRange={filters.priceRange}
          onClose={() => setActiveSheet(null)}
          onApply={(range) => {
            onFilterChange("priceRange", range);
            setActiveSheet(null);
          }}
        />
      )}
    </>
  );
}
