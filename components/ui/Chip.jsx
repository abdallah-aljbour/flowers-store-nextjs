import { Check } from "lucide-react";

// Flower-type / quick-filter chip (DESIGN_SPEC §3.2).
// Pass `showCheck` in the filter sheet to add the small check icon when selected.
export default function Chip({
  selected = false,
  showCheck = false,
  onClick,
  className = "",
  children,
  ...props
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`mb-tap inline-flex shrink-0 items-center justify-center gap-1.5 min-h-[40px] px-4 rounded-full text-sm whitespace-nowrap transition-colors duration-200 ${
        selected
          ? "bg-white border-[1.5px] border-rose text-rose font-semibold"
          : "bg-champagne border border-transparent text-ink"
      } ${className}`}
      {...props}
    >
      {selected && showCheck && <Check className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />}
      {children}
    </button>
  );
}
