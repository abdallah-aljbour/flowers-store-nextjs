"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function FilterMenu({ filters, onApply, onClear, isOpen }) {
  const [tempFilters, setTempFilters] = useState(filters);
  const [expandedSubSection, setExpandedSubSection] = useState(null);

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

  // Update tempFilters when filters change or menu opens
  useState(() => {
    if (isOpen) {
      setTempFilters(filters);
    }
  }, [isOpen, filters]);

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

  const handleApply = () => {
    onApply(tempFilters);
  };

  const handleClear = () => {
    const resetFilters = {
      flowerTypes: [],
      colors: [],
      priceRange: [0, 40],
    };
    setTempFilters(resetFilters);
    onClear();
  };

  if (!isOpen) return null;

  return (
    <div className="mt-2 space-y-2 pr-2">
      {/* نوع الورد */}
      <div className="border rounded-lg overflow-hidden">
        <button
          onClick={() =>
            setExpandedSubSection(
              expandedSubSection === "flowerType" ? null : "flowerType"
            )
          }
          className="w-full flex items-center justify-between p-2.5 bg-white hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">
              🌸 نوع الورد
            </span>
            {tempFilters.flowerTypes.length > 0 && (
              <span className="bg-pandora-pink text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
                {tempFilters.flowerTypes.length}
              </span>
            )}
          </div>
          {expandedSubSection === "flowerType" ? (
            <ChevronUp className="w-3 h-3 text-gray-600" />
          ) : (
            <ChevronDown className="w-3 h-3 text-gray-600" />
          )}
        </button>

        {expandedSubSection === "flowerType" && (
          <div className="p-2 space-y-1.5 bg-gray-50">
            {flowerTypes.map((flower) => (
              <label
                key={flower}
                className="flex items-center gap-2 p-2 rounded hover:bg-white cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={tempFilters.flowerTypes.includes(flower)}
                  onChange={() => toggleTempFlowerType(flower)}
                  className="w-4 h-4 text-pandora-pink border-gray-300 rounded focus:ring-pandora-pink"
                />
                <span className="text-sm text-gray-900">{flower}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* اللون */}
      <div className="border rounded-lg overflow-hidden">
        <button
          onClick={() =>
            setExpandedSubSection(
              expandedSubSection === "color" ? null : "color"
            )
          }
          className="w-full flex items-center justify-between p-2.5 bg-white hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">🎨 اللون</span>
            {tempFilters.colors.length > 0 && (
              <span className="bg-pandora-pink text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
                {tempFilters.colors.length}
              </span>
            )}
          </div>
          {expandedSubSection === "color" ? (
            <ChevronUp className="w-3 h-3 text-gray-600" />
          ) : (
            <ChevronDown className="w-3 h-3 text-gray-600" />
          )}
        </button>

        {expandedSubSection === "color" && (
          <div className="p-2 space-y-1.5 bg-gray-50">
            {colors.map((color) => (
              <label
                key={color}
                className="flex items-center gap-2 p-2 rounded hover:bg-white cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={tempFilters.colors.includes(color)}
                  onChange={() => toggleTempColor(color)}
                  className="w-4 h-4 text-pandora-pink border-gray-300 rounded focus:ring-pandora-pink"
                />
                <span className="text-sm text-gray-900">{color}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* السعر */}
      <div className="border rounded-lg overflow-hidden">
        <button
          onClick={() =>
            setExpandedSubSection(
              expandedSubSection === "price" ? null : "price"
            )
          }
          className="w-full flex items-center justify-between p-2.5 bg-white hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">💰 السعر</span>
            {(tempFilters.priceRange[0] !== 0 ||
              tempFilters.priceRange[1] !== 40) && (
              <span className="bg-pandora-pink text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
                {tempFilters.priceRange[0]}-{tempFilters.priceRange[1]}
              </span>
            )}
          </div>
          {expandedSubSection === "price" ? (
            <ChevronUp className="w-3 h-3 text-gray-600" />
          ) : (
            <ChevronDown className="w-3 h-3 text-gray-600" />
          )}
        </button>

        {expandedSubSection === "price" && (
          <div className="p-3 space-y-3 bg-gray-50">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>{tempFilters.priceRange[0]} دينار</span>
              <span>{tempFilters.priceRange[1]} دينار</span>
            </div>

            <div>
              <label className="text-xs text-gray-600 mb-1.5 block">
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
                className="w-full"
              />
            </div>

            <div>
              <label className="text-xs text-gray-600 mb-1.5 block">
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
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Apply Button */}
      <div className="pt-2 space-y-2">
        <button
          onClick={handleApply}
          className="w-full py-2.5 bg-pandora-pink text-white rounded-lg text-sm font-medium hover:bg-pandora-pink/90 transition-colors"
        >
          تطبيق الفلاتر
        </button>

        {activeFiltersCount > 0 && (
          <button
            onClick={handleClear}
            className="w-full py-2 text-xs text-red-600 hover:text-red-700 font-medium"
          >
            مسح الفلاتر
          </button>
        )}
      </div>
    </div>
  );
}
