"use client";

import { useEffect, useRef, useState } from "react";
import Button from "components/ui/Button";
import WhatsAppIcon from "components/ui/WhatsAppIcon";
import { ArchIcon, BouquetIcon, DressIcon, MakeupIcon } from "components/ui/LineIcons";
import { PARTNERS } from "lib/partners";
import { WHATSAPP_URL } from "lib/contact";

const TITLE = "باقة كاملة ليوم عرسك";
const CAPTION = "بالتعاون مع شركاء النجاح في الصويفية، عمّان";
const STICKY_TOP = 64; // below the mobile header

// Chapters 2–4 come from the partners list (lib/partners.js)
const CHAPTERS = [
  { title: "المسكة", by: "من متجر المسكات", Icon: BouquetIcon },
  { title: "المكياج", by: PARTNERS[0].nameAr, Icon: MakeupIcon },
  { title: "بدلة العرس", by: PARTNERS[1].nameAr, Icon: DressIcon },
  { title: "الكوشة", by: PARTNERS[2].nameAr, Icon: ArchIcon },
];

// Package story (DESIGN_SPEC §4.1-6). Mobile: tall section with a sticky panel whose
// chapter follows the scroll. Desktop: a static row of the 4 chapters in a champagne band.
// `onVisibleChange(visible)` reports when the mobile story is on screen (Home hides its FAB,
// which would cover the story's own WhatsApp button).
export default function PackageStory({ onVisibleChange }) {
  return (
    <>
      <MobileStory onVisibleChange={onVisibleChange} />
      <DesktopBand />
    </>
  );
}

function Actions({ className = "", askLabel = "اسألي" }) {
  return (
    <div className={`flex gap-2.5 ${className}`}>
      <Button href="/about#partners" className="flex-1 min-h-[50px] lg:flex-none lg:min-h-[52px] lg:px-[26px]">
        اكتشفي الباقة
      </Button>
      <Button
        href={WHATSAPP_URL}
        external
        variant="whatsapp"
        className="min-h-[50px] px-4 text-sm lg:min-h-[52px] lg:px-5 lg:text-[15px]"
      >
        <WhatsAppIcon className="w-[18px] h-[18px]" />
        {askLabel}
      </Button>
    </div>
  );
}

function MobileStory({ onVisibleChange }) {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !onVisibleChange || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => onVisibleChange(entry.isIntersecting));
    io.observe(section);
    return () => {
      io.disconnect();
      onVisibleChange(false);
    };
  }, [onVisibleChange]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let frame = 0;
    let current = 0;

    const update = () => {
      frame = 0;
      const panel = section.firstElementChild;
      if (!panel || !section.offsetHeight) return; // hidden (desktop)
      const rect = section.getBoundingClientRect();
      const range = rect.height - panel.offsetHeight;
      const progress = range > 0 ? Math.min(1, Math.max(0, (STICKY_TOP - rect.top) / range)) : 0;
      const index = Math.min(CHAPTERS.length - 1, Math.floor(progress * CHAPTERS.length));
      if (index !== current) {
        current = index;
        setActive(index);
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label={TITLE}
      className="lg:hidden relative mt-14 h-[2400px] bg-champagne-deep"
    >
      <div className="sticky top-16 h-[min(780px,calc(100svh-4rem))] px-[22px] pt-7 pb-[26px] flex flex-col gap-3.5 overflow-hidden">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-ink-muted">{CAPTION}</span>
          <h2 className="font-display font-bold text-[32px] leading-[1.2] text-ink">{TITLE}</h2>
        </div>

        <div className="flex gap-1.5" aria-hidden="true">
          {CHAPTERS.map((chapter, i) => (
            <span
              key={chapter.title}
              className={`mb-bar h-[3px] basis-0 rounded-full ${
                i <= active ? "bg-rose" : "bg-[#E2D3BD]"
              }`}
              style={{ flexGrow: i === active ? 3 : 1 }}
            />
          ))}
        </div>

        {/* Screen readers get the full list; the animated layers are decorative */}
        <ol className="sr-only">
          {CHAPTERS.map((chapter) => (
            <li key={chapter.title}>
              {chapter.title}: {chapter.by}
            </li>
          ))}
        </ol>

        <div className="relative flex-1 min-h-0" aria-hidden="true">
          {CHAPTERS.map(({ title, by, Icon }, i) => (
            <div key={title} className={`mb-layer ${i === active ? "is-on" : ""}`}>
              <div className="mb-halo w-[min(250px,28svh)] aspect-square rounded-full border border-line-gold flex items-center justify-center">
                <div className="mb-disc w-[92%] aspect-square rounded-full bg-pearl overflow-hidden flex items-center justify-center">
                  <Icon className="w-1/2 h-auto text-rose" />
                </div>
              </div>
              <span dir="ltr" className="mb-ch1 font-latin text-[clamp(52px,8svh,72px)] leading-none text-rose">
                {i + 1}
              </span>
              <span className="mb-ch2 font-display font-bold text-[32px] leading-tight text-ink">{title}</span>
              <span className="mb-ch3 text-[15px] text-ink-muted text-center">{by}</span>
            </div>
          ))}
        </div>

        <Actions />
      </div>
    </section>
  );
}

function DesktopBand() {
  return (
    <section aria-label={TITLE} className="max-lg:hidden max-w-container mx-auto mt-[104px] px-6">
      <div className="rounded-[40px] bg-champagne-deep p-[clamp(32px,5vw,64px)] flex flex-col gap-10">
        <div className="mb-rv flex flex-wrap items-end justify-between gap-5">
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-ink-muted">{CAPTION}</span>
            <h2 className="font-display font-bold text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.15] text-ink">
              {TITLE}
            </h2>
          </div>
          <Actions className="gap-3 flex-wrap" askLabel="اسألي عبر واتساب" />
        </div>

        <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-6">
          {CHAPTERS.map(({ title, by, Icon }, i) => (
            <li key={title} className="mb-rv flex flex-col items-center gap-3 text-center">
              <div className="w-[190px] h-[190px] rounded-full border border-line-gold flex items-center justify-center">
                <div className="w-[172px] h-[172px] rounded-full bg-pearl flex items-center justify-center">
                  <Icon size={96} className="text-rose" />
                </div>
              </div>
              <span dir="ltr" aria-hidden="true" className="font-latin text-5xl leading-none text-rose">
                {i + 1}
              </span>
              <h3 className="font-display font-bold text-[26px] text-ink">{title}</h3>
              <span className="text-sm text-ink-muted">{by}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
