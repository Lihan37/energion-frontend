import { productMetrics, type PublicProduct } from '../../lib/productPresentation'

export function SpecificationHighlights({ product }: { product: PublicProduct }) {
  if (!productMetrics(product).length) return null
  return (
    <dl className="spec-highlights">
      {productMetrics(product).map((metric) => (
        <div key={metric.label} className="spec-highlight">
          <dt>{metric.label}</dt>
          <dd>{metric.value}</dd>
        </div>
      ))}
    </dl>
  )
}
