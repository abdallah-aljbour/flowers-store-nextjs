import Link from "next/link";
import { Instagram } from "lucide-react";
import Logo from "components/ui/Logo";
import WhatsAppIcon from "components/ui/WhatsAppIcon";
import { NAV_LINKS } from "lib/navigation";
import { WHATSAPP_URL, INSTAGRAM_URL } from "lib/contact";

const year = new Date().getFullYear();
const copyright = `© ${year} متجر المسكات · صُنع بحب في الأردن`;
const tagline = "متجر المسكات · تصاميم مميزة لأجمل المناسبات";

// Site footer (DESIGN_SPEC §3.9). `compact` = logo + © only (catalog page).
export default function Footer({ compact = false, className = "" }) {
  if (compact) {
    return (
      <footer className={`mt-12 bg-champagne px-5 py-8 flex flex-col items-center gap-3 text-center ${className}`}>
        <Logo size={88} />
        <p className="text-xs text-ink-muted">{copyright}</p>
      </footer>
    );
  }

  return (
    <footer className={`mt-12 lg:mt-24 bg-champagne ${className}`}>
      {/* Mobile */}
      <div className="lg:hidden px-5 pt-9 pb-10 flex flex-col items-center gap-3.5 text-center">
        <Logo size={120} />
        <p className="text-sm text-ink-muted">{tagline}</p>
        <nav aria-label="روابط سريعة" className="flex flex-wrap justify-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className="min-h-tap inline-flex items-center px-2 text-sm font-medium text-ink hover:text-rose"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <ContactIcons />
        <p className="text-xs text-ink-muted">{copyright}</p>
      </div>

      {/* Desktop */}
      <div className="hidden lg:flex max-w-container mx-auto px-6 pt-14 pb-8 flex-col gap-8">
        <div className="flex flex-wrap justify-between items-start gap-8">
          <div className="flex flex-col gap-2.5">
            <Logo size={128} />
            <p className="text-[15px] text-ink-muted">{tagline}</p>
          </div>

          <nav aria-label="روابط سريعة" className="flex flex-col gap-2.5 text-[15px]">
            <span className="font-semibold text-ink">روابط سريعة</span>
            {NAV_LINKS.map((link) => (
              <Link key={link.key} href={link.href} className="text-ink hover:text-rose">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <span className="text-[15px] font-semibold text-ink">تواصلي معنا</span>
            <ContactIcons />
          </div>
        </div>

        <p className="pt-5 border-t border-line text-[13px] text-ink-muted">{copyright}</p>
      </div>
    </footer>
  );
}

function ContactIcons() {
  return (
    <div className="flex gap-2.5">
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="واتساب"
        className="mb-tap w-12 h-12 rounded-full bg-whatsapp text-white flex items-center justify-center"
      >
        <WhatsAppIcon className="w-[22px] h-[22px]" />
      </a>
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="إنستغرام"
        className="mb-tap w-12 h-12 rounded-full bg-white border-[1.5px] border-rose text-rose flex items-center justify-center"
      >
        <Instagram className="w-[22px] h-[22px]" strokeWidth={1.7} aria-hidden="true" />
      </a>
    </div>
  );
}
