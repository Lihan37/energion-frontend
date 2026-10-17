import { CampaignHeading } from './CampaignHeading'
import { EnergyGraphic } from './EnergyGraphic'

export function CampaignIntro({
  eyebrow,
  lines,
  description,
  index,
  tone = 'white',
}: {
  eyebrow: string
  lines: string[]
  description: string
  index: string
  tone?: 'white' | 'lime' | 'black'
}) {
  return (
    <div className={`page-intro campaign-intro intro-${tone}`}>
      <div className="intro-label">
        <span className="eyebrow">{eyebrow}</span>
        <span>{index} / ENERGION</span>
      </div>
      <CampaignHeading as="h1" lines={lines} className="display-title" />
      <div className="intro-baseline">
        <p className="body-copy">{description}</p>
        <span aria-hidden="true">↗</span>
      </div>
      <EnergyGraphic />
    </div>
  )
}
