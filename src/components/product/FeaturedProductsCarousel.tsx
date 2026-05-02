import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, BatteryCharging, ChevronLeft, ChevronRight, Gauge, ImageOff, Timer } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { cn } from '../../lib/cn'
import type { Product } from '../../types/product'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

interface FeaturedProductsCarouselProps {
  products: Product[]
  onOpen: (product: Product) => void
}

const AUTO_SLIDE_MS = 5600

export function FeaturedProductsCarousel({ products, onOpen }: FeaturedProductsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const safeProducts = useMemo(() => products.slice(0, 3), [products])

  useEffect(() => {
    if (safeProducts.length <= 1) {
      return
    }

    const interval = window.setInterval(() => {
      setDirection(1)
      setActiveIndex((current) => (current + 1) % safeProducts.length)
    }, AUTO_SLIDE_MS)

    return () => window.clearInterval(interval)
  }, [safeProducts.length])

  if (!safeProducts.length) {
    return null
  }

  const previousIndex = (activeIndex - 1 + safeProducts.length) % safeProducts.length
  const nextIndex = (activeIndex + 1) % safeProducts.length

  function goTo(index: number) {
    const normalizedIndex = (index + safeProducts.length) % safeProducts.length
    if (normalizedIndex === activeIndex) return

    const isPrevious = normalizedIndex === previousIndex
    setDirection(isPrevious ? -1 : 1)
    setActiveIndex(normalizedIndex)
  }

  const activeProduct = safeProducts[activeIndex]
  const previousProduct = safeProducts[previousIndex]
  const nextProduct = safeProducts[nextIndex]

  return (
    <div className="space-y-5">
      <div className="relative">
        <div className="relative hidden h-[37rem] items-center justify-center overflow-hidden lg:flex">
          <PreviewCard
            product={previousProduct}
            position="left"
            onClick={() => goTo(previousIndex)}
          />

          <div className="absolute inset-x-[15%] z-20">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeProduct.id}
                initial={{ x: direction > 0 ? 140 : -140, opacity: 0.4, scale: 0.96 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: direction > 0 ? -140 : 140, opacity: 0.4, scale: 0.96 }}
                transition={{ duration: 0.42, ease: 'easeInOut' }}
              >
                <MainCard product={activeProduct} onOpen={() => onOpen(activeProduct)} />
              </motion.div>
            </AnimatePresence>
          </div>

          <PreviewCard
            product={nextProduct}
            position="right"
            onClick={() => goTo(nextIndex)}
          />

          <button
            type="button"
            aria-label="Previous featured bike"
            onClick={() => goTo(activeIndex - 1)}
            className="absolute left-2 top-1/2 z-30 inline-flex -translate-y-1/2 rounded-full border border-[rgba(16,27,45,0.08)] bg-white/95 p-4 text-slate-900 shadow-[0_12px_24px_rgba(8,17,31,0.12)] transition hover:bg-white"
          >
            <ChevronLeft className="size-5" />
          </button>

          <button
            type="button"
            aria-label="Next featured bike"
            onClick={() => goTo(activeIndex + 1)}
            className="absolute right-2 top-1/2 z-30 inline-flex -translate-y-1/2 rounded-full border border-[rgba(16,27,45,0.08)] bg-white/95 p-4 text-slate-900 shadow-[0_12px_24px_rgba(8,17,31,0.12)] transition hover:bg-white"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <div className="lg:hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeProduct.id}
              initial={{ x: direction > 0 ? 60 : -60, opacity: 0.55 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction > 0 ? -60 : 60, opacity: 0.55 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <MainCard product={activeProduct} onOpen={() => onOpen(activeProduct)} compact />
            </motion.div>
          </AnimatePresence>

          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              aria-label="Previous featured bike"
              onClick={() => goTo(activeIndex - 1)}
              className="inline-flex rounded-full border border-[rgba(16,27,45,0.08)] bg-white p-3 text-slate-900 shadow-[0_10px_20px_rgba(8,17,31,0.1)]"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Next featured bike"
              onClick={() => goTo(activeIndex + 1)}
              className="inline-flex rounded-full border border-[rgba(16,27,45,0.08)] bg-white p-3 text-slate-900 shadow-[0_10px_20px_rgba(8,17,31,0.1)]"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        {safeProducts.map((product, index) => (
          <button
            key={product.id}
            type="button"
            aria-label={`Show ${product.name}`}
            onClick={() => goTo(index)}
            className={cn(
              'h-2.5 rounded-full transition-all duration-200',
              index === activeIndex ? 'w-10 bg-brand-gradient' : 'w-2.5 bg-slate-300 hover:bg-slate-400',
            )}
          />
        ))}
      </div>
    </div>
  )
}

function PreviewCard({
  product,
  position,
  onClick,
}: {
  product: Product
  position: 'left' | 'right'
  onClick: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={cn(
        'absolute top-10 z-10 h-[29rem] w-[24rem] overflow-hidden rounded-[2rem] border border-[rgba(16,27,45,0.08)] bg-white/80 text-left shadow-[0_18px_42px_rgba(8,17,31,0.08)]',
        position === 'left' ? 'left-0' : 'right-0',
      )}
      initial={false}
      animate={{
        x: position === 'left' ? 24 : -24,
        opacity: 0.45,
        scale: 0.9,
      }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      <div className="relative h-full overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(180deg,#f3f7ff_0%,#e4edff_55%,#d7e4ff_100%)] text-center">
            <div className="px-6 text-slate-700">
              <ImageOff className="mx-auto size-8 text-[var(--brand-start)]/70" />
              <div className="mt-3 text-sm font-semibold">{product.name}</div>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(15,23,42,0.5))]" />
        <div className="absolute left-5 top-5 flex flex-wrap gap-2">
          <Badge tone="gradient">{product.category}</Badge>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(15,23,42,0),rgba(15,23,42,0.82))] px-5 pb-5 pt-14">
          <div className="font-display text-2xl font-semibold text-white">{product.name}</div>
          <div className="mt-2 line-clamp-2 text-sm leading-7 text-slate-200">{product.shortDescription}</div>
        </div>
      </div>
    </motion.button>
  )
}

