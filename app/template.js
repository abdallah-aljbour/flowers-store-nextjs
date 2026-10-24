"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { trackPath, isTraversal } from "lib/navHistory";

// First page load of the visit (server HTML): fade only. The slide would move the
// whole page in after the first paint (layout shift); in-site navigations keep it.
let isFirstLoad = true;

// Layout effect in the browser (runs before paint), plain effect on the server
const useBrowserLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const PIN_MS = 1200;
const READER_INPUT = ["touchstart", "wheel", "keydown", "mousedown"];

// Scrolls to the top now and keeps the page there until the reader scrolls or PIN_MS passes.
// Returns the cleanup.
function pinToTop() {
  const toTop = () => {
    if (window.scrollY !== 0) window.scrollTo(0, 0);
  };
  toTop();
  const stop = () => {
    clearTimeout(timer);
    window.removeEventListener("scroll", toTop);
    READER_INPUT.forEach((type) => window.removeEventListener(type, stop, true));
  };
  const timer = setTimeout(stop, PIN_MS);
  window.addEventListener("scroll", toTop, { passive: true });
  READER_INPUT.forEach((type) => window.addEventListener(type, stop, { capture: true, passive: true }));
  return stop;
}

// Re-mounts on every navigation in the App Router → page transition (.mb-page in app/motion.css)
export default function Template({ children }) {
  const pathname = usePathname();
  const [firstLoad] = useState(isFirstLoad);
  // Back/forward: no slide and no entrance animations, the page comes back as it was left
  const [traversal] = useState(() => !isFirstLoad && isTraversal());

  const mountedRef = useRef(false);
  // New page (link or router.push): start at the top, from the very first frame of the new
  // page (its loading skeleton included), and on every path change (product → related product
  // keeps this template, only the [id] segment changes). Back/forward keeps the restored position.
  //
  // On iPhone the scroll position belongs to the native scroll view, which can apply the old
  // (clamped) /shop offset again after the reset, so the product page showed up at its bottom.
  // So the page stays pinned at the top for a moment: a scroll that does not come from the
  // reader (touch, wheel, keys) is undone, until the reader takes over or PIN_MS passes.
  useBrowserLayoutEffect(() => {
    const firstRun = !mountedRef.current;
    mountedRef.current = true;
    if ((firstRun && firstLoad) || isTraversal() || window.location.hash) return;
    return pinToTop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    isFirstLoad = false;
  }, []);

  useEffect(() => {
    trackPath(pathname);
  }, [pathname]);

  const className = firstLoad ? "mb-page mb-page-first" : traversal ? "mb-page mb-back" : "mb-page";
  return <div className={className}>{children}</div>;
}
