import "./globals.css";

export const metadata = {
  title: "متجر المسكات - تصاميم مميزة",
  description: "تصاميم مميزة لأجمل المناسبات",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">{children}</body>
    </html>
  );
}
