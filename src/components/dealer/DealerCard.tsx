import { ArrowUpRight, MapPin, Phone } from 'lucide-react'
import type { Dealer } from '../../types/dealer'

export function DealerCard({ dealer }: { dealer: Dealer }) {
  return (
    <article className="dealer-card">
      <div className="dealer-card-top">
        <span className="dealer-city">
          <MapPin size={16} aria-hidden="true" />
          {dealer.city}
        </span>
        <span className="dealer-area">{dealer.region}</span>
      </div>
      <h3>{dealer.showroom}</h3>
      <p className="dealer-address">{dealer.address}</p>
      {dealer.hours && <p className="dealer-hours">{dealer.hours}</p>}
      {dealer.phone && (
        <a className="dealer-phone" href={`tel:${dealer.phone}`}>
          <Phone size={16} aria-hidden="true" />
          {dealer.phone}
        </a>
      )}
      <div className="dealer-card-footer">
        <span>Plan your visit</span>
        <a
          className="dealer-directions"
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${dealer.showroom}, ${dealer.address}`)}`}
          target="_blank"
          rel="noreferrer"
        >
          Get directions <ArrowUpRight size={17} aria-hidden="true" />
        </a>
      </div>
    </article>
  )
}
