"use client";

import { Flower, Search } from "lucide-react";

export default function Header({ searchQuery, onSearchChange, currentPage }) {
  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pandora-pink to-pink-400 rounded-full flex items-center justify-center shadow-md">
              <Flower className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                🌸 متجر المسكات
              </h1>
              <p className="text-xs text-gray-600">
                تصاميم مميزة لأجمل المناسبات
              </p>
            </div>
          </div>
          <div className="text-left">
            <span className="text-xs text-gray-500">الصفحة</span>
            <p className="text-lg font-bold text-pandora-pink">{currentPage}</p>
          </div>
        </div>

        <div className="mt-3 relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث عن مسكة..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pandora-pink/20 focus:border-pandora-pink"
          />
        </div>
      </div>
    </header>
  );
}
