import HomeContent from "components/HomeContent";

export const metadata = {
  title: "مسكات عرائس فاخرة",
  description:
    "تصفحي أجمل مسكات العرائس من ورود فاخرة. تصاميم فريدة لكل مناسبة. توصيل سريع لجميع مناطق الأردن.",
  openGraph: {
    title: "متجر المسكات - أجمل مسكات العرائس 🌸",
    description: "تصاميم فريدة من ورود طبيعية فاخرة",
    url: "https://yoursite.com",
  },
};

export default function Home() {
  return <HomeContent />;
}
