"use client";

import { forwardRef } from "react";
import { Search, X } from "lucide-react";

// Champagne search field, 48px (DESIGN_SPEC §4.2). Magnifier at the start (right).
const SearchBar = forwardRef(function SearchBar(
  { value, onChange, placeholder = "ابحثي عن مسكة…", label = "البحث في المجموعة", className = "" },
  ref
) {
  return (
    <div className={`relative ${className}`}>
      <Search
        className="absolute right-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-ink-muted pointer-events-none"
        strokeWidth={1.7}
        aria-hidden="true"
      />
      <input
        ref={ref}
        type="search"
        enterKeyHint="search"
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 pr-11 pl-12 rounded-full bg-champagne border border-transparent text-base text-ink placeholder:text-ink-muted focus:outline-none focus:bg-white focus:border-rose transition-colors [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="مسح البحث"
          className="absolute left-0.5 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-ink-muted"
        >
          <span className="w-6 h-6 rounded-full bg-white border border-line flex items-center justify-center">
            <X className="w-3.5 h-3.5" strokeWidth={1.8} />
          </span>
        </button>
      )}
    </div>
  );
});

export default SearchBar;
