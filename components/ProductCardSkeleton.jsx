// Catalog card placeholder (DESIGN_SPEC §3.11): 3:4 photo block + two text bars.
export default function ProductCardSkeleton() {
  return (
    <div aria-hidden="true" className="motion-safe:animate-pulse">
      <div className="aspect-[3/4] rounded-card bg-champagne-photo" />
      <div className="mt-3 space-y-2">
        <div className="h-4 w-3/4 rounded-full bg-champagne" />
        <div className="h-3 w-1/2 rounded-full bg-champagne" />
      </div>
    </div>
  );
}
