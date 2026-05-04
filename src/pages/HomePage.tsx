import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { ArrowRight, BatteryCharging, Bike, Gauge, ShieldCheck, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { FeaturedProductsCarousel } from '../components/product/FeaturedProductsCarousel'
import { ProductModal } from '../components/product/ProductModal'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { LoadingState } from '../components/ui/LoadingState'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { getProducts } from '../services/productService'
import type { Product } from '../types/product'

const highlights = [
  { label: 'Peak Torque', value: '88 Nm' },
  { label: 'Fast Charge', value: '3.8 hrs' },
  { label: 'Connected Security', value: 'NFC + GPS' },
]

const reasons = [
  {
    title: 'Premium ride engineering',
    description: 'Every frame is tuned for smooth acceleration, stable control, and a more composed city ride.',
    icon: Bike,
  },
  {
    title: 'Battery confidence',
    description: 'Long-range battery systems built for daily reliability, efficient charging, and lower operating cost.',
    icon: BatteryCharging,
  },
  {
    title: 'Smarter protection',
    description: 'Digital security, lighting, and connected alerts designed to protect the bike beyond the showroom.',
    icon: ShieldCheck,
  },
]

const missionVision = [
  {
    title: 'Mission',
    description:
      'To deliver high-quality electric vehicles that reduce emissions and meet everyday mobility needs through innovation and strong customer focus.',
  },
  {
    title: 'Vision',
    description:
      'To lead the transition to sustainable transportation by making electric mobility accessible, reliable, and environmentally responsible for everyone.',
  },
]

const heroHeadlineWords = 'Electric bikes built for a faster city and a cleaner tomorrow.'.split(' ')
const smoothEase = [0.16, 1, 0.3, 1] as const

const heroContentVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.18,
    },
  },
}

const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: 34, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.72, ease: smoothEase },
  },
}

const heroCardVariants: Variants = {
  hidden: { opacity: 0, y: 42, scale: 0.9, filter: 'blur(12px)' },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.72,
      delay: 0.9 + index * 0.13,
      ease: smoothEase,
    },
  }),
}

