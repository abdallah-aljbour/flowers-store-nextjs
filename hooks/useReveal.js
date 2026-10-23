"use client";

import { useEffect } from "react";

const prefersReducedMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Adds `.is-in` to .mb-rv / .mb-curtain elements the first time they approach the
// viewport. Content is visible without JS; the class only triggers the entrance
// animation in app/motion.css. Pass deps that change when new items render.
export function useReveal(deps = []) {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    if (prefersReducedMotion()) return;

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }),
      { rootMargin: "0px 0px 140px 0px", threshold: 0 }
    );

    document
      .querySelectorAll(".mb-rv:not(.is-in), .mb-curtain:not(.is-in)")
      .forEach((el) => io.observe(el));

    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// Pauses infinite animations (photo strip) while the element is off screen.
export function usePauseOffscreen(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      ([entry]) => el.classList.toggle("is-off", !entry.isIntersecting),
      { rootMargin: "200px 0px 200px 0px" }
    );
    io.observe(el);

    return () => io.disconnect();
  }, [ref]);
}

export default useReveal;
