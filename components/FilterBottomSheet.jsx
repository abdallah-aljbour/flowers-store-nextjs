"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function FilterBottomSheet({
  title,
  type = "checkbox",
  options = [],
  selected = [],
  priceRange = [0, 40],
  onClose,
  onApply,
}) {
  const [tempSelected, setTempSelected] = useState(selected);
  const [tempRange, setTempRange] = useState(priceRange);

  const toggleOption = (option) => {
    if (tempSelected.includes(option)) {
      setTempSelected(tempSelected.filter((item) => item !== option));
    } else {
      setTempSelected([...tempSelected, option]);
    }
  };

  const handleApply = () => {
    if (type === "range") {
      onApply(tempRange);
    } else {
      onApply(tempSelected);
    }
  };

  return (
    <div
      className="bg-white w-full rounded-t-2xl max-h-[70vh] overflow-y-auto animate-slide-up"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="bg-white w-full rounded-t-2xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-4 py-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <X className="w-4 h-4 text-gray-900" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {type === "checkbox" ? (
            <div className="space-y-2">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleOption(option)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    tempSelected.includes(option)
                      ? "bg-pandora-pink/10 border-pandora-pink"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <span className="text-gray-900 font-medium">{option}</span>
                  {tempSelected.includes(option) && (
                    <span className="text-pandora-pink font-bold">✓</span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            // Price Range
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{tempRange[0]} دينار</span>
                <span>{tempRange[1]} دينار</span>
              </div>

              {/* Min Range */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
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

              {/* Max Range */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
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
        <div className="sticky bottom-0 bg-white border-t p-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border rounded-lg font-medium text-gray-700"
          >
            إلغاء
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-3 bg-pandora-pink text-white rounded-lg font-medium"
          >
            تطبيق{" "}
            {type === "checkbox" &&
              tempSelected.length > 0 &&
              `(${tempSelected.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}
