import { ArrowUpRight, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { enquiryUrl, type PublicProduct } from '../../lib/productPresentation'
import { siteConfig } from '../../constants/site'
import { Modal } from '../ui/Modal'
import { SpecificationHighlights } from './SpecificationHighlights'
import { VehicleImage } from './VehicleImage'
import { ProductGallery } from './ProductGallery'

interface ProductModalProps {
  product: PublicProduct | null
  isOpen: boolean
  onClose: () => void
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  if (!product) return null
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product.name} className="product-dialog">
      <div className="product-detail">
        <div className="detail-top">
          <div>
            {product.images?.length ? (
              <ProductGallery key={product.id} product={product} />
            ) : (
              <div className="detail-visual">
                <VehicleImage src={product.image} name={product.name} eager />
              </div>
            )}
            <SpecificationHighlights product={product} />
          </div>
          <div>
            <span className="eyebrow">
              {product.category}
              {product.tag ? ` / ${product.tag}` : ''}
            </span>
            <h2 className="detail-name">{product.name}</h2>
            <p className="detail-copy">{product.description}</p>
            {product.colors.length > 0 && (
              <>
                <h3 className="mt-6 text-[10px] uppercase tracking-widest">Available colours</h3>
                <div className="detail-colors">
                  {product.colors.map((color) => (
                    <span key={color}>{color}</span>
                  ))}
                </div>
              </>
            )}
            <div className="model-actions">
              <Link to={enquiryUrl(product)} onClick={onClose} className="cta">
                Enquire about this model <ArrowUpRight size={16} />
              </Link>
              <a href={`tel:${siteConfig.phone}`} className="text-link">
                <Phone size={15} /> Talk to our team
              </a>
            </div>
          </div>
        </div>
        {product.specs.length > 0 && (
          <section className="detail-section">
            <h3>Made for the way you move.</h3>
            <dl className="detail-specs">
              {product.specs.map((spec, index) => (
                <div key={`${spec.label}-${index}`}>
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>
    </Modal>
  )
}
