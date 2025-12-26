"use client";

import { useState, useEffect } from "react";

const WISHLIST_KEY = "flower_store_wishlist";
const WISHLIST_EVENT = "wishlist_updated";

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  // تحميل من localStorage مع validation
  useEffect(() => {
    const saved = localStorage.getItem(WISHLIST_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // تأكد إنها array وفلترها من أي قيم خاطئة
        if (Array.isArray(parsed)) {
          const validItems = parsed.filter(
            (item) => item && typeof item === "string"
          );
          setWishlist(validItems);
          // احفظ البيانات النظيفة
          if (validItems.length !== parsed.length) {
            localStorage.setItem(WISHLIST_KEY, JSON.stringify(validItems));
          }
        } else {
          // لو مش array، امسحها
          localStorage.removeItem(WISHLIST_KEY);
          setWishlist([]);
        }
      } catch (error) {
        // لو في error في parsing، امسح البيانات
        console.error("Wishlist parse error:", error);
        localStorage.removeItem(WISHLIST_KEY);
        setWishlist([]);
      }
    }
  }, []);

  // استماع للتحديثات
  useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem(WISHLIST_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const validItems = parsed.filter(
              (item) => item && typeof item === "string"
            );
            setWishlist(validItems);
          }
        } catch (error) {
          console.error("Wishlist update error:", error);
        }
      } else {
        setWishlist([]);
      }
    };

    window.addEventListener(WISHLIST_EVENT, handleUpdate);
    return () => window.removeEventListener(WISHLIST_EVENT, handleUpdate);
  }, []);

  // حفظ في localStorage + trigger event
  const saveToStorage = (items) => {
    const validItems = items.filter((item) => item && typeof item === "string");
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(validItems));
    setWishlist(validItems);
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
