"use client";

import { useState, useEffect } from "react";

const WISHLIST_KEY = "flower_store_wishlist";
const WISHLIST_EVENT = "wishlist_updated";

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  // تحميل من localStorage
  useEffect(() => {
    const saved = localStorage.getItem(WISHLIST_KEY);
    if (saved) {
      setWishlist(JSON.parse(saved));
    }
  }, []);

  // ← جديد: استماع للتحديثات
  useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem(WISHLIST_KEY);
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    };

    window.addEventListener(WISHLIST_EVENT, handleUpdate);
    return () => window.removeEventListener(WISHLIST_EVENT, handleUpdate);
  }, []);

  // حفظ في localStorage + trigger event
  const saveToStorage = (items) => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
    setWishlist(items);
    window.dispatchEvent(new Event(WISHLIST_EVENT));
  };

  // إضافة للمفضلة
  const addToWishlist = (productId) => {
    if (!wishlist.includes(productId)) {
      saveToStorage([...wishlist, productId]);
    }
  };

  // حذف من المفضلة
  const removeFromWishlist = (productId) => {
    saveToStorage(wishlist.filter((id) => id !== productId));
  };

  // Toggle (إضافة أو حذف)
  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  // تحقق إذا موجود
  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    wishlistCount: wishlist.length,
  };
};
