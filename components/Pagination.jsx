"use client";

import { ArrowRight, ArrowLeft } from "lucide-react";

const pageButton =
  "mb-tap inline-flex items-center gap-1.5 min-h-[46px] px-4 lg:px-5 rounded-full bg-white border-[1.5px] text-sm font-semibold transition-colors";
const enabled =
  "border-rose text-rose [@media(hover:hover)]:hover:bg-rose [@media(hover:hover)]:hover:text-white";
const disabled = "border-rose-disabled text-[#8C7D70] cursor-not-allowed";

// Previous / next pagination (DESIGN_SPEC §4.2). Same props as before.
export const Pagination = ({ currentPage, totalPages, onNext, onPrev, hasMore }) => {
  const prevDisabled = currentPage === 1;

  return (
    <nav
      aria-label="الصفحات"
      className="flex items-center justify-between lg:justify-center gap-2.5 lg:gap-[18px] pt-2 lg:pt-6"
    >
      {/* RTL: "back" points right */}
      <button
        type="button"
        onClick={onPrev}
        disabled={prevDisabled}
        aria-label="الصفحة السابقة"
        className={`${pageButton} ${prevDisabled ? disabled : enabled}`}
      >
        <ArrowRight className="w-4 h-4" strokeWidth={1.8} aria-hidden="true" />
        السابق
      </button>

      <span className="text-sm text-ink-muted" aria-live="polite">
        صفحة <strong className="font-semibold text-ink">{currentPage}</strong>
        {totalPages > 0 && <> من {totalPages}</>}
      </span>

      {/* RTL: "forward" points left */}
      <button
        type="button"
        onClick={onNext}
        disabled={!hasMore}
        aria-label="الصفحة التالية"
        className={`${pageButton} ${!hasMore ? disabled : enabled}`}
      >
        التالي
        <ArrowLeft className="w-4 h-4" strokeWidth={1.8} aria-hidden="true" />
      </button>
    </nav>
  );
};

export default Pagination;
