import { useQuery } from '@tanstack/react-query'
import { MapPin, Search, X } from 'lucide-react'
import { useDeferredValue, useState } from 'react'
import { Container } from '../components/ui/Container'
import { getDealers } from '../services/dealerService'
import { CatalogState } from '../components/ui/CatalogState'
import { EnquiryCTA } from '../components/shared/EnquiryCTA'
import { CampaignHeading } from '../components/campaign/CampaignHeading'
import { CampaignPhotoPanel } from '../components/campaign/CampaignScenes'
import { DealerCard } from '../components/dealer/DealerCard'
import { campaignPhotos } from '../constants/campaignPhotos'

export function MapPage() {
  const query = useQuery({ queryKey: ['dealers'], queryFn: getDealers })
  const [region, setRegion] = useState('')
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search.trim().toLowerCase())
  const dealers = query.data ?? []
  const regions = [...new Set(dealers.map((dealer) => dealer.region))]
  const current = regions.includes(region) ? region : ''
  const filtered = dealers.filter(
    (dealer) =>
      (!current || dealer.region === current) &&
      `${dealer.showroom} ${dealer.city} ${dealer.address}`.toLowerCase().includes(deferredSearch),
  )
  function resetFilters() {
    setSearch('')
    setRegion('')
  }

  return (
    <Container className="dealer-directory">
      <header className="dealer-directory-intro">
        <div>
          <span className="eyebrow">The EZ GO dealer network</span>
          <CampaignHeading as="h1" lines={['Your next ride.', 'Starts nearby.']} />
          <p>
            Find your local showroom. Explore dealer points across Bangladesh and take the next step
            toward electric.
          </p>
        </div>
        {query.isSuccess && (
          <div className="dealer-network-summary" aria-label="Dealer network overview">
            <span>
              <MapPin size={18} aria-hidden="true" /> Across Bangladesh
            </span>
            <div>
              <strong>{dealers.length}</strong>
              <span>dealer points</span>
            </div>
            <p>{regions.length} dealer areas. One electric future.</p>
          </div>
        )}
      </header>

      {query.isPending || query.isError ? (
        <CatalogState error={query.isError} retry={() => void query.refetch()} />
      ) : (
        <section className="dealer-layout" aria-label="Dealer directory">
          <div className="dealer-toolbar">
            <div className="dealer-toolbar-top">
              <div>
                <span className="eyebrow">Find your nearest next step</span>
                <h2>Where will you start?</h2>
              </div>
              <label className="dealer-search">
                <Search size={20} aria-hidden="true" />
                <span className="sr-only">Search dealer points</span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search showroom, town or address"
                />
              </label>
            </div>
            <nav className="dealer-area-filters" aria-label="Dealer areas">
              <button aria-pressed={!current} onClick={() => setRegion('')}>
                All areas <span>({dealers.length})</span>
              </button>
              {regions.map((item) => (
                <button key={item} aria-pressed={current === item} onClick={() => setRegion(item)}>
                  {item} <span>({dealers.filter((dealer) => dealer.region === item).length})</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="dealer-results-top">
            <p role="status" aria-live="polite">
              <strong>{filtered.length}</strong> {filtered.length === 1 ? 'location' : 'locations'}
              <span> / {current || 'All areas'}</span>
            </p>
            {(search || current) && (
              <button onClick={resetFilters} className="dealer-reset">
                Clear filters <X size={15} aria-hidden="true" />
              </button>
            )}
          </div>
          {!filtered.length && (
            <div className="status-panel">
              <h2>No matching dealer points.</h2>
              <p>Try a showroom name, another town or a different area.</p>
              <button className="cta" onClick={resetFilters}>
                Show all dealer points
              </button>
            </div>
          )}
          <div className="dealer-results-grid">
            {filtered.map((dealer) => (
              <DealerCard dealer={dealer} key={dealer.id} />
            ))}
          </div>
        </section>
      )}

      <div className="dealer-directory-outro">
        <div className="dealer-campaign-story">
          <CampaignPhotoPanel photo={campaignPhotos.cityPause} />
          <div>
            <span className="eyebrow">Your next stop</span>
            <h2 className="section-title">
              Meet electric.
              <br />
              Meet Energion.
            </h2>
            <p className="body-copy">
              Explore our dealer points and talk to our team about the ride that fits your everyday.
            </p>
          </div>
        </div>
        <EnquiryCTA />
      </div>
    </Container>
  )
}
