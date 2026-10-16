import { useQuery } from '@tanstack/react-query'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FeaturedProductsCarousel } from '../components/product/FeaturedProductsCarousel'
import { ProductModal } from '../components/product/ProductModal'
import { VehicleImage } from '../components/product/VehicleImage'
import { EnquiryCTA } from '../components/shared/EnquiryCTA'
import { Container } from '../components/ui/Container'
import { CatalogState } from '../components/ui/CatalogState'
import { Reveal } from '../components/ui/Reveal'
import { getProducts } from '../services/productService'
import type { PublicProduct } from '../lib/productPresentation'

export function HomePage() {
  const [selected, setSelected] = useState<PublicProduct | null>(null)
  const query = useQuery({ queryKey: ['products'], queryFn: getProducts })
  const products = query.data ?? []
  const featured = products.filter((item) => item.featured)
  const models = featured.length ? featured : products
  const hero =
    products.find((item) => item.slug === 'evox') ??
    models.find((item) => item.image) ??
    products[0]
  const technology = products.find((item) => item.slug === 'xplorer') ?? hero
  const features =
    technology?.specs.filter((spec) =>
      ['Motor', 'Controller', 'Braking System'].includes(spec.label),
    ) ?? []
  const reduced = useReducedMotion()

  return (
    <>
      <section className="hero">
        <Container>
          <div className="hero-grid">
            <motion.div
              className="hero-copy"
              initial={{ opacity: 0, y: reduced ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="eyebrow">Energion E-Mobility / Bangladesh</span>
              <h1>
                The future
                <br />
                rides
                <br />
                <span>electric.</span>
              </h1>
              <p>
                A different energy. A better everyday.
                <br />
                Meet electric mobility, the Energion way.
              </p>
              <div className="hero-actions">
                <Link to="/products" className="cta">
                  Explore our bikes <ArrowUpRight size={17} />
                </Link>
                <Link to="/contact" className="cta cta-outline">
                  Enquire now
                </Link>
              </div>
            </motion.div>
            <motion.div
              className="hero-visual"
              initial={{ opacity: 0, x: reduced ? 0 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: reduced ? 0 : 1, delay: reduced ? 0 : 0.15 }}
            >
              {hero ? (
                <>
                  <VehicleImage src={hero.image} name={hero.name} eager width={1200} />
                  <div className="hero-model">
                    <small>Meet your next ride</small>
                    <strong>{hero.name}</strong>
                  </div>
                </>
              ) : (
                <div className="hero-model">
                  <small>Designed for a different tomorrow</small>
                  <strong>Energion E-Mobility</strong>
                </div>
              )}
            </motion.div>
          </div>
        </Container>
        <div className="hero-bottom">
          <Container>
            <div className="hero-bottom-inner">
              <span>All electric. All Energion.</span>
              <a href="#lineup">
                Discover the lineup <ArrowDown size={14} />
              </a>
              <span className="hero-index">01 / MOVE FORWARD</span>
            </div>
          </Container>
        </div>
      </section>
      <Container>
        <Reveal>
          <div className="intro-strip">
            <h2>
              Less noise.
              <br />
              More possibility.
            </h2>
            <p className="body-copy">
              From the daily commute to the road ahead, discover electric vehicles that put your
              journey first. Explore the lineup and find the Energion that fits your life.
            </p>
          </div>
        </Reveal>
      </Container>
      <section id="lineup" className="section-space">
        <Container>
          <Reveal>
            <div className="section-topline">
              <div>
                <span className="eyebrow">Find your energy</span>
                <h2 className="section-title">
                  Different rides.
                  <br />
                  One electric future.
                </h2>
              </div>
              <Link to="/products" className="text-link">
                See the full lineup <ArrowUpRight size={17} />
              </Link>
            </div>
          </Reveal>
          {query.isPending || query.isError ? (
            <CatalogState error={query.isError} retry={() => void query.refetch()} />
          ) : models.length ? (
            <FeaturedProductsCarousel products={models} onOpen={setSelected} />
          ) : (
            <div className="status-panel">
              <h2>Our next chapter is on its way.</h2>
              <Link to="/contact" className="text-link">
                Ask about our lineup
              </Link>
            </div>
          )}
        </Container>
      </section>
      <section className="section-dark section-space">
        <Container>
          <div className="technology-layout">
            <Reveal>
              <div className="technology-visual">
                <span className="eyebrow">
                  {technology ? technology.name : 'Energion'} / In focus
                </span>
                {technology && <VehicleImage src={technology.image} name={technology.name} />}
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <span className="eyebrow">The details make the difference</span>
              <h2 className="section-title mt-5">
                Electric at heart.
                <br />
                Ready for real life.
              </h2>
              <p className="body-copy mt-6">
                Get to know the technology behind your ride. Explore the specifications, compare
                your options and choose with confidence.
              </p>
              <div className="feature-list">
                {features.map((spec, index) => (
                  <div key={spec.label} className="feature-row">
                    <small>0{index + 1}</small>
                    <div className="flex-1">
                      <h3>{spec.label}</h3>
                      <p>{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              {technology && (
                <button className="text-link mt-4" onClick={() => setSelected(technology)}>
                  Inside the {technology.name} <ArrowUpRight size={16} />
                </button>
              )}
            </Reveal>
          </div>
        </Container>
      </section>
      <section className="section-space">
        <Container>
          <Reveal>
            <div className="brand-story">
              <div>
                <span className="eyebrow">The Energion story</span>
                <h2 className="section-title mt-5">
                  A new direction.
                  <br />A clear purpose.
                </h2>
              </div>
              <div>
                <p>
                  Energion E-Mobility is committed to transforming transportation with reliable
                  electric vehicles. Our mission is to make cleaner mobility an accessible part of
                  everyday life.
                </p>
                <p>
                  We bring together practical innovation, customer focus and a long-term vision for
                  more sustainable transportation in Bangladesh.
                </p>
                <Link to="/about" className="text-link mt-6">
                  Get to know Energion <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <EnquiryCTA />
          </Reveal>
        </Container>
      </section>
      <ProductModal
        product={selected}
        isOpen={Boolean(selected)}
        onClose={() => setSelected(null)}
      />
    </>
  )
}
