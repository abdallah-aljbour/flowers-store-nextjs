// Product image alt text — same format as ProductCard (SEO; do not change the wording).
export function productAlt(product) {
  return `مسكة ${product.flowerType} ${
    product.colors?.join(" و") || ""
  } - ${product.name} - متجر المسكات عمان الأردن`;
}

export default productAlt;
