import { useState } from 'react'
import type { PublicProduct } from '../../lib/productPresentation'
import { productImageUrl } from '../../lib/productPresentation'
import { VehicleImage } from './VehicleImage'

export function ProductGallery({ product }: { product: PublicProduct }) {
  const images = product.images ?? []
  const [selected, setSelected] = useState(
    Math.max(
      0,
      images.findIndex((image) => image.url === product.image),
    ),
  )
  const image = images[selected] ?? images[0]
  if (!image) return null
  return (
    <div aria-label={`${product.name} image gallery`}>
      <div className="detail-visual">
        <VehicleImage src={image.url} name={product.name} alt={image.alt} eager />
      </div>
      {image.caption && (
        <p className="mt-3 text-xs text-slate-600" aria-live="polite">
          {image.caption}
        </p>
      )}
      {images.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {images.map((item, index) => (
            <button
              type="button"
              key={item.url}
              className={`gallery-thumbnail ${index === selected ? 'is-selected' : ''}`}
              aria-label={`View ${item.alt}`}
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
            >
              <img src={productImageUrl(item.url, 160)} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