function MainCard({
  product,
  onOpen,
  compact = false,
}: {
  product: Product
  onOpen: () => void
  compact?: boolean
}) {
  return (
    <article className="overflow-hidden rounded-[2.35rem] border border-[rgba(16,27,45,0.08)] bg-white shadow-[0_28px_70px_rgba(8,17,31,0.14)]">
      <div className={cn('grid gap-0', compact ? 'lg:grid-cols-1' : 'xl:grid-cols-[0.92fr_1.08fr]')}>
        <div className={cn('relative overflow-hidden bg-slate-100', compact ? 'h-72 sm:h-80' : 'h-[28rem] xl:h-full')}>
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(180deg,#f3f7ff_0%,#e4edff_55%,#d7e4ff_100%)] text-center">
              <div className="px-6 text-slate-700">
                <ImageOff className="mx-auto size-10 text-[var(--brand-start)]/70" />
                <div className="mt-4 text-lg font-semibold">{product.name}</div>
                <div className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">Visual coming soon</div>
              </div>
            </div>
          )}
          <div className="absolute left-5 top-5 flex flex-wrap gap-2">
            <Badge tone="gradient">{product.category}</Badge>
            {product.tag ? <Badge>{product.tag}</Badge> : null}
          </div>
        </div>

        <div className="flex min-h-full flex-col bg-[linear-gradient(180deg,#ffffff_0%,#fbfcff_100%)] p-5 sm:p-6">
          <div className="min-w-0 max-w-[24rem]">
            <h3 className="font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {product.name}
            </h3>
            <p className="mt-3 min-h-[7.5rem] max-w-[23rem] text-sm leading-8 text-slate-600 sm:text-base">
              {product.shortDescription}
            </p>
            <div className="mt-4 inline-flex rounded-[1.9rem] bg-[linear-gradient(180deg,rgba(245,247,255,0.95),rgba(236,242,255,0.95))] px-5 py-4 text-left shadow-[inset_0_0_0_1px_rgba(49,94,230,0.06)]">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Starting</div>
                <div className="mt-2 text-2xl font-bold text-[var(--brand-start)] sm:text-[2rem]">
                  Tk {product.price.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Metric icon={BatteryCharging} label="Battery" value={product.battery} />
            <Metric icon={Gauge} label="Range" value={product.range} />
            <Metric icon={Gauge} label="Top Speed" value={product.topSpeed} />
            <Metric icon={Timer} label="Charge" value={product.chargingTime} />
          </div>

          <div className="mt-auto pt-4">
            <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="sm:flex-1" onClick={onOpen}>
              Details
              <ArrowRight className="ml-2 size-4" />
            </Button>
            <Link to="/products" className="sm:flex-1">
              <Button variant="secondary" fullWidth>
                View all bikes
              </Button>
            </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BatteryCharging
  label: string
  value: string
}) {
  return (
    <div className="flex min-h-[5.25rem] items-start gap-3 rounded-[1.4rem] border border-[rgba(16,27,45,0.06)] bg-slate-50/85 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55)]">
      <div className="mt-0.5 rounded-xl bg-[rgba(49,94,230,0.08)] p-2 text-[var(--brand-start)]">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</div>
        <div className="mt-2 break-words text-sm font-semibold leading-6 text-slate-900">{value}</div>
      </div>
    </div>
  )
}
