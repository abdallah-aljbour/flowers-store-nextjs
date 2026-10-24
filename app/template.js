"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPath } from "lib/navHistory";

// Re-mounts on every navigation in the App Router → page transition (.mb-page in app/motion.css)
export default function Template({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    trackPath(pathname);
  }, [pathname]);

  return <div className="mb-page">{children}</div>;
}
