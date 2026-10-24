// Order message + links, moved unchanged from ProductDetails.handleOrder so the
// product page and the wishlist share one builder. Do NOT edit the text or format.

export const buildOrderMessage = (product) =>
  encodeURIComponent(
    `مرحباً 🌸

أريد طلب هذه المسكة:

📦 *${product.name}*
نوع الورد: ${product.flowerType} 💐 

 الوصف📝:
${product.description}

 السعر: *${product.salePrice} دينار 💰*

`
  );

export const whatsappOrderUrl = (product) =>
  `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${buildOrderMessage(product)}`;

export const instagramOrderUrl = () =>
  `https://instagram.com/${process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME}`;

// Same behaviour as the original handleOrder(platform)
export const handleOrder = (product, platform) => {
  if (platform === "instagram") {
    // فتح Instagram مباشرة بدون أي عجقة
    window.open(instagramOrderUrl(), "_blank");
  } else if (platform === "whatsapp") {
    // WhatsApp مع الرسالة الكاملة
    window.open(whatsappOrderUrl(product), "_blank");
  }
};
