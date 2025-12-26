"use client";

import { Flower, Menu, X } from "lucide-react";
import { useState } from "react";
import SearchBar from "./SearchBar";
import BurgerMenu from "./BurgerMenu";

export default function Header({
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
  onClearFilters,
  sortBy,
  onSortChange,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const activeFiltersCount =
    filters.flowerTypes.length +
    filters.colors.length +
    (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 40 ? 1 : 0);

  const removeFlowerType = (type) => {
    onFilterChange(
      "flowerTypes",
      filters.flowerTypes.filter((t) => t !== type)
    );
  };

  const removeColor = (color) => {
    onFilterChange(
      "colors",
      filters.colors.filter((c) => c !== color)
    );
  };

  const removePriceFilter = () => {
    onFilterChange("priceRange", [0, 40]);
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-4 py-3">
          {/* Logo + Menu */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-pandora-pink to-pink-400 rounded-full flex items-center justify-center shadow-md">
                <Flower className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  متجر المسكات 🌸
                </h1>
                <p className="text-xs text-gray-600">
                  تصاميم مميزة لأجمل المناسبات
                </p>
              </div>
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center active:scale-90 transition-transform"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Search - دايماً ظاهر */}
          <SearchBar value={searchQuery} onChange={onSearchChange} />

          {/* Active Filters Chips */}
          {(activeFiltersCount > 0 || sortBy !== "default") && (
            <div className="mt-2 flex flex-wrap gap-2 items-center">
              {/* Flower Types */}
              {filters.flowerTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => removeFlowerType(type)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-pandora-pink/10 text-pandora-pink border border-pandora-pink/20 rounded-full text-xs font-medium hover:bg-pandora-pink/20 transition-colors"
                >
                  <span>{type}</span>
                  <X className="w-3 h-3" />
                </button>
              ))}

              {/* Colors */}
              {filters.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => removeColor(color)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-pandora-pink/10 text-pandora-pink border border-pandora-pink/20 rounded-full text-xs font-medium hover:bg-pandora-pink/20 transition-colors"
                >
                  <span>{color}</span>
                  <X className="w-3 h-3" />
                </button>
              ))}

              {/* Price Range */}
              {(filters.priceRange[0] !== 0 ||
                filters.priceRange[1] !== 40) && (
                <button
                  onClick={removePriceFilter}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-pandora-pink/10 text-pandora-pink border border-pandora-pink/20 rounded-full text-xs font-medium hover:bg-pandora-pink/20 transition-colors"
                >
                  <span>
                    {filters.priceRange[0]}-{filters.priceRange[1]} د.أ
                  </span>
                  <X className="w-3 h-3" />
                </button>
              )}

              {/* Sort Chip */}
              {sortBy !== "default" && (
                <button
                  onClick={() => onSortChange("default")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-600 border border-purple-200 rounded-full text-xs font-medium hover:bg-purple-100 transition-colors"
                >
                  <span>
                    {sortBy === "price-low" && "💰 الأرخص"}
                    {sortBy === "price-high" && "💎 الأغلى"}
                  </span>
                  <X className="w-3 h-3" />
                </button>
              )}

              {/* Clear All */}
              <button
                onClick={() => {
                  onClearFilters();
                  onSortChange("default");
                }}
                className="px-3 py-1.5 text-xs text-red-600 font-medium hover:text-red-700 transition-colors"
              >
                مسح الكل
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Burger Menu */}
      <BurgerMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        filters={filters}
        onFilterChange={onFilterChange}
        onClearFilters={onClearFilters}
        sortBy={sortBy}
        onSortChange={onSortChange}
        activeFiltersCount={activeFiltersCount}
      />
    </>
  );
}
