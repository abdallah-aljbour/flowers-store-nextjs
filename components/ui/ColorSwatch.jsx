// Color filter swatch (DESIGN_SPEC §3.3): 44px circle (38 on desktop) with a label below.
export default function ColorSwatch({ color, label, selected = false, onClick, className = "" }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`mb-tap flex flex-col items-center gap-1.5 min-w-tap ${className}`}
    >
      <span
        aria-hidden="true"
        className="block w-11 h-11 lg:w-[38px] lg:h-[38px] rounded-full"
        style={{
          background: color,
          boxShadow: selected
            ? "inset 0 0 0 1px #ECE0CE, 0 0 0 2px #FFFDF9, 0 0 0 3.5px #9E4F69"
            : "inset 0 0 0 1px #ECE0CE",
        }}
      />
      <span className={`text-xs ${selected ? "text-rose font-semibold" : "text-ink-muted"}`}>
        {label}
      </span>
    </button>
  );
}
