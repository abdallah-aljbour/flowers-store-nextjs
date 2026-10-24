"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { markTraversal, consumeTraversal } from "lib/navHistory";

const PENDING = "data-nav-pending";

// Tap feedback for page links (mounted once in app/layout.js):
// - an empty touchstart listener: iOS Safari only applies :active (the pressed state) when one exists
// - the tapped product link is marked pending until the next page shows (styles in app/motion.css)
// - back/forward is remembered, so the product page keeps the browser's restored scroll then
export default function NavFeedback() {
  const pathname = usePathname();

  useEffect(() => {
    const noop = () => {};
    let timer = 0;
    const onClick = (e) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = e.target.closest?.('a[href^="/product/"]');
      if (!link || link.target === "_blank" || link.getAttribute("href") === window.location.pathname) return;
      link.setAttribute(PENDING, "");
      clearTimeout(timer);
      timer = setTimeout(() => link.removeAttribute(PENDING), 6000); // navigation failed or was cancelled
    };
    document.addEventListener("touchstart", noop, { passive: true });
    // Capture phase: <Link> cancels the click's default before a bubbling listener would see it
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", markTraversal);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("touchstart", noop);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", markTraversal);
    };
  }, []);

  // New page shown → clear any pending mark (e.g. a page kept in the back/forward cache), and
  // the back/forward flag (the product page reads it first, in its layout effect)
  useEffect(() => {
    document.querySelectorAll(`[${PENDING}]`).forEach((el) => el.removeAttribute(PENDING));
    consumeTraversal();
  }, [pathname]);

  return null;
}
