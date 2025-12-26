"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { useWishlist } from "hooks/useWishlist";
import { useRouter } from "next/navigation";
import { useToast } from "contexts/ToastContext";

export const ProductCard = ({ product, onClick }) => {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { success } = useToast();
  const [imageLoaded, setImageLoaded] = useState(false);

  const mainImage = product.images?.[0] || "/placeholder.jpg";

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    const wasInWishlist = isInWishlist(product.id);
    toggleWishlist(product.id);

    if (wasInWishlist) {
      success("تم الحذف من المفضلة 💔");
    } else {
      success("تمت الإضافة للمفضلة 💗");
    }
  };

  return (
    <div
      onClick={() => router.push(`/product/${product.id}`)}
      className="bg-white rounded-2xl overflow-hidden shadow-md active:scale-95 transition-transform duration-200 cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {/* Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
        )}

        {/* Image */}
        <img
          src={mainImage}
          alt={product.name}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />

        {/* Heart Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-2 right-2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
        >
          <Heart
            className={`w-4 h-4 transition-all ${
              isInWishlist(product.id)
                ? "fill-red-500 text-red-500"
                : "text-gray-600"
            }`}
          />
        </button>

        {/* Badge */}
        <div className="absolute bottom-2 left-2 bg-pandora-pink/90 backdrop-blur-sm px-2 py-1 rounded-lg">
          <span className="text-xs font-bold text-white">
            {product.flowerType}
          </span>
        </div>
      </div>

      {/* Content - مختصر */}
      <div className="p-3">
        {/* Name */}
        <h3 className="text-sm font-bold text-gray-900 line-clamp-1 mb-1">
          {product.name}
        </h3>

        {/* Price & Category */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-black text-pandora-pink">
            {product.salePrice} <span className="text-xs">د.أ</span>
          </span>
          <span className="text-xs text-gray-500">{product.category}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
