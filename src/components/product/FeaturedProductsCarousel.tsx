import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { enquiryUrl, type PublicProduct } from '../../lib/productPresentation'
import { SpecificationHighlights } from './SpecificationHighlights'
import { VehicleImage } from './VehicleImage'

interface Props {
  products: PublicProduct[]
  onOpen: (product: PublicProduct) => void
}

export function FeaturedProductsCarousel({ products, onOpen }: Props) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const reduced = useReducedMotion()
  const id = useId()
  const touchStart = useRef<number | null>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const activeIndex = index % Math.max(products.length, 1)
  const product = products[activeIndex]

  useEffect(() => {
    if (!playing || hovered || focused || reduced || products.length < 2) return
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex((value) => (value + 1) % products.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [playing, hovered, focused, reduced, products.length])

  useEffect(() => {
    const container = tabsRef.current
    const tab = container?.querySelector<HTMLElement>('[aria-selected="true"]')
    if (!container || !tab) return
    container.scrollTo({
      left:
        container.scrollLeft +
        tab.getBoundingClientRect().left -
        container.getBoundingClientRect().left -
        container.clientWidth / 2 +
        tab.clientWidth / 2,
      behavior: reduced ? 'instant' : 'smooth',
    })
  }, [activeIndex, reduced])

  function go(next: number) {
    setIndex((next + products.length) % products.length)
  }
  if (!product) return null
  return (
    <section
      className="model-showcase"
      aria-label="Featured electric vehicles"
      aria-roledescription="carousel"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
      }}
    >
      <div ref={tabsRef} className="model-tabs" role="tablist" aria-label="Select a model">
        {products.map((item, position) => (
          <button
            role="tab"
            id={`${id}-tab-${position}`}
            aria-controls={`${id}-panel`}
            aria-selected={position === activeIndex}
            tabIndex={position === activeIndex ? 0 : -1}
            key={item.id}
            onClick={() => go(position)}
            onKeyDown={(event) => {
              let next = position
              if (event.key === 'ArrowRight') next = (position + 1) % products.length
              else if (event.key === 'ArrowLeft')
                next = (position - 1 + products.length) % products.length
              else if (event.key === 'Home') next = 0
              else if (event.key === 'End') next = products.length - 1
              else return
              event.preventDefault()
              go(next)
              document.getElementById(`${id}-tab-${next}`)?.focus()
            }}
          >
            {item.name}
          </button>
        ))}
      </div>
      <div
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${activeIndex}`}
        onTouchStart={(event) => {
          touchStart.current = event.touches[0].clientX
        }}
        onTouchEnd={(event) => {
          if (touchStart.current !== null) {
            const distance = touchStart.current - event.changedTouches[0].clientX
            if (Math.abs(distance) > 50) go(activeIndex + (distance > 0 ? 1 : -1))
            touchStart.current = null
          }
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={product.id}
            className="model-stage"
            initial={{ opacity: 0, x: reduced ? 0 : 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduced ? 0 : -24 }}
            transition={{ duration: reduced ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="model-image">
              <span className="model-watermark" aria-hidden="true">
                {product.name}
              </span>
              <VehicleImage src={product.image} name={product.name} />
            </div>
            <div className="model-copy">
              <span className="eyebrow">{product.category} / Electric mobility</span>
              <h3>{product.name}</h3>
              <p className="body-copy">{product.shortDescription}</p>
              <SpecificationHighlights product={product} />
              <div className="model-actions">
                <button className="cta" onClick={() => onOpen(product)}>
                  Explore model <ArrowUpRight size={17} />
                </button>
                <Link to={enquiryUrl(product)} className="cta cta-outline">
                  Enquire now
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="model-controls">
        <span>
          {String(activeIndex + 1).padStart(2, '0')} / {String(products.length).padStart(2, '0')}{' '}
          &nbsp; YOUR RIDE. YOUR CHOICE.
        </span>
        <div>
          {!reduced && products.length > 1 && (
            <button
              className="icon-button"
              aria-label={playing ? 'Pause model slideshow' : 'Play model slideshow'}
              onClick={() => setPlaying((value) => !value)}
            >
              {playing ? <Pause size={15} /> : <Play size={15} />}
            </button>
          )}
          <button
            className="icon-button"
            aria-label="Previous model"
            onClick={() => go(activeIndex - 1)}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className="icon-button"
            aria-label="Next model"
            onClick={() => go(activeIndex + 1)}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}
