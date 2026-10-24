// Filter options — the same lists the admin app (Maskat-Blooms ProductFormModal) writes.
// `values` must match stored Firestore values exactly; `label` is display only.
// One option can cover several stored values (legacy spellings).
export const FLOWER_TYPES = [
  { label: "توليب", values: ["توليب"] },
  { label: "كالا", values: ["كالا"] },
  // Admin form stores " جوري" with a leading space; older products store "ورد جوري"
  { label: "جوري", values: [" جوري", "ورد جوري"] },
  { label: "بيوني", values: ["بيوني"] },
  { label: "ليليوم", values: ["ليليوم"] },
  { label: "ميكس", values: ["ميكس"] },
];

export const COLORS = [
  { value: "أحمر", hex: "#EF4444" },
  { value: "وردي", hex: "#EC4899" },
  { value: "أبيض", hex: "#FFFFFF" },
  { value: "أصفر", hex: "#F59E0B" },
  { value: "بنفسجي", hex: "#9333EA" },
  { value: "برتقالي", hex: "#F97316" },
  { value: "أزرق", hex: "#3B82F6" },
  // Shown as a soft multi-color swatch
  { value: "متعدد الألوان", hex: "conic-gradient(#F2B8C4, #E8D5B7, #FFFFFF, #D4829A, #F2B8C4)" },
];

export const SORT_OPTIONS = [
  { value: "default", label: "الافتراضي" },
  { value: "price-low", label: "الأقل سعرًا" },
  { value: "price-high", label: "الأعلى سعرًا" },
];

export const PRICE_MIN = 0;

// --- flower-type option helpers (filters.flowerTypes stays an array of stored values) ---

export const isFlowerOptionSelected = (selected, option) =>
  option.values.every((v) => selected.includes(v));

// Adds or removes all stored values of an option
export const toggleFlowerOption = (selected, option) =>
  isFlowerOptionSelected(selected, option)
    ? selected.filter((v) => !option.values.includes(v))
    : [...selected, ...option.values.filter((v) => !selected.includes(v))];

// Selected values grouped back into display options (unknown values become their own option)
export const selectedFlowerOptions = (selected) => {
  const options = FLOWER_TYPES.filter((o) => o.values.some((v) => selected.includes(v)));
  const known = new Set(FLOWER_TYPES.flatMap((o) => o.values));
  const unknown = selected
    .filter((v) => !known.has(v))
    .map((v) => ({ label: String(v).trim(), values: [v] }));
  return [...options, ...unknown];
};

// Active filter count shown on buttons/badges: one per option, color and price
export const countActiveFilters = (filters, maxPrice) =>
  selectedFlowerOptions(filters.flowerTypes).length +
  filters.colors.length +
  (filters.priceRange[0] !== PRICE_MIN || filters.priceRange[1] !== maxPrice ? 1 : 0);

export const sortLabel = (value) =>
  SORT_OPTIONS.find((o) => o.value === value)?.label ?? "الافتراضي";
