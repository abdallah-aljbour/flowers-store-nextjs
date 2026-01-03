import WishlistPageContent from "components/wishListContent";

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
    url: "https://maskatblooms.com/wishlist",
  },
};

export default function WishlistPage() {
  return <WishlistPageContent />;
}
