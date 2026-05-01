import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Building2,
  Compass,
  Navigation,
  Phone,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Badge } from '../components/ui/Badge'
import { Container } from '../components/ui/Container'
import { LoadingState } from '../components/ui/LoadingState'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { getDealers } from '../services/dealerService'

export function MapPage() {
  const dealersQuery = useQuery({ queryKey: ['dealers'], queryFn: getDealers })
  const dealers = dealersQuery.data ?? []

  const groupedDealers = useMemo(
    () =>
      dealers.reduce<Record<string, typeof dealers>>((acc, dealer) => {
        if (!acc[dealer.region]) acc[dealer.region] = []
        acc[dealer.region].push(dealer)
        return acc
      }, {}),
    [dealers],
  )

  const regionEntries = Object.entries(groupedDealers)
  const [activeRegion, setActiveRegion] = useState<string>('')

  useEffect(() => {
    if (!activeRegion && regionEntries.length) {
      setActiveRegion(regionEntries[0][0])
    }
  }, [activeRegion, regionEntries])

  const activeDealers = groupedDealers[activeRegion] ?? []

  return (
    <div className="pb-16 pt-8">
      <Container className="space-y-12">
        <Reveal>
          <SectionHeading
            eyebrow="Dealer Finder"
            title="Find Energion dealer points by region across Bangladesh."
            align="center"
          />
        </Reveal>

        {dealersQuery.isLoading ? (
          <LoadingState label="Loading dealer points..." />
        ) : (
          <Reveal>
            <section className="relative overflow-hidden rounded-[2.7rem] border border-[rgba(16,27,45,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(246,250,255,0.9))] p-6 shadow-[var(--shadow-card)] sm:p-8">
              <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-[rgba(37,99,235,0.12)] blur-3xl" />
              <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-[rgba(96,165,250,0.12)] blur-3xl" />

              <div className="relative flex flex-col items-center gap-5 text-center">
                <div>
                  <Badge className="px-4 py-2 text-sm tracking-[0.26em]">
                    {activeRegion || 'Select a region'}
                  </Badge>
                  <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">
                    Switch between divisions to view dealer points without making the page feel overloaded.
                  </p>
                </div>

                <motion.div
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(16,27,45,0.08)] bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Compass className="size-4 text-[var(--brand-start)]" />
                  {activeDealers.length} locations
                </motion.div>
              </div>

              <motion.div
                className="mt-8 flex flex-wrap justify-center gap-3"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.06 } },
                }}
              >
                {regionEntries.map(([region]) => (
                  <motion.button
                    key={region}
                    type="button"
                    onClick={() => setActiveRegion(region)}
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      show: { opacity: 1, y: 0 },
                    }}
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
                      activeRegion === region
                        ? 'bg-brand-gradient text-white shadow-[0_10px_24px_rgba(37,99,235,0.2)]'
                        : 'border border-[rgba(16,27,45,0.08)] bg-white text-slate-700'
                    }`}
                  >
                    {region}
                  </motion.button>
                ))}
              </motion.div>

              <div className="relative mt-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeRegion}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="grid gap-4 lg:grid-cols-2"
                  >
                    {activeDealers.map((dealer, dealerIndex) => (
                      <motion.article
                        key={dealer.id}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: dealerIndex * 0.05, ease: 'easeOut' }}
                        className="rounded-[1.8rem] border border-[rgba(16,27,45,0.08)] bg-white/90 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(8,17,31,0.08)]"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-start)]">
                              {dealer.city}
                            </div>
                            <h4 className="mt-2 font-display text-2xl font-semibold text-slate-950">
                              {dealer.showroom}
                            </h4>
                          </div>
                          <div className="rounded-2xl bg-[rgba(37,99,235,0.08)] p-3 text-[var(--brand-start)]">
                            <Building2 className="size-5" />
                          </div>
                        </div>

                        <div className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
                          <div className="flex items-start gap-3">
                            <Navigation className="mt-1 size-4 shrink-0 text-[var(--brand-start)]" />
                            <span>{dealer.address}</span>
                          </div>
                          {dealer.phone ? (
                            <div className="flex items-center gap-3">
                              <Phone className="size-4 text-[var(--brand-start)]" />
                              <span>{dealer.phone}</span>
                            </div>
                          ) : null}
                        </div>
                      </motion.article>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </section>
          </Reveal>
        )}
      </Container>
    </div>
  )
}
