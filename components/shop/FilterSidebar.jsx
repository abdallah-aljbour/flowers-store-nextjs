"use client";

import Chip from "components/ui/Chip";
import ColorSwatch from "components/ui/ColorSwatch";
import PriceRange from "components/ui/PriceRange";
import Button from "components/ui/Button";
import { Eyebrow } from "components/ui/SectionHeading";
import {
  FLOWER_TYPES,
  COLORS,
  PRICE_MIN,
  isFlowerOptionSelected,
  toggleFlowerOption,
} from "lib/catalogOptions";

// Desktop filter sidebar (DESIGN_SPEC §4.2). Changes apply immediately through the
// catalog's existing handleFilterChange / clearFilters.
export default function FilterSidebar({ filters, onFilterChange, onClearFilters, maxPrice }) {
  const toggleColor = (color) =>
    onFilterChange(
      "colors",
      filters.colors.includes(color)
        ? filters.colors.filter((c) => c !== color)
        : [...filters.colors, color]
    );

  const legend = "mb-3 text-[15px] font-semibold text-ink";

  return (
    <aside
      aria-label="تصفية"
      className="w-[270px] shrink-0 sticky top-[112px] flex flex-col gap-7 p-[26px] rounded-[28px] bg-white border border-line"
    >
      <div className="flex items-baseline justify-between">
        <div>
          <Eyebrow className="!text-[17px] lg:!text-[17px]">Refine</Eyebrow>
          <h2 className="font-display font-bold text-[26px] leading-tight text-ink">تصفية</h2>
        </div>
        <Button variant="text" onClick={onClearFilters} className="text-sm !font-semibold">
          مسح الكل
        </Button>
      </div>

      <fieldset>
        <legend className={legend}>نوع الورد</legend>
        <div className="flex flex-wrap gap-2">
          {FLOWER_TYPES.map((option) => (
            <Chip
              key={option.label}
              showCheck
              selected={isFlowerOptionSelected(filters.flowerTypes, option)}
              onClick={() =>
                onFilterChange("flowerTypes", toggleFlowerOption(filters.flowerTypes, option))
              }
              className="!min-h-[38px] !px-3.5"
            >
              {option.label}
            </Chip>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={legend}>اللون</legend>
        <div className="grid grid-cols-4 gap-x-1.5 gap-y-3">
          {COLORS.map((color) => (
            <ColorSwatch
              key={color.value}
              label={color.value}
              color={color.hex}
              selected={filters.colors.includes(color.value)}
              onClick={() => toggleColor(color.value)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={legend}>السعر</legend>
        <PriceRange
          value={filters.priceRange}
          min={PRICE_MIN}
          max={maxPrice}
          onChange={(range) => onFilterChange("priceRange", range)}
        />
      </fieldset>
    </aside>
  );
}
