import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ArrowUpRight, Phone } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { CampaignHeading } from '../components/campaign/CampaignHeading'
import { EnergyGraphic } from '../components/campaign/EnergyGraphic'
import { ProductGallery } from '../components/product/ProductGallery'
import { ProductCard } from '../components/product/ProductCard'
import { SpecificationHighlights } from '../components/product/SpecificationHighlights'
import { VehicleImage } from '../components/product/VehicleImage'
import { CatalogState } from '../components/ui/CatalogState'
import { Container } from '../components/ui/Container'
import { siteConfig } from '../constants/site'
import { enquiryUrl, productMetrics, productUrl } from '../lib/productPresentation'
import { getProducts } from '../services/productService'

export function ProductDetailsPage() {
  const { slug } = useParams()
  const query = useQuery({ queryKey: ['products'], queryFn: getProducts })
  const product = query.data?.find((item) => item.slug === slug)
  if (query.isPending || query.isError)
    return (
      <Container className="py-20">
        <CatalogState error={query.isError} retry={() => void query.refetch()} />
      </Container>
    )
  if (!product)
    return (
      <Container className="py-20">
        <div className="status-panel">
          <span className="eyebrow">Model not available</span>
          <h1 className="section-title my-6">Let's find your next ride.</h1>
          <p>This model is not in our current public lineup.</p>
          <Link to="/products" className="cta">
            Explore all models <ArrowUpRight size={16} />
          </Link>
        </div>
      </Container>
    )
  const related = (query.data ?? [])
    .filter((item) => item.id !== product.id)
    .sort(
      (a, b) => Number(b.category === product.category) - Number(a.category === product.category),
    )
    .slice(0, 3)
  const metrics = productMetrics(product)
  const specifications = product.specs.filter((spec) => spec.value.trim())
  return (
    <article className="model-page" data-category={product.category.toLowerCase()}>
      <section className="model-page-hero">
        <Container>
          <nav className="model-breadcrumb" aria-label="Breadcrumb">
            <Link to="/products">
              <ArrowLeft size={14} /> All models
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{product.name}</span>
          </nav>
          <div className="model-page-heading">
            <div>
              <span className="eyebrow">
                Energion / {product.category}
                {product.tag ? ` / ${product.tag}` : ''}
              </span>
              <CampaignHeading as="h1" lines={[product.name]} />
              <p>{product.shortDescription}</p>
            </div>
            <Link className="cta" to={enquiryUrl(product)}>
              Enquire about this model <ArrowUpRight size={17} />
            </Link>
          </div>
          <EnergyGraphic />
        </Container>
      </section>
      <div className="model-page-nav">
        <Container>
          <nav aria-label="Model page sections">
            <a href="#model-gallery">Gallery</a>
            <a href="#model-overview">Overview</a>
            <a href="#model-specifications">Specifications</a>
            <Link to={enquiryUrl(product)}>
              Enquire now <ArrowUpRight size={14} />
            </Link>
          </nav>
        </Container>
      </div>
      <section id="model-gallery" className="model-page-gallery section-space">
        <Container>
          <div className="model-page-stage">
            <div className="model-page-photos">
              {product.images?.length ? (
                <ProductGallery key={product.id} product={product} />
              ) : (
                <div className="detail-visual">
                  <VehicleImage src={product.image} name={product.name} eager width={1400} />
                </div>
              )}
            </div>
            <aside className="model-page-glance" aria-label="Model at a glance">
              <span className="eyebrow">The details. Up close.</span>
              <h2>
                Made for
                <br />
                your next move.
              </h2>
              {metrics.length ? (
                <SpecificationHighlights product={product} />
              ) : (
                <p className="model-spec-pending">
                  Want to know more about this model's engineering? Our team can confirm the latest
                  technical specifications.
                </p>
              )}
              {product.colors.length > 0 && (
                <div className="model-page-colours">
                  <h3>Available colours</h3>
                  <ul>
                    {product.colors.map((colour) => (
                      <li key={colour}>{colour}</li>
                    ))}
                  </ul>
                </div>
              )}
              <a href={`tel:${siteConfig.phone}`} className="text-link">
                <Phone size={15} /> Talk to our team
              </a>
              <p className="model-gallery-note">
                Product photographs show the current catalog views. Contact our team to confirm
                available colours and model details.
              </p>
            </aside>
          </div>
        </Container>
      </section>
      <section id="model-overview" className="model-page-overview section-space">
        <Container>
          <div className="model-page-story">
            <div>
              <span className="eyebrow">01 / The idea behind the ride</span>
              <CampaignHeading lines={['Your world.', 'A new perspective.']} />
            </div>
            <div>
              <h2>Meet the {product.name}.</h2>
              <p>{product.description}</p>
              <Link to={enquiryUrl(product)} className="text-link">
                Find your next direction <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </Container>
      </section>
      <section id="model-specifications" className="model-page-specifications section-space">
        <Container>
          <div className="section-topline">
            <div>
              <span className="eyebrow">02 / Every detail matters</span>
              <CampaignHeading
                lines={['Built around', 'the details.']}
                className="section-title mt-4"
              />
            </div>
            <span className="model-spec-count">
              {specifications.length
                ? `${specifications.length} catalog specifications`
                : 'Let our team guide you'}
            </span>
          </div>
          {specifications.length ? (
            <dl className="model-page-spec-grid">
              {specifications.map((spec, index) => (
                <div key={`${spec.label}-${index}`}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <div className="model-page-spec-note">
              <h3>Get the information that matters to you.</h3>
              <p>
                Detailed technical specifications for this model are not yet published. Ask our team
                about battery options, range, charging and the features you need before choosing
                your ride.
              </p>
              <Link to={enquiryUrl(product)} className="cta">
                Ask about the {product.name} <ArrowUpRight size={16} />
              </Link>
            </div>
          )}
        </Container>
      </section>
      <section className="model-page-enquiry">
        <Container>
          <div>
            <span className="eyebrow">Your next chapter / {product.name}</span>
            <CampaignHeading lines={['Make the next', 'move yours.']} />
            <div className="model-actions">
              <Link to={enquiryUrl(product)} className="cta">
                Enquire about this model <ArrowUpRight size={17} />
              </Link>
              <a href={`tel:${siteConfig.phone}`} className="text-link">
                Call Energion <Phone size={15} />
              </a>
            </div>
          </div>
          <EnergyGraphic />
        </Container>
      </section>
      {related.length > 0 && (
        <section className="section-space model-page-related">
          <Container>
            <div className="section-topline">
              <div>
                <span className="eyebrow">Keep exploring</span>
                <h2 className="section-title mt-4">A different kind of energy.</h2>
              </div>
              <Link to="/products" className="text-link">
                View all models <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="grid auto-rows-fr gap-5 md:grid-cols-2 xl:grid-cols-3">
              {related.map((item) => (
                <ProductCard key={productUrl(item)} product={item} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </article>
  )
}
