"use client";

import { useState } from "react";
import {
  ArrowRight,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Instagram,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { useWishlist } from "hooks/useWishlist";

export const ProductDetails = ({ product, onBack }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toggleWishlist, isInWishlist } = useWishlist();

  const images = product.images || [];
  const colors = product.colors || [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleOrder = (platform) => {
    const message = encodeURIComponent(
      `مرحباً 🌸

أريد طلب هذه المسكة:

📦 *${product.name}*
نوع الورد: ${product.flowerType} 💐 

 الوصف📝:
${product.description}

 السعر: *${product.salePrice} دينار 💰*

`
    );

    if (platform === "instagram") {
      // فتح Instagram مباشرة بدون أي عجقة
      window.open(
        `https://instagram.com/${process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME}`,
        "_blank"
      );
    } else if (platform === "whatsapp") {
      // WhatsApp مع الرسالة الكاملة
      window.open(
        `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${message}`,
        "_blank"
      );
    }
  };
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header مع زر الرجوع */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center active:scale-90 transition-transform"
          >
            <ArrowRight className="w-5 h-5 text-gray-700" />
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => toggleWishlist(product.id)}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center active:scale-90 transition-transform"
            >
              <Heart
                className={`w-5 h-5 transition-all ${
                  isInWishlist(product.id)
                    ? "fill-red-500 text-red-500"
                    : "text-gray-700"
                }`}
              />
            </button>
            <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center active:scale-90 transition-transform">
              <Share2 className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </header>

      {/* Image Gallery */}
      <div className="relative aspect-square bg-gradient-to-br from-pink-50 to-purple-50">
        {/* الصورة الحالية */}
        <img
          src={images[currentImageIndex]}
          alt={product.name}
          className="w-full h-full object-cover"
        />

        {/* Preload باقي الصور (مخفية) */}
        {images.map(
          (img, idx) =>
            idx !== currentImageIndex && (
              <img key={idx} src={img} alt="" className="hidden" />
            )
        )}

        {/* Image Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    index === currentImageIndex ? "bg-white w-5" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-5 pb-24">
        {/* Badge & Category */}
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-pandora-pink/10 text-pandora-pink px-2.5 py-1 rounded-full text-xs font-bold">
            {product.flowerType}
          </span>
          <span className="text-gray-400 text-xs">•</span>
          <span className="text-xs text-gray-600">{product.category}</span>
        </div>

        {/* Product Name */}
        <h1 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
          {product.name}
        </h1>

        {/* Price */}
        <div className="bg-gradient-to-r from-pandora-pink/10 to-purple-100/50 rounded-xl p-3 mb-4">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-0.5">السعر</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-pandora-pink">
                  {product.salePrice}
                </span>
                <span className="text-sm font-medium text-gray-600">د.أ</span>
              </div>
            </div>
            <Sparkles className="w-6 h-6 text-pandora-pink" />
          </div>
        </div>

        {/* Colors */}
        {colors.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-bold text-gray-900 mb-2">
              الألوان المتاحة
            </p>
            <div className="flex flex-wrap gap-2">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full"
                >
                  <div
                    className="w-4 h-4 rounded-full border-2 border-gray-200 shadow-sm"
                    style={{ backgroundColor: getColorHex(color) }}
                  />
                  <span className="text-xs font-medium text-gray-700">
                    {color}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="mb-4">
          <p className="text-xs font-bold text-gray-900 mb-1.5">وصف المنتج</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4" />

        {/* Order Section */}
        <div>
          <p className="text-xs font-bold text-gray-900 mb-3 text-center">
            اطلب الآن عبر
          </p>

          <div className="space-y-2.5">
            {/* WhatsApp Button */}
            <button
              onClick={() => handleOrder("whatsapp")}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">واتساب</span>
            </button>

            {/* Instagram Button */}
            <button
              onClick={() => handleOrder("instagram")}
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
            >
              <Instagram className="w-5 h-5" />
              <span className="text-sm">إنستقرام</span>
            </button>
          </div>

          {/* Note */}
          <p className="text-xs text-center text-gray-500 mt-3">
            سيتم توجيهك للتواصل معنا مباشرة 💬
          </p>
        </div>
      </div>
    </div>
  );
};

// Helper للألوان
const getColorHex = (colorName) => {
  const colorMap = {
    أحمر: "#EF4444",
    وردي: "#EC4899",
    أبيض: "#FFFFFF",
    أصفر: "#F59E0B",
    بنفسجي: "#9333EA",
    برتقالي: "#F97316",
    أزرق: "#3B82F6",
    "متعدد الألوان": "#EC4899",
  };
  return colorMap[colorName] || "#9CA3AF";
};

export default ProductDetails;
