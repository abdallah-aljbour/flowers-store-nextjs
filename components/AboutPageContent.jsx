"use client";

import { useEffect } from "react";
import { Award, Gem, Heart, HeartHandshake, Instagram, MapPin, Sparkles } from "lucide-react";
import Header from "components/Header";
import Footer from "components/Footer";
import Logo from "components/ui/Logo";
import Button from "components/ui/Button";
import WhatsAppIcon from "components/ui/WhatsAppIcon";
import { Eyebrow } from "components/ui/SectionHeading";
import { ArchIcon, BouquetIcon, DressIcon, MakeupIcon } from "components/ui/LineIcons";
import { PARTNERS } from "lib/partners";
import { WHATSAPP_URL, INSTAGRAM_URL } from "lib/contact";

// Line icons for the partners, in lib/partners.js order (makeup, dress, kosha)
const PARTNER_ICONS = [MakeupIcon, DressIcon, ArchIcon];

const PACKAGE_ITEMS = [
  { label: "المسكة", Icon: BouquetIcon },
  { label: "المكياج", Icon: MakeupIcon },
  { label: "البدلة", Icon: DressIcon },
  { label: "الكوشة", Icon: ArchIcon },
];

const REASONS = [
  { title: "تصاميم فريدة", text: "كل مسكة نصنعها هي قطعة فنية حصرية بتصميم خاص", Icon: Sparkles },
  { title: "ورود فاخرة", text: "نختار أجود أنواع الورود لضمان جودة عالية ومظهر رائع", Icon: Gem },
  { title: "عناية شخصية", text: "نهتم بكل تفصيلة لنضمن رضاك التام عن منتجنا", Icon: Heart },
];

const card = "bg-white border border-line rounded-card";

