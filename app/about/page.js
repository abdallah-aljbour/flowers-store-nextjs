import AboutPageContenet from "components/AboutPageContent";
import { SITE_URL } from "lib/site";
export const metadata = {
  title: "من نحن - قصتنا وشركاؤنا",
  description:
    "تعرفي على متجر المسكات وشركائنا في صناعة يوم عرسك المثالي. صالون هالة برجوس، كليمانس للعرائس، وكليمانس للمناسبات. معاً نصنع يومك المثالي.",
  keywords: [
    "عن متجر المسكات",
    "صالون هالة برجوس",
    "كليمانس للعرائس",
    "كليمانس للمناسبات",
    "شركاء النجاح",
    "عمان",
    "الصويفية",
    "باقة عرس كاملة",
  ],
  openGraph: {
    title: "من نحن | متجر المسكات 🤝",
    description:
      "قصتنا مع أفضل الشركاء في عمان - صالون هالة برجوس، كليمانس للعرائس، كليمانس للمناسبات",
    url: `${SITE_URL}/about`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "من نحن | متجر المسكات 🤝",
    description: "قصتنا مع أفضل الشركاء في صناعة يوم عرسك المثالي",
  },
};

export default function AboutPage() {
  return <AboutPageContenet />;
}
