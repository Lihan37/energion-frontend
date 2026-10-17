import { useQuery } from '@tanstack/react-query'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { CampaignHero } from '../components/campaign/CampaignHero'
import { CampaignHeading } from '../components/campaign/CampaignHeading'
import { EnergyGraphic } from '../components/campaign/EnergyGraphic'
import { KineticBand } from '../components/campaign/KineticBand'
import { RideStory } from '../components/campaign/RideStory'
import { FeaturedProductsCarousel } from '../components/product/FeaturedProductsCarousel'
import { VehicleImage } from '../components/product/VehicleImage'
import { EnquiryCTA } from '../components/shared/EnquiryCTA'
import { Container } from '../components/ui/Container'
import { CatalogState } from '../components/ui/CatalogState'
import { getProducts } from '../services/productService'
import { CampaignScenes } from '../components/campaign/CampaignScenes'
import { useDesktopMotion } from '../lib/useDesktopMotion'

export function HomePage() {
  const query = useQuery({ queryKey: ['products'], queryFn: getProducts })
  const products = query.data ?? []
  const featured = products.filter((item) => item.featured)
  const models = featured.length ? featured : products
  const hero =
    products.find((item) => item.slug === 'evox') ??
    models.find((item) => item.image) ??
    products[0]
  const story = products.find((item) => item.battery && item.range && item.specs.length) ?? hero
  const alternate =
    products.find((item) => item.slug === 'nexo') ??
    products.find((item) => item.id !== hero?.id) ??
    hero
  const manifesto = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const desktopMotion = useDesktopMotion()
  const { scrollYProgress } = useScroll({ target: manifesto, offset: ['start end', 'end start'] })
  const shift = useTransform(scrollYProgress, [0, 1], ['5%', '-5%'])
  return (
    <>
      <CampaignHero product={hero} />
      <KineticBand />
      <CampaignScenes collection="home" />
      <section id="lineup" className="campaign-lineup section-space">
        <Container>
          <div className="section-topline">
            <div>
              <span className="eyebrow">01 / Find your energy</span>
              <CampaignHeading
                lines={['Choose your', 'next direction.']}
                className="section-title mt-4"
              />
            </div>
            <Link to="/products" className="text-link">
              See the full lineup <ArrowUpRight size={17} />
            </Link>
          </div>
          {query.isPending || query.isError ? (
            <CatalogState error={query.isError} retry={() => void query.refetch()} />
          ) : models.length ? (
            <FeaturedProductsCarousel products={models} />
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
      {story && <RideStory product={story} />}
      <div className="campaign-transfer" aria-hidden="true">
        <motion.div
          initial={reduced ? false : { x: '-100%' }}
          whileInView={{ x: '0%' }}
          viewport={{ once: true }}
          transition={{ duration: reduced ? 0 : 1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <section ref={manifesto} className="brand-manifesto">
        <Container>
          <div className="manifesto-label">
            <span className="eyebrow">02 / A different mindset</span>
            <span>BANGLADESH. MOVING FORWARD.</span>
          </div>
          <motion.div
            className="manifesto-type"
            style={{ x: desktopMotion ? shift : 0 }}
            aria-hidden="true"
          >
            NOT JUST
            <br />
            <span>A RIDE.</span>
          </motion.div>
          <div className="manifesto-bottom">
            <div className="manifesto-machine">
              {alternate && (
                <VehicleImage src={alternate.image} name={alternate.name} width={900} />
              )}
              <EnergyGraphic />
            </div>
            <div>
              <CampaignHeading
                lines={['A new direction.', 'A clear purpose.']}
                className="section-title"
              />
              <p>
                Energion E-Mobility brings practical innovation and a long-term vision for cleaner
                transportation to everyday journeys in Bangladesh.
              </p>
              <Link to="/about" className="text-link">
                Get to know Energion <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </Container>
      </section>
      <section className="campaign-next section-space">
        <Container>
          <EnquiryCTA />
        </Container>
      </section>
    </>
  )
}
