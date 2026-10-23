import "./globals.css";
import { ToastProvider } from "contexts/ToastContext";
import { amiri, plexArabic, cormorant } from "./fonts";

export const metadata = {
  metadataBase: new URL("https://maskatblooms.com"),
  title: {
    default: "متجر المسكات | مسكات عرائس فاخرة في الأردن",
    template: "%s | متجر المسكات",
  },
  description:
    "أجمل تصاميم المسكات للعرائس من ورود فاخرة. توصيل سريع لجميع مناطق الأردن. احجزي الآن! 🌸",
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
  authors: [{ name: "متجر المسكات" }],
  creator: "متجر المسكات",
  publisher: "متجر المسكات",
  openGraph: {
    type: "website",
    locale: "ar_JO",
    url: "https://maskatblooms.com",
    siteName: "متجر المسكات",
    title: "متجر المسكات | مسكات عرائس فاخرة 🌸",
    description: "تصاميم مميزة لأجمل المناسبات",
    images: [
      {
        url: "/maskatbloomsImage.jpg",
        width: 1200,
        height: 630,
        alt: "متجر المسكات",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "متجر المسكات 🌸",
    description: "تصاميم مميزة لأجمل المناسبات",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${amiri.variable} ${plexArabic.variable} ${cormorant.variable} font-sans bg-pearl text-ink antialiased`}
      >
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
