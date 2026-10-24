"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import Button from "components/ui/Button";
import Chip from "components/ui/Chip";
import ColorSwatch from "components/ui/ColorSwatch";
import PriceRange from "components/ui/PriceRange";
import { Eyebrow } from "components/ui/SectionHeading";
import SortRow from "components/ui/SortRow";
import { useFocusTrap } from "hooks/useFocusTrap";
import { PRICE_MIN, isFlowerOptionSelected, toggleFlowerOption } from "lib/catalogOptions";

const EXIT_MS = 260; // matches .mb-sheet-out / .mb-scrim-out

// Mobile bottom sheet (DESIGN_SPEC §4.3). Same `type` variants and `onApply` contracts:
//   filter   → onApply({ flowerTypes, colors, priceRange })
//   radio    → onApply(value)          (applies on pick)
//   checkbox → onApply(selectedValues)
//   range    → onApply([min, max])
export default function FilterBottomSheet({
  title,
  eyebrow,
  type = "checkbox",
  options = [],
  selected = [],
  priceRange = [PRICE_MIN, 40],
  maxPrice = 40,
  filters,
  flowerTypes = [],
  colors = [],
  applyLabel = "عرض النتائج",
  onClose,
  onApply,
}) {
  const [tempSelected, setTempSelected] = useState(selected);
  const [tempRange, setTempRange] = useState(priceRange);
  const [tempFilters, setTempFilters] = useState(
    filters || { flowerTypes: [], colors: [], priceRange: [PRICE_MIN, maxPrice] }
  );
  const [closing, setClosing] = useState(false);
  const sheetRef = useRef(null);

  // Play the exit animation, then hand over to the parent
  const finish = (callback) => {
    if (closing) return;
    setClosing(true);
    setTimeout(callback, EXIT_MS);
  };
  const requestClose = () => finish(onClose);

  useFocusTrap(sheetRef, !closing, requestClose);

  const toggleOption = (option) => {
    setTempSelected(
      tempSelected.includes(option)
        ? tempSelected.filter((item) => item !== option)
        : [...tempSelected, option]
    );
  };

  const toggleColor = (color) => {
    const current = tempFilters.colors;
    setTempFilters({
      ...tempFilters,
      colors: current.includes(color) ? current.filter((c) => c !== color) : [...current, color],
    });
  };

  const handleApply = () => {
    if (type === "range") finish(() => onApply(tempRange));
    else if (type === "filter") finish(() => onApply(tempFilters));
    else finish(() => onApply(tempSelected));
  };

  const clearTemp = () => {
    if (type === "filter") {
      setTempFilters({ flowerTypes: [], colors: [], priceRange: [PRICE_MIN, maxPrice] });
    } else if (type === "range") {
      setTempRange([PRICE_MIN, maxPrice]);
    } else {
      setTempSelected([]);
    }
  };

  const section = (legend, children) => (
    <fieldset className="py-5 border-b border-line last:border-b-0">
      <legend className="float-right w-full mb-3 text-[15px] font-semibold text-ink">{legend}</legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );

  return createPortal(
    <div className="fixed inset-0 z-[60]">
      <div
        aria-hidden="true"
        onClick={requestClose}
        className={`absolute inset-0 bg-ink/[0.34] ${closing ? "mb-scrim-out" : "mb-scrim-in"}`}
      />

      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        tabIndex={-1}
        className={`absolute inset-x-0 bottom-0 max-h-[88vh] flex flex-col bg-pearl rounded-t-sheet shadow-sheet focus:outline-none ${
          closing ? "mb-sheet-out" : "mb-sheet-in"
        }`}
      >
        <span aria-hidden="true" className="mx-auto mt-2.5 w-10 h-1 rounded-full bg-[#E2D3BD]" />

        <div className="flex items-start justify-between gap-3 px-5 pt-3">
          <div>
            {eyebrow && <Eyebrow className="!text-[17px]">{eyebrow}</Eyebrow>}
            <h2 id="sheet-title" className="font-display font-bold text-[28px] leading-tight text-ink">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={requestClose}
            aria-label="إغلاق"
            data-autofocus
            className="mb-tap w-11 h-11 shrink-0 rounded-full bg-white border border-line flex items-center justify-center text-ink"
          >
            <X className="w-5 h-5" strokeWidth={1.7} />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 pb-2">
          {type === "filter" && (
            <>
              {section(
                "نوع الورد",
                <div className="flex flex-wrap gap-2">
                  {flowerTypes.map((option) => (
                    <Chip
                      key={option.label}
                      showCheck
                      selected={isFlowerOptionSelected(tempFilters.flowerTypes, option)}
                      onClick={() =>
                        setTempFilters({
                          ...tempFilters,
                          flowerTypes: toggleFlowerOption(tempFilters.flowerTypes, option),
                        })
                      }
                    >
                      {option.label}
                    </Chip>
                  ))}
                </div>
              )}
              {section(
                "اللون",
                <div className="grid grid-cols-4 gap-x-2 gap-y-4">
                  {colors.map((color) => (
                    <ColorSwatch
                      key={color.value}
                      label={color.value}
                      color={color.hex}
                      selected={tempFilters.colors.includes(color.value)}
                      onClick={() => toggleColor(color.value)}
                    />
                  ))}
                </div>
              )}
              {section(
                "السعر",
                <PriceRange
                  value={tempFilters.priceRange}
                  min={PRICE_MIN}
                  max={maxPrice}
                  onChange={(range) => setTempFilters({ ...tempFilters, priceRange: range })}
                />
              )}
            </>
          )}

          {type === "radio" && (
            <fieldset className="flex flex-col gap-2.5 pt-4 pb-4">
              <legend className="sr-only">{title}</legend>
              {options.map((option) => (
                <SortRow
                  key={option.value}
                  name="sheet-sort"
                  label={option.label}
                  checked={selected === option.value}
                  onChange={() => finish(() => onApply(option.value))}
                />
              ))}
            </fieldset>
          )}

          {type === "checkbox" && (
            <div className="flex flex-wrap gap-2 pt-4">
              {options.map((option) => (
                <Chip
                  key={option}
                  showCheck
                  selected={tempSelected.includes(option)}
                  onClick={() => toggleOption(option)}
                >
                  {option}
                </Chip>
              ))}
            </div>
          )}

          {type === "range" && (
            <PriceRange value={tempRange} min={PRICE_MIN} max={maxPrice} onChange={setTempRange} />
          )}
        </div>

        {type !== "radio" && (
          <div className="flex items-center gap-4 px-5 pt-3 pb-[max(16px,env(safe-area-inset-bottom))] border-t border-line">
            <Button variant="text" onClick={clearTemp}>
              مسح الكل
            </Button>
            <Button onClick={handleApply} className="flex-1">
              {applyLabel}
            </Button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
