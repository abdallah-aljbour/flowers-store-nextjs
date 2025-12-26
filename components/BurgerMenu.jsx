"use client";

import { X, ChevronDown, ChevronUp, Heart } from "lucide-react";
import { useWishlist } from "hooks/useWishlist";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FilterMenu from "./FilterMenu";

export default function BurgerMenu({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onClearFilters,
  sortBy,
  onSortChange,
  activeFiltersCount,
}) {
  const router = useRouter();
  const { wishlistCount } = useWishlist();
  const [expandedSection, setExpandedSection] = useState(null);

  const handleApplyFilters = (newFilters) => {
    onFilterChange("flowerTypes", newFilters.flowerTypes);
    onFilterChange("colors", newFilters.colors);
    onFilterChange("priceRange", newFilters.priceRange);
    setExpandedSection(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose}>
      <div
        className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Menu Header */}
        <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-900">القائمة</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <X className="w-4 h-4 text-gray-900" />
          </button>
        </div>

        {/* Menu Content */}
        <div className="p-4 space-y-3">
          {/* Filters Accordion */}
          <div>
            <button
              onClick={() =>
                setExpandedSection(
                  expandedSection === "filters" ? null : "filters"
                )
              }
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900">
                  الفلاتر ⚙️
                </span>
                {activeFiltersCount > 0 && (
                  <span className="bg-pandora-pink text-white px-2 py-0.5 rounded-full text-xs font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              {expandedSection === "filters" ? (
                <ChevronUp className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </button>

            <FilterMenu
              filters={filters}
              onApply={handleApplyFilters}
              onClear={onClearFilters}
              isOpen={expandedSection === "filters"}
            />
          </div>

          <div className="h-px bg-gray-200" />

          {/* Sort Accordion */}
          <div>
            <button
              onClick={() =>
                setExpandedSection(expandedSection === "sort" ? null : "sort")
              }
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900">
                  الترتيب 🔄
                </span>
                {sortBy !== "default" && (
                  <span className="text-xs text-pandora-pink font-bold">✓</span>
                )}
              </div>
              {expandedSection === "sort" ? (
                <ChevronUp className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </button>

            {expandedSection === "sort" && (
              <div className="mt-2 space-y-1 pr-2">
                <label className="flex items-center gap-2 p-2.5 rounded hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === "default"}
                    onChange={() => onSortChange("default")}
                    className="w-4 h-4 text-pandora-pink border-gray-300 focus:ring-pandora-pink"
                  />
                  <span className="text-sm text-gray-900">
                    🔄 الترتيب الافتراضي
                  </span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === "price-low"}
                    onChange={() => onSortChange("price-low")}
                    className="w-4 h-4 text-pandora-pink border-gray-300 focus:ring-pandora-pink"
                  />
                  <span className="text-sm text-gray-900">💰 الأرخص أولاً</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === "price-high"}
                    onChange={() => onSortChange("price-high")}
                    className="w-4 h-4 text-pandora-pink border-gray-300 focus:ring-pandora-pink"
                  />
                  <span className="text-sm text-gray-900">💎 الأغلى أولاً</span>
                </label>
              </div>
            )}
          </div>

          <div className="h-px bg-gray-200" />

          {/* Wishlist */}
          <div>
            <label className="text-xs font-bold text-gray-700 mb-2 block">
              المفضلة 💗
            </label>
            <button
              onClick={() => {
                router.push("/wishlist");
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200 hover:border-pandora-pink transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  المنتجات المفضلة
                </span>
                <Heart className="w-4 h-4 text-red-500" />
              </div>
              {wishlistCount > 0 && (
                <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
