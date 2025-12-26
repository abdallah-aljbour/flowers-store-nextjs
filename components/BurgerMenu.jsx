"use client";

import { useWishlist } from "hooks/useWishlist";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MultiLevelDrawer from "./MultiLevelDrawer";

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
  const [tempFilters, setTempFilters] = useState(filters);
  const [tempSort, setTempSort] = useState(sortBy);

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

  const toggleTempFlowerType = (type) => {
    if (tempFilters.flowerTypes.includes(type)) {
      setTempFilters({
        ...tempFilters,
        flowerTypes: tempFilters.flowerTypes.filter((t) => t !== type),
      });
    } else {
      setTempFilters({
        ...tempFilters,
        flowerTypes: [...tempFilters.flowerTypes, type],
      });
    }
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

  const levels = {
    // LEVEL 1: Main Menu
    main: {
      title: "القائمة",
      depth: 0,
      showBack: false,
      content: ({ navigateTo, MenuItem }) => (
        <div className="p-4 space-y-1">
          <MenuItem
            label="الفلاتر"
            badge={activeFiltersCount > 0 ? activeFiltersCount : ""}
            onClick={() => navigateTo("filters")}
          />
          <MenuItem
            label="الترتيب"
            badge={tempSort !== "default" ? "✓" : ""}
            onClick={() => navigateTo("sort")}
          />
          <div className="h-px bg-gray-200 my-3" />
          <MenuItem
            icon="💗"
            label="المفضلة"
            badge={wishlistCount > 0 ? wishlistCount : ""}
            onClick={() => {
              router.push("/wishlist");
              handleClose();
            }}
            showArrow={false}
          />
        </div>
      ),
    },

    // LEVEL 2: Filters Menu
    filters: {
      title: "الفلاتر",
      depth: 1,
      content: ({ navigateTo, MenuItem }) => (
        <div className="p-4 pb-32 space-y-1">
          <MenuItem
            label="نوع الورد"
            badge={
              tempFilters.flowerTypes.length > 0
                ? tempFilters.flowerTypes.length
                : ""
            }
            onClick={() => navigateTo("flowerTypes")}
          />
          <MenuItem
            label="اللون"
            badge={
              tempFilters.colors.length > 0 ? tempFilters.colors.length : ""
            }
            onClick={() => navigateTo("colors")}
          />
          <MenuItem
            label="السعر"
            badge={
              tempFilters.priceRange[0] !== 0 ||
              tempFilters.priceRange[1] !== 40
                ? `${tempFilters.priceRange[0]}-${tempFilters.priceRange[1]}`
                : ""
            }
            onClick={() => navigateTo("priceRange")}
          />
        </div>
      ),
      footer: (
        <div className="space-y-2">
          <button
            onClick={applyFilters}
            className="w-full py-3 bg-pandora-pink text-white rounded-lg font-medium hover:bg-pandora-pink/90 transition-colors"
          >
            تطبيق الفلاتر
          </button>
          {activeFiltersCount > 0 && (
            <button
              onClick={() => {
                onClearFilters();
                setTempFilters({
                  flowerTypes: [],
                  colors: [],
                  priceRange: [0, 40],
                });
              }}
              className="w-full py-2 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              مسح الفلاتر
            </button>
          )}
        </div>
      ),
    },

    // LEVEL 3: Flower Types
    flowerTypes: {
      title: "نوع الورد",
      depth: 2,
      content: ({ goBack }) => (
        <div className="p-4 pb-24">
          <div className="space-y-1">
            {flowerTypes.map((flower) => (
              <label
                key={flower}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={tempFilters.flowerTypes.includes(flower)}
                  onChange={() => toggleTempFlowerType(flower)}
                  className="w-5 h-5 text-pandora-pink border-gray-300 rounded focus:ring-pandora-pink"
                />
                <span className="text-sm text-gray-900">{flower}</span>
              </label>
            ))}
          </div>
        </div>
      ),
      footer: ({ goBack }) => (
        <button
          onClick={() => applyAndGoBack(goBack)}
          className="w-full py-3 bg-pandora-pink text-white rounded-lg font-medium hover:bg-pandora-pink/90 transition-colors"
        >
          تطبيق
        </button>
      ),
    },

    // LEVEL 3: Colors
    colors: {
      title: "اللون",
      depth: 2,
      content: ({ goBack }) => (
        <div className="p-4 pb-24">
          <div className="space-y-1">
            {colors.map((color) => (
              <label
                key={color}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={tempFilters.colors.includes(color)}
                  onChange={() => toggleTempColor(color)}
                  className="w-5 h-5 text-pandora-pink border-gray-300 rounded focus:ring-pandora-pink"
                />
                <span className="text-sm text-gray-900">{color}</span>
              </label>
            ))}
          </div>
        </div>
      ),
      footer: ({ goBack }) => (
        <button
          onClick={() => applyAndGoBack(goBack)}
          className="w-full py-3 bg-pandora-pink text-white rounded-lg font-medium hover:bg-pandora-pink/90 transition-colors"
        >
          تطبيق
        </button>
      ),
    },

    // LEVEL 3: Price Range
    priceRange: {
      title: "السعر",
      depth: 2,
      content: () => (
        <div className="p-4 pb-24">
          <div className="space-y-6">
            <div className="flex items-center justify-between text-sm text-gray-600 font-medium">
              <span>{tempFilters.priceRange[0]} دينار</span>
              <span>{tempFilters.priceRange[1]} دينار</span>
            </div>

            <div>
              <label className="text-xs text-gray-600 mb-2 block font-medium">
                الحد الأدنى
              </label>
              <input
                type="range"
                min="0"
                max="40"
                value={tempFilters.priceRange[0]}
                onChange={(e) =>
                  setTempFilters({
                    ...tempFilters,
                    priceRange: [
                      parseInt(e.target.value),
                      tempFilters.priceRange[1],
                    ],
                  })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pandora-pink"
              />
            </div>

            <div>
              <label className="text-xs text-gray-600 mb-2 block font-medium">
                الحد الأقصى
              </label>
              <input
                type="range"
                min="0"
                max="40"
                value={tempFilters.priceRange[1]}
                onChange={(e) =>
                  setTempFilters({
                    ...tempFilters,
                    priceRange: [
                      tempFilters.priceRange[0],
                      parseInt(e.target.value),
                    ],
                  })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pandora-pink"
              />
            </div>
          </div>
        </div>
      ),
      footer: ({ goBack }) => (
        <button
          onClick={() => applyAndGoBack(goBack)}
          className="w-full py-3 bg-pandora-pink text-white rounded-lg font-medium hover:bg-pandora-pink/90 transition-colors"
        >
          تطبيق
        </button>
      ),
    },

    // LEVEL 2: Sort Menu
    sort: {
      title: "الترتيب",
      depth: 1,
      content: () => (
        <div className="p-4 pb-24 space-y-1">
          <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="radio"
              name="sort"
              checked={tempSort === "default"}
              onChange={() => setTempSort("default")}
              className="w-5 h-5 text-pandora-pink border-gray-300 focus:ring-pandora-pink"
            />
            <span className="text-sm text-gray-900">الترتيب الافتراضي</span>
          </label>
          <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="radio"
              name="sort"
              checked={tempSort === "price-low"}
              onChange={() => setTempSort("price-low")}
              className="w-5 h-5 text-pandora-pink border-gray-300 focus:ring-pandora-pink"
            />
            <span className="text-sm text-gray-900">الأرخص أولاً</span>
          </label>
          <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <input
              type="radio"
              name="sort"
              checked={tempSort === "price-high"}
              onChange={() => setTempSort("price-high")}
              className="w-5 h-5 text-pandora-pink border-gray-300 focus:ring-pandora-pink"
            />
            <span className="text-sm text-gray-900">الأغلى أولاً</span>
          </label>
        </div>
      ),
      footer: (
        <button
          onClick={applyFilters}
          className="w-full py-3 bg-pandora-pink text-white rounded-lg font-medium hover:bg-pandora-pink/90 transition-colors"
        >
          تطبيق الترتيب
        </button>
      ),
    },
  };

  return (
    <MultiLevelDrawer
      isOpen={isOpen}
      onClose={handleClose}
      levels={levels}
      initialLevel="main"
    />
  );
}
