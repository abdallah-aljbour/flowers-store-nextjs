"use client";

import { ChevronRight, ChevronLeft } from "lucide-react";

export const Pagination = ({
  currentPage,
  totalPages,
  onNext,
  onPrev,
  hasMore,
}) => {
  return (
    <div className="flex items-center justify-center gap-3 py-6">
      {/* Previous Button */}
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 shadow-md active:scale-95"
        }`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Page Info */}
      <div className="bg-white px-4 py-2 rounded-full shadow-md">
        <span className="text-sm font-bold text-gray-900">
          صفحة {currentPage}
          {totalPages > 0 && (
            <span className="text-gray-500"> من {totalPages}</span>
          )}
        </span>
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={!hasMore}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          !hasMore
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-pandora-pink text-white shadow-md active:scale-95"
        }`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;
