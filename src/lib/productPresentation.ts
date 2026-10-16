import type { Product } from '../types/product'

// Public views never receive purchase pricing. Admin APIs retain the full model.
export type PublicProduct = Omit<Product, 'price'>

export function toPublicProduct(product: Product): PublicProduct {
  const { price, ...publicProduct } = product
  void price
  return publicProduct
}

export function productImageUrl(source: string, width = 1000) {
  if (!source.includes('res.cloudinary.com/') || !source.includes('/image/upload/')) return source
  return source.replace('/image/upload/', `/image/upload/f_auto,q_auto,w_${width},c_limit/`)
}

export function enquiryUrl(product: PublicProduct) {
  return `/contact?model=${encodeURIComponent(product.name)}`
}

export function productMetrics(product: PublicProduct) {
  return [
    { label: 'Range', value: product.range },
    { label: 'Top speed', value: product.topSpeed },
    { label: 'Battery', value: product.battery },
    { label: 'Charging', value: product.chargingTime },
  ].filter((metric) => metric.value)
}