export function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [headlineAnimationKey, setHeadlineAnimationKey] = useState(0)
  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    select: (items) => items.filter((item) => item.featured).slice(0, 3),
  })

  const featuredProducts = productsQuery.data ?? []
  const featuredNames = featuredProducts.map((product) => product.name).join(', ')
  const featuredSummary = featuredProducts.length
    ? `Live from the catalog: ${featuredNames}. Key details like battery, range, top speed, charging time, and pricing now come directly from the database.`
    : 'Live product data from the catalog will appear here as soon as featured models are available.'

  useEffect(() => {
    const interval = window.setInterval(() => {
      setHeadlineAnimationKey((current) => current + 1)
    }, 5200)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="pb-16">
      <section className="relative overflow-hidden">
        <div className="relative overflow-hidden border-y border-white/30 shadow-(--shadow-soft)">
          <motion.img
            src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=2000&q=80"
            alt="Energion electric bike"
            className="h-[64rem] w-full object-cover object-center sm:h-[58rem] md:h-[54rem] lg:h-195"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,17,31,0.72)_0%,rgba(8,17,31,0.6)_28%,rgba(8,17,31,0.54)_55%,rgba(8,17,31,0.58)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,17,31,0.38)_0%,rgba(8,17,31,0.58)_100%)]" />

          <div className="absolute inset-0">
            <Container className="h-full px-6 sm:px-8 lg:px-12">
              <div className="flex h-full flex-col items-center justify-start gap-7 py-8 text-center sm:gap-8 md:justify-center lg:gap-10 lg:py-12">
                <motion.div
                  className="flex max-w-4xl flex-col items-center space-y-6 sm:space-y-7 lg:space-y-8"
                  variants={heroContentVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div variants={heroItemVariants}>
                    <Badge tone="gradient">Future-ready electric mobility</Badge>
                  </motion.div>
                  <motion.div className="space-y-5" variants={heroItemVariants}>
                    <h1
                      key={headlineAnimationKey}
                      className="max-w-4xl font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl"
                    >
                      {heroHeadlineWords.map((word, index) => (
                        <motion.span
                          key={`${headlineAnimationKey}-${word}-${index}`}
                          className="mr-[0.28em] inline-block last:mr-0"
                          initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
                          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                          transition={{
                            duration: 0.42,
                            delay: index * 0.08,
                            ease: 'easeOut',
                          }}
                        >
                          {word}
                        </motion.span>
                      ))}
                    </h1>
                    <p className="mx-auto max-w-3xl text-lg leading-8 text-slate-200 sm:text-2xl sm:leading-9">
                      Energion E-Mobility creates premium e-bikes that feel precise, modern, and deeply practical for daily commuting.
                    </p>
                  </motion.div>
                  <motion.div className="flex flex-row flex-wrap items-center justify-center gap-2.5 sm:gap-3" variants={heroItemVariants}>
                    <motion.div whileHover={{ y: -4, scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Link to="/products">
                        <Button className="px-4 py-3 text-sm sm:w-auto sm:px-5">
                          Explore Products
                          <ArrowRight className="ml-2 size-4" />
                        </Button>
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ y: -4, scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Link to="/contact">
                        <Button
                          variant="secondary"
                          className="border-white/20 bg-white/10 px-4 py-3 text-sm text-white hover:bg-white/16 sm:w-auto sm:px-5"
                        >
                          Book a Test Ride
                        </Button>
                      </Link>
                    </motion.div>
                  </motion.div>
                </motion.div>

                <div className="flex w-full max-w-6xl flex-col items-center gap-2.5 sm:gap-4">
                  <div className="grid w-full max-w-4xl gap-2.5 sm:grid-cols-3 sm:gap-3">
                    {highlights.map((item, index) => (
                      <motion.div
                        key={item.label}
                        className="rounded-2xl border border-white/12 bg-white/10 px-4 py-3 backdrop-blur-md sm:rounded-3xl sm:p-4"
                        custom={index}
                        variants={heroCardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ y: -8, scale: 1.04, backgroundColor: 'rgba(255,255,255,0.16)' }}
                      >
                        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300 sm:text-xs sm:tracking-[0.22em]">
                          {item.label}
                        </div>
                        <div className="mt-1.5 font-display text-xl font-semibold text-white sm:mt-2 sm:text-2xl">{item.value}</div>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    className="w-full max-w-3xl rounded-2xl border border-white/12 bg-slate-950/55 p-3.5 text-center backdrop-blur-md sm:rounded-[1.75rem] sm:p-5"
                    initial={{ opacity: 0, y: 48, scale: 0.94, filter: 'blur(14px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 0.82, delay: 1.32, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    <div className="flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-(--brand-end) sm:gap-3 sm:text-sm sm:tracking-[0.2em]">
                      <motion.span
                        animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.16, 1] }}
                        transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.4 }}
                      >
                        <Zap className="size-4" />
                      </motion.span>
                      Signature performance
                    </div>
                    <div className="mt-2 grid gap-2 sm:mt-3 sm:grid-cols-2 sm:gap-4">
                      <div>
                        <div className="text-xs text-slate-300 sm:text-sm">Intelligent power delivery</div>
                        <div className="mt-1 text-sm font-semibold text-white sm:text-lg">Smooth assist in every mode</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-300 sm:text-sm">City-first range</div>
                        <div className="mt-1 text-sm font-semibold text-white sm:text-lg">Up to 130 km per charge</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </section>

      <section className="pt-24">
        <Container className="space-y-10">
          <Reveal direction="left" x={96}>
            <SectionHeading
              eyebrow="Featured Bikes"
              title="Live Energion models with the specs riders actually compare first."
              description={featuredSummary}
              action={
                <motion.div whileHover={{ x: 4, scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/products">
                    <Button variant="secondary">View all bikes</Button>
                  </Link>
                </motion.div>
              }
            />
          </Reveal>
          {productsQuery.isLoading ? (
            <Reveal direction="scale">
              <LoadingState label="Loading featured bikes..." />
            </Reveal>
          ) : featuredProducts.length === 0 ? (
            <Reveal direction="right" x={96}>
              <div className="rounded-[2rem] border border-dashed border-[rgba(16,27,45,0.12)] bg-white/80 px-6 py-14 text-center">
                <h3 className="font-display text-2xl font-semibold text-slate-950">No featured products yet</h3>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                  Add or mark products as featured from the admin dashboard and they will appear here automatically.
                </p>
              </div>
            </Reveal>
          ) : (
            <Reveal direction="scale" y={64} amount={0.16}>
              <FeaturedProductsCarousel products={featuredProducts} onOpen={setSelectedProduct} />
            </Reveal>
          )}
        </Container>
      </section>

      <section className="pt-24">
        <Container className="space-y-10">
          <Reveal direction="right" x={96}>
            <SectionHeading
              eyebrow="Why Energion"
              title="Built to look premium, ride smoothly, and make everyday travel more efficient."
              description="Every design decision balances performance, usability, and long-term ownership confidence."
            />
          </Reveal>
          <div className="grid gap-6 lg:grid-cols-3">
            {reasons.map((reason, index) => (
              <Reveal
                key={reason.title}
                direction={index % 2 === 0 ? 'left' : 'up'}
                delay={index * 0.1}
                x={92}
              >
                <motion.article
                  className="surface-card h-full rounded-4xl border border-[rgba(16,27,45,0.08)] p-6 shadow-(--shadow-card)"
                  whileHover={{ y: -12, scale: 1.03, rotate: index === 1 ? 0 : index === 0 ? -1 : 1 }}
                  transition={{ duration: 0.24 }}
                >
                  <motion.div
                    className="inline-flex rounded-2xl bg-brand-gradient p-3 text-white"
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.12 }}
                  >
                    <reason.icon className="size-5" />
                  </motion.div>
                  <h3 className="mt-5 font-display text-2xl font-semibold text-slate-950">{reason.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{reason.description}</p>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="pt-24">
        <Container className="space-y-10">
          <Reveal direction="left" x={96}>
            <SectionHeading
              eyebrow="Mission & Vision"
              title="A clear purpose behind every Energion vehicle and every decision around the brand."
              description="These statements come directly from the company direction in your document, now presented as a stronger homepage section."
            />
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-2">
            {missionVision.map((item, index) => (
              <Reveal key={item.title} direction={index === 0 ? 'right' : 'left'} delay={index * 0.12} x={112}>
                <motion.article
                  className="h-full rounded-[2.3rem] border border-slate-950 bg-slate-950 p-7 text-white shadow-(--shadow-card) sm:p-8"
                  whileHover={{ y: -10, scale: 1.025 }}
                >
                  <Badge tone="gradient">{item.title}</Badge>
                  <h3 className="mt-6 font-display text-3xl font-semibold tracking-tight">
                    {item.title === 'Mission'
                      ? 'Reliable EV mobility for real everyday needs.'
                      : 'A future where sustainable transport is accessible to everyone.'}
                  </h3>
                  <p className="mt-4 text-base leading-8 text-slate-300">{item.description}</p>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="pt-24">
        <Container>
          <Reveal direction="scale" amount={0.18}>
            <motion.div
              className="grid gap-8 rounded-[2.4rem] bg-slate-950 px-6 py-10 text-white sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:px-12"
              whileInView={{ boxShadow: '0 34px 90px rgba(8, 17, 31, 0.22)' }}
              viewport={{ once: true, amount: 0.25 }}
            >
              <Reveal direction="right" delay={0.12} x={84}>
                <div className="space-y-6">
                  <Badge tone="gradient">Performance Highlights</Badge>
                  <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                    Engineered for quick response, quiet confidence, and long-range city rhythm.
                  </h2>
                  <p className="max-w-xl text-base leading-8 text-slate-300">
                    Energion bikes combine battery efficiency, modern security, and clean industrial design so riders feel the upgrade from the first kilometer.
                  </p>
                </div>
              </Reveal>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { icon: Gauge, title: 'Top-end response', value: 'Up to 50 km/h' },
                  { icon: BatteryCharging, title: 'Charging efficiency', value: 'Fast turnaround' },
                  { icon: Zap, title: 'Ride assist modes', value: 'Adaptive delivery' },
                ].map((item, index) => (
                  <Reveal key={item.title} direction="left" delay={0.18 + index * 0.1} x={74}>
                    <motion.div
                      className="h-full rounded-[1.6rem] border border-white/10 bg-white/6 p-5 backdrop-blur"
                      whileHover={{ y: -10, scale: 1.04, backgroundColor: 'rgba(255,255,255,0.1)' }}
                    >
                      <motion.span
                        className="inline-flex text-(--brand-end)"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2.1, repeat: Infinity, delay: index * 0.25 }}
                      >
                        <item.icon className="size-6" />
                      </motion.span>
                      <div className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {item.title}
                      </div>
                      <div className="mt-2 font-display text-2xl font-semibold">{item.value}</div>
                    </motion.div>
                  </Reveal>
                ))}
              </div>
            </motion.div>
          </Reveal>
        </Container>
      </section>

      <section className="pt-24">
        <Container>
          <Reveal direction="up" y={72} amount={0.2}>
            <motion.div
              className="relative overflow-hidden rounded-[2.5rem] border border-[rgba(16,27,45,0.08)] bg-white px-6 py-10 shadow-(--shadow-soft) sm:px-8 lg:px-12"
              whileHover={{ y: -8, scale: 1.01 }}
            >
              <motion.div
                className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[rgba(151,204,164,0.24)] blur-3xl"
                animate={{ x: [0, -28, 0], y: [0, 22, 0], scale: [1, 1.16, 1] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[rgba(49,94,230,0.18)] blur-3xl"
                animate={{ x: [0, 30, 0], y: [0, -24, 0], scale: [1, 1.12, 1] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <Reveal direction="right" delay={0.12} x={82}>
                  <div className="max-w-2xl">
                    <Badge>Ready to Ride</Badge>
                    <h2 className="mt-5 font-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                      Book a consultation and find the Energion bike that fits your route.
                    </h2>
                    <p className="mt-4 text-base leading-8 text-slate-600">
                      Whether you ride for work, utility, or speed, our team can guide you through range, charging, and model selection.
                    </p>
                  </div>
                </Reveal>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Reveal direction="left" delay={0.24} x={56}>
                    <motion.div whileHover={{ y: -4, scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                      <Link to="/contact">
                        <Button>Contact Sales</Button>
                      </Link>
                    </motion.div>
                  </Reveal>
                  <Reveal direction="left" delay={0.34} x={56}>
                    <motion.div whileHover={{ y: -4, scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                      <Link to="/map">
                        <Button variant="secondary">Find a Dealer</Button>
                      </Link>
                    </motion.div>
                  </Reveal>
                </div>
              </div>
            </motion.div>
          </Reveal>
        </Container>
      </section>

      <ProductModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  )
}
