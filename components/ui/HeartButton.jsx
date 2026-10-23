"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "hooks/useWishlist";
import { useToast } from "contexts/ToastContext";

// Petal burst offsets and colors (DESIGN_SPEC §3.4)
const PETALS = [
  { dx: -22, dy: -20, color: "#F2B8C4" },
  { dx: 22, dy: -22, color: "#E8D5B7" },
  { dx: -26, dy: 10, color: "#9E4F69" },
  { dx: 24, dy: 14, color: "#F2B8C4" },
  { dx: 0, dy: -30, color: "#E8D5B7" },
];

// Visual circle per variant; the button itself is always a 44×44 hit area.
const CIRCLE = {
  photo: "w-10 h-10 bg-white/95", // on top of product photos
  outline: "w-11 h-11 bg-white border border-line", // on pearl surfaces
  rose: "w-10 h-10 bg-white border-[1.5px] border-rose", // wishlist rows
};

export default function HeartButton({
  productId,
  productName = "",
  variant = "photo",
  iconClassName = "w-5 h-5",
  className = "",
}) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { success } = useToast();
  const saved = isInWishlist(productId);
  const [popKey, setPopKey] = useState(0);
  const [burstKey, setBurstKey] = useState(0);

  useEffect(() => {
    if (!burstKey) return;
    const timer = setTimeout(() => setBurstKey(0), 750);
    return () => clearTimeout(timer);
  }, [burstKey]);

  const handleClick = (e) => {
    // Cards wrap the heart in a link — keep the tap on the heart
    e.preventDefault();
    e.stopPropagation();

    toggleWishlist(productId);
    setPopKey((k) => k + 1);

    if (saved) {
      success("أُزيلت من المفضلة");
    } else {
      setBurstKey(Date.now());
      success("أُضيفت إلى المفضلة");
    }
  };

  const label = saved
    ? `إزالة ${productName} من المفضلة`.replace(/\s+/g, " ")
    : `حفظ ${productName} في المفضلة`.replace(/\s+/g, " ");

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={label}
      className={`mb-tap relative inline-flex items-center justify-center w-11 h-11 shrink-0 ${className}`}
    >
      <span
        aria-hidden="true"
        className={`flex items-center justify-center rounded-full ${CIRCLE[variant]}`}
      >
        <span key={popKey} className={popKey ? "mb-pop" : "flex"}>
          <Heart
            className={`${iconClassName} transition-colors duration-200 ${
              saved ? "fill-rose text-rose" : "text-ink"
            }`}
            strokeWidth={1.7}
          />
        </span>
      </span>

      {burstKey > 0 &&
        PETALS.map((p, i) => (
          <span
            key={`${burstKey}-${i}`}
            aria-hidden="true"
            className="mb-petal"
            style={{ "--dx": `${p.dx}px`, "--dy": `${p.dy}px`, background: p.color }}
          />
        ))}
    </button>
  );
}
