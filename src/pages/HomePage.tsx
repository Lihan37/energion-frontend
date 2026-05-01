import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowRight, BatteryCharging, Bike, Gauge, ShieldCheck, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ProductCard } from '../components/product/ProductCard'
import { ProductModal } from '../components/product/ProductModal'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { LoadingState } from '../components/ui/LoadingState'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { getProducts } from '../services/productService'
import type { Product } from '../types/product'
import { useEffect, useState } from 'react'

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

export function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [headlineAnimationKey, setHeadlineAnimationKey] = useState(0)
  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    select: (items) => items.filter((item) => item.featured).slice(0, 3),
  })

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
          <img
            src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=2000&q=80"
            alt="Energion electric bike"
            className="h-180 w-full object-cover object-center sm:h-190 lg:h-195"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,17,31,0.72)_0%,rgba(8,17,31,0.6)_28%,rgba(8,17,31,0.54)_55%,rgba(8,17,31,0.58)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,17,31,0.38)_0%,rgba(8,17,31,0.58)_100%)]" />

          <div className="absolute inset-0">
            <Container className="h-full px-6 sm:px-8 lg:px-12">
              <div className="flex h-full flex-col items-center justify-center gap-10 py-8 text-center lg:py-12">
                <div className="flex max-w-4xl flex-col items-center space-y-8">
                  <Badge tone="gradient">Future-ready electric mobility</Badge>
                  <div className="space-y-5">
                    <h1
                      key={headlineAnimationKey}
                      className="max-w-4xl font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl"
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
                    <p className="mx-auto max-w-3xl text-xl leading-9 text-slate-200 sm:text-2xl">
                      Energion E-Mobility creates premium e-bikes that feel precise, modern, and deeply practical for daily commuting.
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-3 sm:flex-row">
                    <Link to="/products">
                      <Button className="w-full sm:w-auto">
                        Explore Products
                        <ArrowRight className="ml-2 size-4" />
                      </Button>
                    </Link>
                    <Link to="/contact">
                      <Button
                        variant="secondary"
                        className="w-full border-white/20 bg-white/10 text-white hover:bg-white/16 sm:w-auto"
                      >
                        Book a Test Ride
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="flex w-full max-w-6xl flex-col items-center gap-4">
                  <div className="grid w-full max-w-4xl gap-3 sm:grid-cols-3">
                    {highlights.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-3xl border border-white/12 bg-white/10 p-4 backdrop-blur-md"
                      >
                        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                          {item.label}
                        </div>
                        <div className="mt-2 font-display text-2xl font-semibold text-white">{item.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="w-full max-w-3xl rounded-[1.75rem] border border-white/12 bg-slate-950/55 p-5 text-center backdrop-blur-md">
                    <div className="flex items-center justify-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-(--brand-end)">
                      <Zap className="size-4" />
                      Signature performance
                    </div>
                    <div className="mt-3 grid gap-4 sm:grid-cols-2">
                      <div>
                        <div className="text-sm text-slate-300">Intelligent power delivery</div>
                        <div className="mt-1 text-lg font-semibold text-white">Smooth assist in every mode</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-300">City-first range</div>
                        <div className="mt-1 text-lg font-semibold text-white">Up to 130 km per charge</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </section>

      <section className="pt-24">
        <Container className="space-y-10">
          <SectionHeading
            eyebrow="Featured Bikes"
            title="A premium lineup for commuting, performance, and practical daily utility."
            description="Three product families shaped around modern riders, with confident styling and real-world usability."
            action={
              <Link to="/products">
                <Button variant="secondary">View all bikes</Button>
              </Link>
            }
          />
          {productsQuery.isLoading ? (
            <LoadingState label="Loading featured bikes..." />
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              {productsQuery.data?.map((product) => (
                <ProductCard key={product.id} product={product} onOpen={setSelectedProduct} />
              ))}
            </div>
          )}
        </Container>
      </section>

      <section className="pt-24">
        <Container className="space-y-10">
          <SectionHeading
            eyebrow="Why Energion"
            title="Built to look premium, ride smoothly, and make everyday travel more efficient."
            description="Every design decision balances performance, usability, and long-term ownership confidence."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {reasons.map((reason) => (
              <article
                key={reason.title}
                className="surface-card rounded-4xl border border-[rgba(16,27,45,0.08)] p-6 shadow-(--shadow-card)"
              >
                <div className="inline-flex rounded-2xl bg-brand-gradient p-3 text-white">
                  <reason.icon className="size-5" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold text-slate-950">{reason.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{reason.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="pt-24">
        <Container className="space-y-10">
          <Reveal>
            <SectionHeading
              eyebrow="Mission & Vision"
              title="A clear purpose behind every Energion vehicle and every decision around the brand."
              description="These statements come directly from the company direction in your document, now presented as a stronger homepage section."
            />
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-2">
            {missionVision.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.08}>
                <article
                  className="rounded-[2.3rem] border border-slate-950 bg-slate-950 p-7 text-white shadow-(--shadow-card) sm:p-8"
                >
                  <Badge tone="gradient">{item.title}</Badge>
                  <h3 className="mt-6 font-display text-3xl font-semibold tracking-tight">
                    {item.title === 'Mission'
                      ? 'Reliable EV mobility for real everyday needs.'
                      : 'A future where sustainable transport is accessible to everyone.'}
                  </h3>
                  <p className="mt-4 text-base leading-8 text-slate-300">{item.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="pt-24">
        <Container>
          <div className="grid gap-8 rounded-[2.4rem] bg-slate-950 px-6 py-10 text-white sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:px-12">
            <div className="space-y-6">
              <Badge tone="gradient">Performance Highlights</Badge>
              <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                Engineered for quick response, quiet confidence, and long-range city rhythm.
              </h2>
              <p className="max-w-xl text-base leading-8 text-slate-300">
                Energion bikes combine battery efficiency, modern security, and clean industrial design so riders feel the upgrade from the first kilometer.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: Gauge, title: 'Top-end response', value: 'Up to 50 km/h' },
                { icon: BatteryCharging, title: 'Charging efficiency', value: 'Fast turnaround' },
                { icon: Zap, title: 'Ride assist modes', value: 'Adaptive delivery' },
              ].map((item) => (
                <div key={item.title} className="rounded-[1.6rem] border border-white/10 bg-white/6 p-5 backdrop-blur">
                  <item.icon className="size-6 text-(--brand-end)" />
                  <div className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">{item.title}</div>
                  <div className="mt-2 font-display text-2xl font-semibold">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="pt-24">
        <Container>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-[rgba(16,27,45,0.08)] bg-white px-6 py-10 shadow-(--shadow-soft) sm:px-8 lg:px-12">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[rgba(151,204,164,0.24)] blur-3xl" />
            <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[rgba(49,94,230,0.18)] blur-3xl" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <Badge>Ready to Ride</Badge>
                <h2 className="mt-5 font-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                  Book a consultation and find the Energion bike that fits your route.
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  Whether you ride for work, utility, or speed, our team can guide you through range, charging, and model selection.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="/contact">
                  <Button>Contact Sales</Button>
                </Link>
                <Link to="/map">
                  <Button variant="secondary">Find a Dealer</Button>
                </Link>
              </div>
            </div>
          </div>
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
