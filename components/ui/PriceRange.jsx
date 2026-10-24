"use client";

// Two-thumb price range on one rose track. Keeps the catalog's [min, max] shape.
// RTL: the lowest price sits on the right (start).
export default function PriceRange({ value, min = 0, max = 40, step = 1, onChange }) {
  const [low, high] = value;
  const pct = (v) => ((v - min) / (max - min)) * 100;

  return (
    <div className="pt-2">
      <p className="text-[15px] text-ink mb-5" aria-live="polite">
        من <span className="font-semibold text-rose">{low}</span> إلى{" "}
        <span className="font-semibold text-rose">{high}</span> د.أ
      </p>

      <div className="relative h-11">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 rounded-full bg-line" />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1 rounded-full bg-rose"
          style={{ insetInlineStart: `${pct(low)}%`, insetInlineEnd: `${100 - pct(high)}%` }}
        />
        <input
          type="range"
          aria-label="أقل سعر"
          min={min}
          max={max}
          step={step}
          value={low}
          onChange={(e) => onChange([Math.min(parseInt(e.target.value, 10), high), high])}
          className="mb-range"
          // When both thumbs meet near the top, keep the low thumb grabbable
          style={{ zIndex: low > max - (max - min) * 0.1 ? 2 : 1 }}
        />
        <input
          type="range"
          aria-label="أعلى سعر"
          min={min}
          max={max}
          step={step}
          value={high}
          onChange={(e) => onChange([low, Math.max(parseInt(e.target.value, 10), low)])}
          className="mb-range"
        />
      </div>

      <div className="flex justify-between text-xs text-ink-muted mt-1">
        <span>{min} د.أ</span>
        <span>{max} د.أ</span>
      </div>
    </div>
  );
}
