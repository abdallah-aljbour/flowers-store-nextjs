"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Dialog behaviour for drawers and sheets: focus moves inside on open, Tab stays
// inside, Esc calls onClose, body scroll is locked, focus returns to the trigger.
// While any dialog is open, <html data-dialog-open> lets fixed UI (the WhatsApp FAB) hide itself
let openDialogs = 0;

export function useFocusTrap(ref, active, onClose) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!active || !ref.current) return;

    const container = ref.current;
    const previouslyFocused = document.activeElement;
    const visible = () =>
      [...container.querySelectorAll(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null && !el.closest("[inert], [aria-hidden='true']")
      );

    (container.querySelector("[data-autofocus]") || visible()[0] || container).focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current?.();
        return;
      }
      if (e.key !== "Tab") return;

      const items = visible();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    openDialogs += 1;
    document.documentElement.setAttribute("data-dialog-open", "");

    return () => {
      openDialogs -= 1;
      if (openDialogs === 0) document.documentElement.removeAttribute("data-dialog-open");
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [active, ref]);
}

export default useFocusTrap;
