import { useState } from 'react'
import { productImageUrl } from '../../lib/productPresentation'

export function VehicleImage({
  src,
  name,
  eager = false,
  width = 1000,
  alt,
}: {
  src: string
  name: string
  eager?: boolean
  width?: number
  alt?: string
}) {
  const [failedSource, setFailedSource] = useState<string | null>(null)
  if (!src || failedSource === src) {
    return (
      <div className="image-placeholder">
        <span className="image-placeholder-name">{name}</span>
        <small>Product photography coming soon</small>
      </div>
    )
  }
  return (
    <img
      src={productImageUrl(src, width)}
      alt={alt || `${name} electric vehicle`}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : 'auto'}
      decoding="async"
      onError={() => setFailedSource(src)}
    />
  )
}
