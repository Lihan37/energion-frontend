export type ProductCategory = string

export interface ProductSpec {
  label: string
  value: string
}

export interface ProductImage {
  url: string
  publicId?: string
  alt: string
  caption?: string
  colour?: string
}

export interface Product {
  id: string
  name: string
  slug: string
  category: ProductCategory
  price: number
  battery: string
  range: string
  topSpeed: string
  chargingTime: string
  colors: string[]
  shortDescription: string
  description: string
  image: string
  images?: ProductImage[]
  published?: boolean
  featured?: boolean
  tag?: string
  specs: ProductSpec[]
  createdAt?: string
  updatedAt?: string
}
