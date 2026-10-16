import { apiClient } from './apiClient'
import { toPublicProduct } from '../lib/productPresentation'
import type { Product, ProductImage, ProductSpec } from '../types/product'

interface ProductPayload {
  name: string
  slug?: string
  category: string
  price: number
  battery: string
  range: string
  topSpeed: string
  chargingTime: string
  colors: string[]
  shortDescription: string
  description: string
  featured?: boolean
  tag?: string
  removeImage?: boolean
  images?: ProductImage[]
  primaryImageUrl?: string
  published?: boolean
  specs: ProductSpec[]
}

function createProductFormData(payload: ProductPayload, imageFile?: File | null) {
  const formData = new FormData()
  formData.append('payload', JSON.stringify(payload))

  if (imageFile) {
    formData.append('image', imageFile)
  }

  return formData
}

export async function getProducts() {
  const { data } = await apiClient.get<{ products: Product[] }>('/products')
  return data.products.filter((product) => product.published !== false).map(toPublicProduct)
}

export async function getAdminProducts() {
  const { data } = await apiClient.get<{ products: Product[] }>('/admin/products')
  return data.products
}

export async function createProduct(payload: ProductPayload, imageFile: File) {
  const { data } = await apiClient.post<{ product: Product }>(
    '/admin/products',
    createProductFormData(payload, imageFile),
  )
  return data.product
}

export async function updateProduct(
  productId: string,
  payload: ProductPayload,
  imageFile?: File | null,
) {
  const { data } = await apiClient.put<{ product: Product }>(
    `/admin/products/${productId}`,
    createProductFormData(payload, imageFile),
  )
  return data.product
}

export async function deleteProduct(productId: string) {
  const { data } = await apiClient.delete<{ message: string }>(`/admin/products/${productId}`)
  return data
}

export type { ProductPayload }