// About (DESIGN_SPEC §4.7): not redesigned — same content, Pearl Champagne tokens.
export default function AboutPageContenet() {
  useEffect(() => {
    // Scroll to partners section if hash exists
    if (window.location.hash === "#partners") {
      setTimeout(() => {
        document.getElementById("partners")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, []);

  const stats = [
    { number: "500+", label: "عروس سعيدة" },
    { number: "1000+", label: "مسكة مميزة" },
    { number: "100%", label: "رضا العملاء" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 pt-8 pb-4 lg:pt-14">
        {/* Hero Section */}
        <div className="text-center mb-8 lg:mb-12 flex flex-col items-center">
          <Logo size={112} className="mb-3" />
          <Eyebrow>Our story</Eyebrow>
          <h1 className="font-display font-bold text-[34px] lg:text-[44px] leading-[1.3] text-ink">من نحن</h1>
          <p className="mt-1 text-[15px] text-ink-muted">متجر المسكات · تصاميم مميزة لأجمل المناسبات</p>
          <span className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-rose">
            <Sparkles className="w-4 h-4" strokeWidth={1.7} aria-hidden="true" />
            نصنع ذكريات لا تُنسى
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-champagne rounded-card px-2 py-4 text-center">
              <div dir="ltr" className="font-latin font-semibold text-[30px] lg:text-[38px] leading-none text-rose mb-1.5">
                {stat.number}
              </div>
              <div className="text-xs lg:text-sm text-ink-muted">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Story */}
        <section className={`${card} p-6 mb-6`}>
          <h2 className="flex items-center gap-2 mb-3 font-display font-bold text-2xl text-ink">
            <Heart className="w-5 h-5 text-rose" strokeWidth={1.7} aria-hidden="true" />
            قصتنا
          </h2>
          <p className="text-[15px] text-ink-muted leading-[1.9] mb-3">
            بدأنا رحلتنا من حب عميق لفن تنسيق الورود وشغف بصناعة اللحظات
            السعيدة. كل مسكة نصنعها هي قطعة فنية فريدة، مصممة خصيصاً لتعكس جمال
            يومك الخاص.
          </p>
          <p className="text-[15px] text-ink-muted leading-[1.9]">
            نؤمن بأن التفاصيل الصغيرة تصنع الفرق الكبير، ولهذا نختار كل وردة
            بعناية فائقة لنقدم لك الأفضل دائماً.
          </p>
        </section>

        {/* Why Us */}
        <section className={`${card} p-6 mb-10`}>
          <h2 className="flex items-center gap-2 mb-4 font-display font-bold text-2xl text-ink">
            <Award className="w-5 h-5 text-rose" strokeWidth={1.7} aria-hidden="true" />
            لماذا نحن مميزون؟
          </h2>
          <ul className="flex flex-col gap-4">
            {REASONS.map(({ title, text, Icon }) => (
              <li key={title} className="flex items-start gap-3">
                <span className="w-10 h-10 rounded-full bg-champagne flex items-center justify-center shrink-0">
                  <Icon className="w-[18px] h-[18px] text-rose" strokeWidth={1.7} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-[15px] font-semibold text-ink mb-0.5">{title}</h3>
                  <p className="text-sm text-ink-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Partners */}
        <section id="partners" className="mb-10 scroll-mt-24">
          <div className="text-center mb-5">
            <h2 className="inline-flex items-center gap-2 font-display font-bold text-[28px] text-ink">
              <HeartHandshake className="w-6 h-6 text-rose" strokeWidth={1.6} aria-hidden="true" />
              شركاء النجاح
            </h2>
            <p className="text-sm text-ink-muted">بالتعاون مع أفضل الأسماء في عمان</p>
          </div>

          <ul className="flex flex-col gap-3 lg:grid lg:grid-cols-3">
            {PARTNERS.map((partner, index) => {
              const Icon = PARTNER_ICONS[index] || BouquetIcon;
              return (
                <li key={partner.nameEn} className={`${card} p-4`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-12 h-12 rounded-full border border-line-gold bg-pearl flex items-center justify-center shrink-0">
                      <Icon size={30} className="text-rose" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-lg leading-tight text-ink truncate">
                        {partner.nameAr}
                      </h3>
                      <p dir="ltr" className="text-right font-latin italic text-[15px] text-ink-muted">
                        {partner.nameEn}
                      </p>
                    </div>
                    <a
                      href={partner.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${partner.nameAr} على إنستغرام`}
                      className="mb-tap w-11 h-11 shrink-0 rounded-full bg-white border-[1.5px] border-rose text-rose flex items-center justify-center hover:bg-rose hover:text-white transition-colors"
                    >
                      <Instagram className="w-[18px] h-[18px]" strokeWidth={1.7} />
                    </a>
                  </div>

                  <p className="text-sm text-ink mb-2">{partner.description}</p>

                  <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                    <MapPin className="w-3.5 h-3.5" strokeWidth={1.7} aria-hidden="true" />
                    <span>{partner.location}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Package Offer */}
        <section className="bg-champagne-deep rounded-[28px] px-6 py-8 mb-6 text-center">
          <h2 className="font-display font-bold text-[28px] leading-tight text-ink mb-2">
            باقة كاملة ليوم عرسك!
          </h2>
          <p className="text-[15px] text-ink-muted mb-5">
            احجزي كل شي من مكان واحد واحصلي على خصم خاص
          </p>
          <ul className="flex flex-wrap gap-2 justify-center">
            {PACKAGE_ITEMS.map(({ label, Icon }) => (
              <li
                key={label}
                className="inline-flex items-center gap-1.5 bg-white border border-line rounded-full ps-2 pe-3.5 py-1.5 text-sm text-ink"
              >
                <Icon size={22} className="text-rose" />
                {label}
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section className={`${card} p-6 text-center`}>
          <h2 className="font-display font-bold text-2xl text-ink mb-1.5">جاهزة لتبدئي رحلتك معنا؟</h2>
          <p className="text-sm text-ink-muted mb-5">تواصلي معنا الآن واحصلي على استشارة مجانية</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button href={WHATSAPP_URL} external variant="whatsapp">
              <WhatsAppIcon className="w-[18px] h-[18px]" />
              واتساب
            </Button>
            <Button href={INSTAGRAM_URL} external>
              <Instagram className="w-[18px] h-[18px]" strokeWidth={1.7} aria-hidden="true" />
              إنستغرام
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
