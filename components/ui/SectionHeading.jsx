// Latin italic eyebrow above headings (DESIGN_SPEC §2.2 / §3.6)
export function Eyebrow({ children, className = "" }) {
  return (
    <span
      className={`block font-latin italic text-rose text-lg lg:text-[22px] leading-tight ${className}`}
    >
      <span dir="ltr">{children}</span>
    </span>
  );
}

// Eyebrow + Amiri H2, with an optional action (usually a text link) on the opposite side.
export default function SectionHeading({
  eyebrow,
  title,
  as: Tag = "h2",
  action,
  className = "",
  titleClassName = "text-[28px] lg:text-[clamp(34px,3.4vw,48px)]",
}) {
  return (
    <div className={`flex items-end justify-between gap-4 ${className}`}>
      <div>
        {eyebrow && <Eyebrow className="mb-1">{eyebrow}</Eyebrow>}
        <Tag className={`font-display font-bold text-ink leading-[1.3] ${titleClassName}`}>
          {title}
        </Tag>
      </div>
      {action && <div className="shrink-0 pb-1">{action}</div>}
    </div>
  );
}
