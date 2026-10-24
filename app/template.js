"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { trackPath, isTraversal } from "lib/navHistory";

// First page load of the visit (server HTML): fade only. The slide would move the
// whole page in after the first paint (layout shift); in-site navigations keep it.
let isFirstLoad = true;

// Layout effect in the browser (runs before paint), plain effect on the server
const useBrowserLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

// Re-mounts on every navigation in the App Router → page transition (.mb-page in app/motion.css)
export default function Template({ children }) {
  const pathname = usePathname();
  const [firstLoad] = useState(isFirstLoad);
  // Back/forward: no slide and no entrance animations, the page comes back as it was left
  const [traversal] = useState(() => !isFirstLoad && isTraversal());

  // New page (link or router.push): start at the top, on the very first frame of the new page,
  // its loading skeleton included. Next.js also resets the scroll, but only once the page's
  // content commits, and iOS WebKit drops a scroll reset while a momentum scroll is running:
  // overflow is locked for one frame to stop the momentum first.
  // Runs on mount and on every path change: product → related product keeps this template
  // (only the [id] segment changes), so a mount-only reset would miss it.
  // Back/forward keeps the browser's restored position.
  const mountedRef = useRef(false);
  useBrowserLayoutEffect(() => {
    const firstRun = !mountedRef.current;
    mountedRef.current = true;
    if ((firstRun && firstLoad) || isTraversal() || window.scrollY === 0 || window.location.hash) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      root.style.overflow = previous;
    });
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
