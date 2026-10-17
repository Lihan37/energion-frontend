import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { enquiryUrl, productUrl, type PublicProduct } from '../../lib/productPresentation'
import { VehicleImage } from './VehicleImage'
import { SpecificationHighlights } from './SpecificationHighlights'

interface ProductCardProps {
  product: PublicProduct
}
export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="vehicle-card">
      <div className="vehicle-card-visual">
        <span className="vehicle-category">
          {product.category}
          {product.tag ? ` / ${product.tag}` : ''}
        </span>
        <VehicleImage src={product.image} name={product.name} width={700} />
        <span className="card-direction" aria-hidden="true">
          <ArrowUpRight size={24} />
        </span>
      </div>
      <div className="vehicle-card-body">
        <h3>{product.name}</h3>
        <p>{product.shortDescription}</p>
        {product.battery || product.range || product.topSpeed || product.chargingTime ? (
          <SpecificationHighlights product={product} />
        ) : (
          <div className="card-model-note">
            <span>ALL ELECTRIC</span>
            <span>Discover your next direction</span>
          </div>
        )}
        <div className="vehicle-card-footer">
          <Link
            to={productUrl(product)}
            className="model-detail-link"
            aria-label={`Explore ${product.name}`}
          >
            Explore model <ArrowUpRight size={17} />
          </Link>
          <Link to={enquiryUrl(product)}>Enquire now</Link>
        </div>
      </div>
    </article>
  )
}
