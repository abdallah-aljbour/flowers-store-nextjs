"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Logo from "components/ui/Logo";

// useLayoutEffect on the client (before paint), no SSR warning
const useClientLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const SEEN_KEY = "mb_intro_seen";
const HERO_DELAY = "1.15s"; // hero words start as the overlay lifts (.mb-intro, 1.35s)

// Runs while the HTML is parsed, before first paint: hide the intro on repeat visits
// in this session or with reduced motion; otherwise hold the hero animation back.
const BOOT = `(function(){try{var el=document.getElementById("mb-intro");if(!el)return;var skip=sessionStorage.getItem("${SEEN_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches;if(skip)el.style.display="none";else el.parentElement.style.setProperty("--mb-hero-base","${HERO_DELAY}")}catch(e){}})()`;

// Logo intro (DESIGN_SPEC §4.1-1): first visit per session, tap to skip, never with
// reduced motion. Must be the first child of the home root (it sets --mb-hero-base there).
// The page renders underneath, so the hero image loads as usual.
export default function HomeIntro() {
  const [show, setShow] = useState(true);
  const skipRef = useRef(null); // decided once (Strict Mode runs effects twice in dev)

  useClientLayoutEffect(() => {
    if (skipRef.current === null) {
      try {
        skipRef.current =
          Boolean(sessionStorage.getItem(SEEN_KEY)) ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!skipRef.current) sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        skipRef.current = true;
      }
    }
    const skip = skipRef.current;

    const root = document.getElementById("mb-intro")?.parentElement;
    if (skip) {
      root?.style.removeProperty("--mb-hero-base");
      setShow(false);
      return;
    }

    // Client-side navigation to Home (the boot script only runs on a full load)
    root?.style.setProperty("--mb-hero-base", HERO_DELAY);
    const timer = setTimeout(() => setShow(false), 1950);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {show && (
        <button
          id="mb-intro"
          type="button"
          onClick={() => setShow(false)}
          aria-label="تخطي المقدمة"
          suppressHydrationWarning
          className="mb-intro fixed inset-0 z-[70] bg-pearl flex flex-col items-center justify-center gap-3.5"
        >
          <span className="mb-intro-logo block">
            <Logo size={190} />
          </span>
          <span aria-hidden="true" className="mb-intro-line block w-[120px] h-px bg-rose" />
          <span aria-hidden="true" className="mb-intro-name font-display font-bold text-[22px] text-ink">
            متجر المسكات
          </span>
        </button>
      )}
      <script dangerouslySetInnerHTML={{ __html: BOOT }} />
    </>
  );
}
