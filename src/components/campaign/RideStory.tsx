import { motion, useReducedMotion, useScroll } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { enquiryUrl, productUrl, type PublicProduct } from '../../lib/productPresentation'
import { Container } from '../ui/Container'
import { VehicleImage } from '../product/VehicleImage'
import { CampaignHeading } from './CampaignHeading'

export function RideStory({ product }: { product: PublicProduct }) {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()
  const photo =
    active > 0 && product.images?.length
      ? product.images[active % product.images.length]
      : undefined
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start center', 'end center'] })
  const performance = product.specs.filter((spec) =>
    ['Motor', 'Braking System', 'Controller'].includes(spec.label),
  )
  const chapters = [
    {
      title: 'Meet your next move.',
      label: 'THE MODEL',
      copy: product.shortDescription,
      facts: [
        { label: 'Model', value: product.name },
        { label: 'Category', value: product.category },
      ],
    },
    {
      title: 'The road. Reconsidered.',
      label: 'THE ENGINEERING',
      copy: 'Get closer to the engineering behind this model. These are the specifications in our current catalog.',
      facts: [
        ...(product.topSpeed ? [{ label: 'Top speed', value: product.topSpeed }] : []),
        ...performance,
      ].slice(0, 3),
    },
    {
      title: 'A different kind of energy.',
      label: 'THE ELECTRIC HEART',
      copy: 'Explore the battery and charging details before you choose your ride. Our team can help you understand what suits your daily journey.',
      facts: [
        { label: 'Battery', value: product.battery },
        { label: 'Range', value: product.range },
        { label: 'Charging time', value: product.chargingTime },
      ].filter((fact) => fact.value),
    },
    {
      title: 'Make the next move yours.',
      label: 'YOUR NEXT CHAPTER',
      copy: 'See the complete model details, explore the available colours, or start a conversation with Energion.',
      facts: [],
    },
  ]
  return (
    <section ref={ref} className="ride-story" aria-label={`${product.name} in focus`}>
      <Container>
        <div className="story-heading">
          <span className="eyebrow">Beneath the surface / {product.name}</span>
          <CampaignHeading lines={['A closer look.', 'A new perspective.']} />
        </div>
        <div className="story-layout">
          <div className="story-sticky">
            <div className="story-visual">
              <span className="story-model-stencil" aria-hidden="true">
                {product.name}
              </span>
              <div className="story-crosshair" aria-hidden="true" />
              <motion.div
                className="story-machine-view"
                key={photo?.url ?? product.image}
                initial={reduced ? false : { opacity: 0.6 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reduced ? 0 : 0.4 }}
              >
                <VehicleImage
                  src={photo?.url ?? product.image}
                  alt={photo?.alt}
                  name={product.name}
                  width={1100}
                />
              </motion.div>
              <div className="story-visual-label">
                <span>
                  {product.category} / {product.name}
                </span>
                <span>0{active + 1} / 04</span>
              </div>
            </div>
            <nav className="story-chapter-nav" aria-label="Model story chapters">
              {chapters.map((chapter, index) => (
                <a
                  key={chapter.label}
                  href={`#story-${index}`}
                  aria-current={active === index ? 'step' : undefined}
                >
                  <span>0{index + 1}</span>
                  {chapter.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="story-chapters">
            <motion.div
              className="story-progress"
              aria-hidden="true"
              style={{ scaleY: reduced ? 1 : scrollYProgress }}
            />
            {chapters.map((chapter, index) => (
              <motion.article
                id={`story-${index}`}
                className="story-chapter"
                data-active={active === index}
                key={chapter.label}
                onViewportEnter={() => setActive(index)}
                viewport={{ amount: 0.55 }}
              >
                <span className="chapter-number" aria-hidden="true">
                  0{index + 1}
                </span>
                <span className="eyebrow">{chapter.label}</span>
                <CampaignHeading lines={[chapter.title]} as="h3" />
                <p>{chapter.copy}</p>
                {chapter.facts.length > 0 && (
                  <dl className="story-facts">
                    {chapter.facts.map((fact) => (
                      <div key={fact.label}>
                        <dt>{fact.label}</dt>
                        <dd>{fact.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {index === chapters.length - 1 && (
                  <div className="model-actions">
                    <Link className="cta" to={productUrl(product)}>
                      Inside the {product.name} <ArrowUpRight size={16} />
                    </Link>
                    <Link className="text-link" to={enquiryUrl(product)}>
                      Enquire now <ArrowUpRight size={16} />
                    </Link>
                  </div>
                )}
              </motion.article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
