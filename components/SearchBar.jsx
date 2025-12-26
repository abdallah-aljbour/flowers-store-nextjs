"use client";

import { Search, X } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "ابحث عن مسكة...",
}) {
  return (
    <div className="relative">
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pr-10 pl-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-pandora-pink/20 focus:border-pandora-pink transition-all"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
        >
          <X className="w-3 h-3 text-gray-600" />
        </button>
      )}
    </div>
  );
}
