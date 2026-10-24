"use client";

import { useEffect, useState } from "react";
import WhatsAppIcon from "components/ui/WhatsAppIcon";
import { WHATSAPP_URL } from "lib/contact";

// Bottom padding for the footer of pages that show the FAB, so its last links scroll clear of it
export const FAB_CLEARANCE = "max-lg:pb-[96px]";

// Floating WhatsApp button (mobile only): Home, /shop, About. Not on the product page (order bar)
// or the wishlist (every item has «اطلبي»). One rule everywhere: it fades out while any in-page
// WhatsApp button (marked with WA_CTA, lib/contact) is on screen, and while a drawer/sheet is open
// (data-dialog-open, see useFocusTrap).
// The default delay lets the page slide in first (app/template.js), so the button never rides along.
export default function WhatsAppFab({ style = { animationDelay: ".35s" } }) {
  const ctaOnScreen = useWhatsAppCtaOnScreen();

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصلي معنا عبر واتساب"
      aria-hidden={ctaOnScreen || undefined}
      tabIndex={ctaOnScreen ? -1 : undefined}
      className={`lg:hidden fixed bottom-6 left-4 z-40 transition-[opacity,transform,visibility] duration-300 motion-reduce:transition-none [[data-dialog-open]_&]:opacity-0 [[data-dialog-open]_&]:scale-75 [[data-dialog-open]_&]:invisible ${
        ctaOnScreen ? "opacity-0 scale-75 invisible" : ""
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

// True while any [data-wa-cta] element is in the viewport. New buttons (products loading,
// wishlist rows) are picked up by a MutationObserver, batched to one scan per frame.
function useWhatsAppCtaOnScreen() {
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const visible = new Set();
    const observed = new Set();
    const report = () => setOnScreen(visible.size > 0);

    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      report();
    });

    let frame = 0;
    const scan = () => {
      frame = 0;
      for (const el of observed) {
        if (!el.isConnected) {
          io.unobserve(el);
          observed.delete(el);
          visible.delete(el);
        }
      }
      document.querySelectorAll("[data-wa-cta]").forEach((el) => {
        if (!observed.has(el)) {
          observed.add(el);
          io.observe(el);
        }
      });
      report();
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(scan);
    };

    scan();
    const mo = new MutationObserver(schedule);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      mo.disconnect();
      io.disconnect();
    };
  }, []);

  return onScreen;
}
