import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { productMetrics, type PublicProduct } from '../../lib/productPresentation'
import { VehicleImage } from '../product/VehicleImage'
import { Container } from '../ui/Container'
import { campaignEase } from '../../lib/campaignMotion'
import { EnergyGraphic } from './EnergyGraphic'
import { useDesktopMotion } from '../../lib/useDesktopMotion'

export function CampaignHero({ product }: { product?: PublicProduct }) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const desktopMotion = useDesktopMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 65])
  return (
    <section ref={ref} className="campaign-hero" aria-label="Ride electric with Energion">
      <motion.div
        className="hero-strike"
        aria-hidden="true"
        initial={reduced ? false : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, ease: campaignEase }}
      />
      <Container>
        <div className="campaign-hero-grid">
          <div className="campaign-hero-copy">
            <motion.span
              className="eyebrow"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              Energion E-Mobility / Bangladesh
            </motion.span>
            <h1 className="campaign-hero-title" aria-label="Ride electric.">
              {['Ride', 'electric.'].map((word, index) => (
                <span className="heading-mask" key={word} aria-hidden="true">
                  <motion.span
                    initial={reduced ? false : { y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{
                      duration: reduced ? 0 : 1,
                      delay: 0.15 + index * 0.12,
                      ease: campaignEase,
                    }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: reduced ? 0 : 0.7 }}
            >
              <p>
                New energy. Your next direction.
                <br />
                Electric mobility, the Energion way.
              </p>
              <div className="hero-actions">
                <Link to="/products" className="cta">
                  Explore our bikes <ArrowUpRight size={18} />
                </Link>
                <Link to="/contact" className="text-link">
                  Enquire now <ArrowUpRight size={16} />
                </Link>
              </div>
            </motion.div>
          </div>
          <motion.div className="campaign-hero-machine" style={{ y: desktopMotion ? y : 0 }}>
            <EnergyGraphic />
            <span className="machine-coordinate" aria-hidden="true">
              E / 01
              <br />
              ALL ELECTRIC
            </span>
            <motion.div
              className="machine-image"
              initial={reduced ? false : { opacity: 0, x: 90, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: reduced ? 0 : 1.2, delay: 0.3, ease: campaignEase }}
            >
              {product ? (
                <VehicleImage src={product.image} name={product.name} eager width={1400} />
              ) : (
                <span className="machine-awaiting">
                  ENERGION
                  <br />
                  E-MOBILITY
                </span>
              )}
            </motion.div>
            <div className="machine-caption">
              <span>IN THE SPOTLIGHT</span>
              <strong>{product?.name ?? 'Energion'}</strong>
              <span>100% ELECTRIC</span>
            </div>
          </motion.div>
        </div>
        <motion.div
          className="campaign-hero-bottom"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduced ? 0 : 1 }}
        >
          <a href="#lineup" className="hero-scroll">
            <ArrowDown size={16} />
            <span>
              Scroll to find
              <br />
              your energy
            </span>
          </a>
          <dl>
            {product &&
              productMetrics(product)
                .slice(0, 2)
                .map((metric) => (
                  <div key={metric.label}>
                    <dt>{metric.label}</dt>
                    <dd>{metric.value}</dd>
                  </div>
                ))}
          </dl>
          <span className="hero-edition">
            A DIFFERENT ENERGY.
            <br />A BETTER EVERYDAY.
          </span>
        </motion.div>
      </Container>
    </section>
  )
}
