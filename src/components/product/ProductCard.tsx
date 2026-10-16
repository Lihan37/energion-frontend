import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { enquiryUrl, type PublicProduct } from '../../lib/productPresentation'
import { VehicleImage } from './VehicleImage'
import { SpecificationHighlights } from './SpecificationHighlights'

interface ProductCardProps {
  product: PublicProduct
  onOpen: (product: PublicProduct) => void
}
export function ProductCard({ product, onOpen }: ProductCardProps) {
  return (
    <article className="vehicle-card">
      <div className="vehicle-card-visual">
        <span className="vehicle-category">
          {product.category}
          {product.tag ? ` / ${product.tag}` : ''}
        </span>
        <VehicleImage src={product.image} name={product.name} width={700} />
      </div>
      <div className="vehicle-card-body">
        <h3>{product.name}</h3>
        <p>{product.shortDescription}</p>
        <SpecificationHighlights product={product} />
        <div className="vehicle-card-footer">
          <button onClick={() => onOpen(product)} aria-label={`Explore ${product.name}`}>
            Explore model <ArrowUpRight size={17} />
          </button>
          <Link to={enquiryUrl(product)}>Enquire now</Link>
        </div>
      </div>
    </article>
  )
}
