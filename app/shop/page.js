import ShopContent from "components/shop/ShopContent";

export const metadata = {
  title: "المجموعة - مسكات عرائس فاخرة",
  description:
    "تصفحي مجموعة متجر المسكات: مسكات عرائس وباقات ورد فاخرة لأجمل المناسبات. ابحثي حسب نوع الورد واللون والسعر، مع توصيل لجميع مناطق الأردن.",
  keywords: [
    "مسكات عرائس",
    "مسكات ورد",
    "مسكات خطوبة",
    "ورد طبيعي",
    "عمان",
    "الأردن",
    "مسكات فاخرة",
    "توصيل مسكات",
  ],
  alternates: {
    canonical: "https://maskatblooms.com/shop",
  },
  openGraph: {
    type: "website",
    locale: "ar_JO",
    url: "https://maskatblooms.com/shop",
    siteName: "متجر المسكات",
    title: "المجموعة | متجر المسكات",
    description: "مسكات عرائس وباقات لأجمل المناسبات",
    images: [
      {
        url: "/maskatbloomsImage.jpg",
        width: 1200,
        height: 630,
        alt: "متجر المسكات",
      },
    ],
  },
};

export default function ShopPage() {
  return <ShopContent />;
}
