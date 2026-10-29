import Header from "components/Header";
import Footer from "components/Footer";
import Button from "components/ui/Button";
import { SHOP_PATH } from "lib/navigation";

// Shown for unknown URLs and for products the shop doesn't show (bags, unpublished)
export const metadata = {
  title: "الصفحة غير موجودة",
  description: "الصفحة التي تبحثين عنها غير متوفرة",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <h1 className="font-display font-bold text-[28px] text-ink">الصفحة غير موجودة</h1>
        <p className="text-sm text-ink-muted max-w-[320px]">
          يمكن إنو الرابط قديم أو المسكة ما عادت متوفرة. تصفحي مجموعتنا واختاري مسكتك.
        </p>
        <Button href={SHOP_PATH} className="mt-2">
          تصفحي المجموعة
        </Button>
        <Button href="/" variant="text">
          العودة للرئيسية
        </Button>
      </main>
      <Footer compact />
    </div>
  );
}
