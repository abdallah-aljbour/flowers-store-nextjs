// Radio row (DESIGN_SPEC §4.3): 58px, radius 18, rose ring when selected
export default function SortRow({ label, checked, onChange, name = "sort" }) {
  return (
    <label
      className={`mb-tap flex items-center justify-between gap-3 min-h-[58px] px-4 rounded-[18px] bg-white cursor-pointer transition-colors ${
        checked ? "border-[1.5px] border-rose text-rose font-semibold" : "border border-line text-ink"
      }`}
    >
      <span className="text-[15px]">{label}</span>
      <input type="radio" name={name} checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden="true"
        className={`w-5 h-5 rounded-full bg-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-rose ${
          checked ? "border-[7px] border-rose" : "border-[1.5px] border-line-link"
        }`}
      />
    </label>
  );
}
