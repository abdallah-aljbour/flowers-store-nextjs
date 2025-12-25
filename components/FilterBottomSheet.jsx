"use client";

import { useState, useEffect, useRef } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";

export default function FilterBottomSheet({
  title,
  type = "checkbox",
  options = [],
  selected = [],
  priceRange = [0, 40],
  filters,
  flowerTypes = [],
  colors = [],
  onClose,
  onApply,
  triggerRef, // reference للـ button اللي فتح الـ menu
}) {
  const [tempSelected, setTempSelected] = useState(selected);
  const [tempRange, setTempRange] = useState(priceRange);
  const menuRef = useRef(null);

  // For filter type (accordion)
  const [tempFilters, setTempFilters] = useState(
    filters || {
      flowerTypes: [],
      colors: [],
      priceRange: [0, 40],
    }
  );
  const [expandedSection, setExpandedSection] = useState(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sheet = document.querySelector(".filter-bottom-sheet");
      if (sheet && !sheet.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const toggleOption = (option) => {
    if (tempSelected.includes(option)) {
      setTempSelected(tempSelected.filter((item) => item !== option));
    } else {
      setTempSelected([...tempSelected, option]);
    }
  };

  const toggleFilterOption = (filterType, option) => {
    const current = tempFilters[filterType];
    if (current.includes(option)) {
      setTempFilters({
        ...tempFilters,
        [filterType]: current.filter((item) => item !== option),
      });
    } else {
      setTempFilters({
        ...tempFilters,
        [filterType]: [...current, option],
      });
    }
  };

  const handleApply = () => {
    if (type === "range") {
      onApply(tempRange);
    } else if (type === "filter") {
      onApply(tempFilters);
    } else {
      onApply(tempSelected);
    }
  };

  const activeCount =
    type === "filter"
      ? tempFilters.flowerTypes.length +
        tempFilters.colors.length +
        (tempFilters.priceRange[0] !== 0 || tempFilters.priceRange[1] !== 40
          ? 1
          : 0)
      : type === "checkbox"
      ? tempSelected.length
      : 0;

  return (
    <div
      ref={menuRef}
      className="absolute top-full left-4 right-4 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 animate-scale-in filter-bottom-sheet"
      style={{ maxHeight: "calc(100vh - 200px)" }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-white border-b px-4 py-3 flex items-center justify-between flex-shrink-0 rounded-t-2xl">
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 text-gray-900" />
          </button>
        </div>

        {/* Content - Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {type === "filter" ? (
            // Accordion Style Filters
            <div className="space-y-3">
              {/* نوع الورد */}
              <div className="border rounded-lg overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedSection(
                      expandedSection === "flowerType" ? null : "flowerType"
                    )
                  }
                  className="w-full flex items-center justify-between p-2.5 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-gray-900">
                      نوع الورد 🌸
                    </span>
                    {tempFilters.flowerTypes.length > 0 && (
                      <span className="bg-pandora-pink text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
                        {tempFilters.flowerTypes.length}
                      </span>
                    )}
                  </div>
                  {expandedSection === "flowerType" ? (
                    <ChevronUp className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  )}
                </button>

                {expandedSection === "flowerType" && (
                  <div className="p-2.5 space-y-1.5 bg-white">
                    {flowerTypes.map((flower) => (
                      <button
                        key={flower}
                        onClick={() =>
                          toggleFilterOption("flowerTypes", flower)
                        }
                        className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
                          tempFilters.flowerTypes.includes(flower)
                            ? "bg-pandora-pink/10 border border-pandora-pink"
                            : "bg-white border border-gray-200 hover:border-pandora-pink"
                        }`}
                      >
                        <span className="text-sm text-gray-900">{flower}</span>
                        {tempFilters.flowerTypes.includes(flower) && (
                          <span className="text-pandora-pink font-bold text-sm">
                            ✓
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* اللون */}
              <div className="border rounded-lg overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedSection(
                      expandedSection === "color" ? null : "color"
                    )
                  }
                  className="w-full flex items-center justify-between p-2.5 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-gray-900">
                      اللون 🎨
                    </span>
                    {tempFilters.colors.length > 0 && (
                      <span className="bg-pandora-pink text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
                        {tempFilters.colors.length}
                      </span>
                    )}
                  </div>
                  {expandedSection === "color" ? (
                    <ChevronUp className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  )}
                </button>

                {expandedSection === "color" && (
                  <div className="p-2.5 space-y-1.5 bg-white">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => toggleFilterOption("colors", color)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
                          tempFilters.colors.includes(color)
                            ? "bg-pandora-pink/10 border border-pandora-pink"
                            : "bg-white border border-gray-200 hover:border-pandora-pink"
                        }`}
                      >
                        <span className="text-sm text-gray-900">{color}</span>
                        {tempFilters.colors.includes(color) && (
                          <span className="text-pandora-pink font-bold text-sm">
                            ✓
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* السعر */}
              <div className="border rounded-lg overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedSection(
                      expandedSection === "price" ? null : "price"
                    )
                  }
                  className="w-full flex items-center justify-between p-2.5 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-gray-900">
                      السعر 💰
                    </span>
                    {(tempFilters.priceRange[0] !== 0 ||
                      tempFilters.priceRange[1] !== 40) && (
                      <span className="bg-pandora-pink text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
                        {tempFilters.priceRange[0]}-{tempFilters.priceRange[1]}
                      </span>
                    )}
                  </div>
                  {expandedSection === "price" ? (
                    <ChevronUp className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  )}
                </button>

                {expandedSection === "price" && (
                  <div className="p-2.5 space-y-3 bg-white">
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
            </div>
          ) : type === "checkbox" ? (
            <div className="space-y-1.5">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleOption(option)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-colors ${
                    tempSelected.includes(option)
                      ? "bg-pandora-pink/10 border-pandora-pink"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <span className="text-gray-900 font-medium text-sm">
                    {option}
                  </span>
                  {tempSelected.includes(option) && (
                    <span className="text-pandora-pink font-bold">✓</span>
                  )}
                </button>
              ))}
            </div>
          ) : type === "radio" ? (
            <div className="space-y-1.5">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTempSelected(option.value)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-colors ${
                    tempSelected === option.value
                      ? "bg-pandora-pink/10 border-pandora-pink"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <span className="text-gray-900 font-medium text-sm">
                    {option.label}
                  </span>
                  {tempSelected === option.value && (
                    <span className="text-pandora-pink font-bold">✓</span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            // Price Range
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>{tempRange[0]} دينار</span>
                <span>{tempRange[1]} دينار</span>
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-1.5 block">
                  الحد الأدنى
                </label>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={tempRange[0]}
                  onChange={(e) =>
                    setTempRange([parseInt(e.target.value), tempRange[1]])
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
                  value={tempRange[1]}
                  onChange={(e) =>
                    setTempRange([tempRange[0], parseInt(e.target.value)])
                  }
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t px-4 py-3 flex gap-2 flex-shrink-0 rounded-b-2xl">
          <button
            onClick={onClose}
            className="flex-1 px-3 py-2 border rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-3 py-2 bg-pandora-pink text-white rounded-lg font-medium text-sm hover:bg-pandora-pink/90 transition-colors"
          >
            تطبيق {type !== "radio" && activeCount > 0 && `(${activeCount})`}
          </button>
        </div>
      </div>
    </div>
  );
}
