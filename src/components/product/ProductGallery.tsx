import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { PublicProduct } from '../../lib/productPresentation'
import { productImageUrl } from '../../lib/productPresentation'
import { VehicleImage } from './VehicleImage'

export function ProductGallery({ product }: { product: PublicProduct }) {
  const reduced = useReducedMotion()
  const images = product.images ?? []
  const [selectedUrl, setSelectedUrl] = useState(product.image)
  const selectedMatch = images.findIndex((image) => image.url === selectedUrl)
  const selected =
    selectedMatch >= 0
      ? selectedMatch
      : Math.max(
          0,
          images.findIndex((image) => image.url === product.image),
        )
  const image = images[selected]
  if (!image) return null
  return (
    <div aria-label={`${product.name} image gallery`}>
      <motion.div
        key={image.url}
        className="detail-visual"
        initial={reduced ? false : { opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduced ? 0 : 0.3 }}
      >
        <VehicleImage src={image.url} name={product.name} alt={image.alt} eager width={1400} />
      </motion.div>
      <div className="gallery-view-label" aria-live="polite">
        <span>{image.colour || product.name}</span>
        <span>
          {String(selected + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
        </span>
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
              onClick={() => setSelectedUrl(item.url)}
            >
              <img src={productImageUrl(item.url, 160)} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
