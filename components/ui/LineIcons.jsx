// Line illustrations from the design reference (96×96 grid). Inherit text color.
function LineIcon({ className = "", size = 96, children }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export function BouquetIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M48 22c-3-5-10-6-12-1-2 4 2 9 6 9" />
      <path d="M48 22c3-5 10-6 12-1 2 4-2 9-6 9" />
      <circle cx="48" cy="28" r="6" />
      <circle cx="34" cy="34" r="6" />
      <circle cx="62" cy="34" r="6" />
      <path d="M34 40l10 18M62 40L52 58M48 34v24" />
      <path d="M40 56h16l-3 26h-10z" />
      <path d="M38 64c4 3 16 3 20 0" />
    </LineIcon>
  );
}

export function MakeupIcon(props) {
  return (
    <LineIcon {...props}>
      <circle cx="36" cy="58" r="20" />
      <circle cx="36" cy="58" r="12" />
      <path d="M62 20l14 14-18 26-8-8z" />
      <path d="M50 52l-6 10 8-4" />
    </LineIcon>
  );
}

export function DressIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M40 12l-4 12 6 6-16 54h44L54 30l6-6-4-12" />
      <path d="M40 12c2 4 6 6 8 6s6-2 8-6" />
      <path d="M36 50c8 3 16 3 24 0" />
    </LineIcon>
  );
}

export function ArchIcon(props) {
  return (
    <LineIcon {...props}>
      <path d="M20 84V44a28 28 0 0 1 56 0v40" />
      <path d="M14 84h68" />
      <circle cx="24" cy="30" r="4" />
      <circle cx="34" cy="20" r="4" />
      <circle cx="48" cy="16" r="4" />
      <circle cx="62" cy="20" r="4" />
      <circle cx="72" cy="30" r="4" />
    </LineIcon>
  );
}
