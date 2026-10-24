"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { trackPath } from "lib/navHistory";

// First page load of the visit (server HTML): fade only. The slide would move the
// whole page in after the first paint (layout shift); in-site navigations keep it.
let isFirstLoad = true;

// Re-mounts on every navigation in the App Router → page transition (.mb-page in app/motion.css)
export default function Template({ children }) {
  const pathname = usePathname();
  const [firstLoad] = useState(isFirstLoad);

  useEffect(() => {
    isFirstLoad = false;
  }, []);

  useEffect(() => {
    trackPath(pathname);
  }, [pathname]);

  return <div className={firstLoad ? "mb-page mb-page-first" : "mb-page"}>{children}</div>;
}
