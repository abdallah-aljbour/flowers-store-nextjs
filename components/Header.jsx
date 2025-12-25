"use client";

import { Flower, Search, Heart, Menu, X } from "lucide-react";
import { useWishlist } from "hooks/useWishlist";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Header({ searchQuery, onSearchChange, currentPage }) {
  const router = useRouter();
  const { wishlistCount } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Flower */}
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

            {/* Burger Menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center active:scale-90 transition-transform"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Search Bar */}
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

      {/* Side Menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Menu Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">القائمة</h2>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <X className="w-4 h-4 text-gray-900" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-2">
              {/* Wishlist */}
              <button
                onClick={() => {
                  router.push("/wishlist");
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-900 font-medium">المفضلة</span>
                <div className="relative">
                  <Heart className="w-5 h-5 text-red-500" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </div>
              </button>
              {/* يمكنك إضافة المزيد هنا */}
              {/* <button className="...">من نحن</button> */}
              {/* <button className="...">تواصل معنا</button> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
