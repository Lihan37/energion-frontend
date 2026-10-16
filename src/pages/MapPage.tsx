import { useQuery } from '@tanstack/react-query'
import { ArrowUpRight, MapPin, Phone } from 'lucide-react'
import { useState } from 'react'
import { Container } from '../components/ui/Container'
import { getDealers } from '../services/dealerService'
import { CatalogState } from '../components/ui/CatalogState'
import { EnquiryCTA } from '../components/shared/EnquiryCTA'

export function MapPage() {
  const query = useQuery({ queryKey: ['dealers'], queryFn: getDealers })
  const [region, setRegion] = useState('')
  const dealers = query.data ?? []
  const regions = [...new Set(dealers.map((dealer) => dealer.region))]
  const current = regions.includes(region) ? region : regions[0]
  const filtered = dealers.filter((dealer) => dealer.region === current)
  return (
    <Container>
      <div className="page-intro">
        <span className="eyebrow">Closer to your next ride</span>
        <h1 className="display-title">
          Find your
          <br />
          Energion.
        </h1>
        <p className="body-copy">
          Discover dealer points across Bangladesh. Choose your region and find a place to begin
          your electric journey.
        </p>
      </div>
      {query.isPending || query.isError ? (
        <CatalogState error={query.isError} retry={() => void query.refetch()} />
      ) : (
        <div className="dealer-layout">
          <nav className="region-list" aria-label="Dealer regions">
            {regions.map((item) => (
              <button key={item} aria-pressed={current === item} onClick={() => setRegion(item)}>
                {item}
              </button>
            ))}
          </nav>
          <section>
            <p className="mb-5 text-xs text-slate-500" role="status">
              {filtered.length} locations / {current}
            </p>
            <div className="grid gap-4 lg:grid-cols-2">
              {filtered.map((dealer) => (
                <article className="dealer-card" key={dealer.id}>
                  <span className="eyebrow">
                    <MapPin size={12} />
                    {dealer.city}
                  </span>
                  <h3>{dealer.showroom}</h3>
                  <p>{dealer.address}</p>
                  {dealer.phone && (
                    <a
                      className="mt-3 inline-flex items-center gap-2 text-sm"
                      href={`tel:${dealer.phone}`}
                    >
                      <Phone size={14} />
                      {dealer.phone}
                    </a>
                  )}
                  <div>
                    <a
                      className="text-link"
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${dealer.showroom}, ${dealer.address}`)}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Get directions <ArrowUpRight size={15} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}
      <div className="pb-16">
        <EnquiryCTA />
      </div>
    </Container>
  )
}
