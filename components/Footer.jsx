"use client";

import { Instagram, MessageCircle, Heart } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Brand */}
          <div className="text-center md:text-right">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-pandora-pink to-pink-400 rounded-full mb-2">
              <span className="text-lg">🌸</span>
            </div>
            <h3 className="text-sm font-bold text-gray-900">متجر المسكات</h3>
            <p className="text-xs text-gray-600">
              تصاميم مميزة لأجمل المناسبات
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="text-xs font-bold text-gray-900 mb-3">
              روابط سريعة
            </h4>
            <div className="space-y-2">
              <Link
                href="/"
                className="block text-xs text-gray-600 hover:text-pandora-pink transition-colors"
              >
                الرئيسية
              </Link>
              <Link
                href="/about"
                className="block text-xs text-gray-600 hover:text-pandora-pink transition-colors"
              >
                من نحن
              </Link>
              <Link
                href="/wishlist"
                className="block text-xs text-gray-600 hover:text-pandora-pink transition-colors"
              >
                المفضلة
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="text-center md:text-left">
            <h4 className="text-xs font-bold text-gray-900 mb-3">تواصل معنا</h4>
            <div className="flex gap-3 justify-center md:justify-start">
              <a
                href="https://wa.me/962789577909"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors active:scale-95"
              >
                <MessageCircle className="w-4 h-4 text-white" />
              </a>
              <a
                href="https://www.instagram.com/maskatblooms.jo"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity active:scale-95"
              >
                <Instagram className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-500">
            <p>© {new Date().getFullYear()} متجر المسكات. جميع الحقوق محفوظة</p>
            <p className="flex items-center gap-1">
              صنع بـ{" "}
              <Heart className="w-3 h-3 text-red-500 fill-current inline" /> في
              الأردن
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
