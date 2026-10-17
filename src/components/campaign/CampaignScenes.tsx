import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { campaignPhotos, type CampaignPhoto } from '../../constants/campaignPhotos'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'
import { CampaignHeading } from './CampaignHeading'

export function CampaignPhotoPanel({ photo }: { photo: CampaignPhoto }) {
  return (
    <figure className="campaign-photo-panel">
      <img
        src={photo.src}
        alt={photo.alt}
        width={1536}
        height={2048}
        loading="lazy"
        decoding="async"
      />
      <figcaption>
        <span>{photo.label}</span>
        <span>ENERGION / CAMPAIGN</span>
      </figcaption>
    </figure>
  )
}

export function CampaignScenes({ collection }: { collection: 'home' | 'about' }) {
  const photos =
    collection === 'home'
      ? [campaignPhotos.mountain, campaignPhotos.cityMotion, campaignPhotos.openRoad]
      : [campaignPhotos.attitude, campaignPhotos.cityWalk, campaignPhotos.coffee]
  return (
    <section
      className={`campaign-scenes scenes-${collection}`}
      aria-label="Energion campaign imagery"
    >
      <Container>
        <div className="section-topline">
          <div>
            <span className="eyebrow">Electric is a different mindset</span>
            <CampaignHeading
              lines={
                collection === 'home'
                  ? ['For the way', 'you move.']
                  : ['More than a journey.', 'A way of thinking.']
              }
              className="section-title mt-4"
            />
          </div>
          <Link className="text-link" to={collection === 'home' ? '/about' : '/contact'}>
            {collection === 'home' ? 'The Energion story' : 'Start a conversation'}{' '}
            <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="campaign-scene-grid">
          {photos.map((photo, index) => (
            <Reveal key={photo.src} delay={index * 0.08}>
              <CampaignPhotoPanel photo={photo} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
