"use client";

import WhatsAppIcon from "components/ui/WhatsAppIcon";
import { WHATSAPP_URL } from "lib/contact";

// Bottom padding for the footer of pages that show the FAB, so its last links scroll clear of it
export const FAB_CLEARANCE = "max-lg:pb-[96px]";

// Floating WhatsApp button (mobile only): Home, /shop, Wishlist, About. Not on the product page
// (its order bar is there). Hidden while a drawer/sheet is open (data-dialog-open, see useFocusTrap)
// or when the page asks (`hidden`: Home's package story has its own WhatsApp button).
// The default delay lets the page slide in first (app/template.js), so the button never rides along.
export default function WhatsAppFab({ hidden = false, style = { animationDelay: ".35s" } }) {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصلي معنا عبر واتساب"
      className={`lg:hidden fixed bottom-6 left-4 z-40 transition-[opacity,transform,visibility] duration-300 [[data-dialog-open]_&]:opacity-0 [[data-dialog-open]_&]:scale-75 [[data-dialog-open]_&]:invisible ${
        hidden ? "opacity-0 scale-75 invisible" : ""
      }`}
    >
      <span
        style={style}
        className="mb-fab mb-tap w-14 h-14 rounded-full bg-whatsapp text-white shadow-whatsapp flex items-center justify-center"
      >
        <WhatsAppIcon className="w-[26px] h-[26px]" />
      </span>
    </a>
  );
}
