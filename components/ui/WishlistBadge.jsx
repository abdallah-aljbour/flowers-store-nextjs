// Wishlist count badge (DESIGN_SPEC §3.4). Keyed on the count so .mb-bump replays on change.
// Place inside a `relative` parent; sits on the top-left corner (end side in RTL).
export default function WishlistBadge({ count, className = "" }) {
  if (!count) return null;

  return (
    <span
      key={count}
      aria-hidden="true"
      className={`mb-bump absolute -top-[3px] -left-[3px] min-w-[18px] h-[18px] px-1 rounded-full bg-white border-[1.5px] border-rose text-rose text-[11px] font-semibold leading-none flex items-center justify-center ${className}`}
    >
      {count}
    </span>
  );
}
