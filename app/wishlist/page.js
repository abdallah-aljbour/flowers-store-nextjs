import WishlistPageContent from "components/wishListContent";
import { SITE_URL } from "lib/site";

export const metadata = {
  title: "المفضلة - مسكاتي المحفوظة 💗",
  description:
    "المنتجات المفضلة لديك من متجر المسكات. احفظي مسكاتك المفضلة واطلبيها لاحقاً.",
  robots: {
    index: false, // مش محتاجين Google يفهرس صفحة شخصية
    follow: true,
  },
  openGraph: {
    title: "المفضلة | متجر المسكات 💗",
    description: "مسكاتي المحفوظة",
    url: `${SITE_URL}/wishlist`,
  },
};

export default function WishlistPage() {
  return <WishlistPageContent />;
}
