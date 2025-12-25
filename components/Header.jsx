"use client";

import { Flower, Search, Heart, Menu, X } from "lucide-react";
import { useWishlist } from "hooks/useWishlist";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import FilterBar from "./FilterBar";

export default function Header({
  searchQuery,
  onSearchChange,
  currentPage,
  filters,
  onFilterChange,
  onClearFilters,
  sortBy,
  onSortChange,
}) {
  const router = useRouter();
  const { wishlistCount } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);

  // Hide/Show on scroll
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Compact mode بعد 50px
      if (currentScrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Hide/Show حسب الاتجاه
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setVisible(false);
      } else {
        // Scrolling up
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <header
        className={`bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm transition-transform duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div
          className={`px-4 transition-all duration-300 ${
            scrolled ? "py-2" : "py-4"
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Logo - Flower */}
            <div className="flex items-center gap-3">
              <div
                className={`bg-gradient-to-br from-pandora-pink to-pink-400 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                  scrolled ? "w-10 h-10" : "w-12 h-12"
                }`}
              >
                <Flower
                  className={`text-white transition-all duration-300 ${
                    scrolled ? "w-5 h-5" : "w-6 h-6"
                  }`}
                />
              </div>
              <div>
                <h1
                  className={`font-bold text-gray-900 transition-all duration-300 ${
                    scrolled ? "text-lg" : "text-xl"
                  }`}
                >
                  🌸 متجر المسكات
                </h1>
                {/* الوصف يختفي في compact mode */}
                <p
                  className={`text-xs text-gray-600 transition-all duration-300 overflow-hidden ${
                    scrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100"
                  }`}
                >
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
          <div
            className={`relative transition-all duration-300 ${
              scrolled ? "mt-2" : "mt-3"
            }`}
          >
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن مسكة..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pr-10 pl-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-pandora-pink/20 focus:border-pandora-pink"
            />
          </div>
        </div>
        <FilterBar
          filters={filters}
          onFilterChange={onFilterChange}
          onClearAll={onClearFilters}
          sortBy={sortBy}
          onSortChange={onSortChange}
        />
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
