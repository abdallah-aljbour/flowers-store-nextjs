"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { markTraversal, clearTraversal, markHydrated } from "lib/navHistory";

const PENDING = "data-nav-pending";

// Tap feedback for page links (mounted once in app/layout.js):
// - an empty touchstart listener: iOS Safari only applies :active (the pressed state) when one exists
// - the tapped product link is marked pending until the next page shows (styles in app/motion.css)
// - back/forward is remembered (lib/navHistory): app/template.js then keeps the restored scroll
export default function NavFeedback() {
  const pathname = usePathname();

  useEffect(() => {
    markHydrated();
    const noop = () => {};
    let timer = 0;
    const onClick = (e) => {
      clearTraversal(); // any click may start a new navigation
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
    document.addEventListener("submit", clearTraversal, true);
    window.addEventListener("popstate", markTraversal);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("touchstart", noop);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", clearTraversal, true);
      window.removeEventListener("popstate", markTraversal);
    };
  }, []);

  // New page shown → clear any pending mark (e.g. a page kept in the back/forward cache)
  useEffect(() => {
    document.querySelectorAll(`[${PENDING}]`).forEach((el) => el.removeAttribute(PENDING));
  }, [pathname]);

  return null;
}
