"use client";

import { X, ChevronRight, ChevronLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Logo from "components/ui/Logo";
import { useFocusTrap } from "hooks/useFocusTrap";

const EXIT_MS = 260; // matches .mb-drawer-out / .mb-scrim-out

const iconButton =
  "mb-tap w-11 h-11 shrink-0 rounded-full bg-white border border-line flex items-center justify-center text-ink";

export default function MultiLevelDrawer({
  isOpen,
  onClose,
  levels,
  initialLevel = "main",
  label = "القائمة",
}) {
  const [currentLevel, setCurrentLevel] = useState(initialLevel);
  const [navHistory, setNavHistory] = useState([]);
  const [mounted, setMounted] = useState(isOpen);
  const [closing, setClosing] = useState(false);
  const panelRef = useRef(null);

  // Keep the drawer mounted while the exit animation plays
  useEffect(() => {
    if (isOpen) {
      // Always open on the main level (apply buttons close via the parent's onClose)
      setCurrentLevel(initialLevel);
      setNavHistory([]);
      setMounted(true);
      setClosing(false);
      return;
    }
    if (!mounted) return;
    setClosing(true);
    const timer = setTimeout(() => {
      setMounted(false);
      setClosing(false);
    }, EXIT_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const navigateTo = (level) => {
    setNavHistory([...navHistory, currentLevel]);
    setCurrentLevel(level);
  };

  const goBack = () => {
    if (navHistory.length > 0) {
      const previousLevel = navHistory[navHistory.length - 1];
      setCurrentLevel(previousLevel);
      setNavHistory(navHistory.slice(0, -1));
    }
  };

  const resetNavigation = () => {
    setCurrentLevel(initialLevel);
    setNavHistory([]);
  };

  const handleClose = () => {
    resetNavigation();
    onClose();
  };

  useFocusTrap(panelRef, isOpen && mounted, handleClose);

  if (!mounted) return null;

  const MenuItem = ({ label, badge, onClick, showArrow = true }) => (
    <button
      type="button"
      onClick={onClick}
      className="w-full min-h-[56px] flex items-center justify-between gap-3 border-b border-line text-ink text-right"
    >
      <span className="flex items-center gap-2.5">
        <span className="text-base font-medium">{label}</span>
        {badge !== undefined && badge !== "" && (
          <span className="min-w-[24px] h-6 px-2 rounded-full border-[1.5px] border-rose text-rose text-xs font-semibold flex items-center justify-center">
            {badge}
          </span>
        )}
      </span>
      {/* RTL: "forward" points left */}
      {showArrow && <ChevronLeft className="w-5 h-5 text-ink-muted" strokeWidth={1.7} aria-hidden="true" />}
    </button>
  );

  const LevelHeader = ({ title, showBack, depth }) =>
    depth === 0 ? (
      <div className="flex items-start justify-between mb-[18px]">
        <Logo size={96} />
        <button type="button" onClick={handleClose} aria-label="إغلاق القائمة" className={iconButton} data-autofocus>
          <X className="w-5 h-5" strokeWidth={1.7} />
        </button>
      </div>
    ) : (
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          {showBack && (
            <button type="button" onClick={goBack} aria-label="رجوع" className={iconButton}>
              {/* RTL: "back" points right */}
              <ChevronRight className="w-5 h-5" strokeWidth={1.7} />
            </button>
          )}
          <h2 className="font-display font-bold text-[28px] text-ink leading-tight">{title}</h2>
        </div>
        <button type="button" onClick={handleClose} aria-label="إغلاق القائمة" className={iconButton}>
          <X className="w-5 h-5" strokeWidth={1.7} />
        </button>
      </div>
    );

  // Portal to <body> so `fixed` is never trapped by a transformed ancestor (page transition)
  return createPortal(
    <div className="fixed inset-0 z-[60]">
      <div
        aria-hidden="true"
        onClick={handleClose}
        className={`absolute inset-0 bg-ink/[0.34] ${closing ? "mb-scrim-out" : "mb-scrim-in"}`}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={`absolute top-0 bottom-0 right-0 w-[310px] max-w-[88vw] bg-pearl overflow-hidden shadow-[-20px_0_40px_rgba(75,63,54,0.12)] focus:outline-none ${
          closing ? "mb-drawer-out" : "mb-drawer-in"
        }`}
      >
        {Object.entries(levels).map(([levelKey, levelConfig]) => {
          const isActive = currentLevel === levelKey;
          const depth = levelConfig.depth || 0;
          const footer =
            typeof levelConfig.footer === "function"
              ? levelConfig.footer({ navigateTo, goBack })
              : levelConfig.footer;

          return (
            <div
              key={levelKey}
              aria-hidden={!isActive}
              inert={isActive ? undefined : ""}
              className={`absolute inset-0 flex flex-col bg-pearl px-[22px] pt-5 pb-[26px] transition-[transform,visibility] duration-300 ease-soft motion-reduce:transition-none ${
                isActive
                  ? "translate-x-0 visible"
                  : // RTL: deeper levels wait on the left, the root on the right
                  depth === 0
                  ? "translate-x-full invisible"
                  : "-translate-x-full invisible"
              }`}
            >
              <LevelHeader
                title={levelConfig.title}
                depth={depth}
                showBack={levelConfig.showBack !== false && navHistory.length > 0}
              />

              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain -mx-1 px-1">
                {typeof levelConfig.content === "function"
                  ? levelConfig.content({ navigateTo, goBack, MenuItem, close: handleClose })
                  : levelConfig.content}
              </div>

              {footer && <div className="pt-4">{footer}</div>}
            </div>
          );
        })}
      </div>
    </div>,
    document.body
  );
}
