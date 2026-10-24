import WhatsAppIcon from "components/ui/WhatsAppIcon";
import { whatsappOrderUrl } from "lib/whatsappMessage";
import { WA_CTA } from "lib/contact";

// Green WhatsApp order link: same message as the product page (lib/whatsappMessage).
export default function OrderLink({ product, name, className = "", children }) {
  return (
    <a
      href={whatsappOrderUrl(product)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`اطلبي ${name} عبر واتساب`}
      {...WA_CTA}
      className={`mb-tap inline-flex items-center justify-center gap-1.5 rounded-full bg-whatsapp text-white font-semibold ${className}`}
    >
      <WhatsAppIcon className="w-4 h-4 shrink-0" strokeWidth={1.8} />
      {children}
    </a>
  );
}
