import { useReducedMotion } from 'framer-motion'
import { useViewportEntrance } from '../../lib/useViewportEntrance'

export function CampaignHeading({
  lines,
  as: Tag = 'h2',
  className = '',
}: {
  lines: string[]
  as?: 'h1' | 'h2' | 'h3'
  className?: string
}) {
  const reduced = useReducedMotion()
  const ref = useViewportEntrance<HTMLHeadingElement>({
    disabled: reduced,
    selector: '.heading-line',
    keyframes: [{ transform: 'translateY(110%) rotate(2deg)' }, { transform: 'none' }],
    duration: 850,
    stagger: 90,
  })
  return (
    <Tag ref={ref} className={`campaign-heading ${className}`} aria-label={lines.join(' ')}>
      {lines.map((line) => (
        <span className="heading-mask" key={line} aria-hidden="true">
          <span className="heading-line">{line}</span>
        </span>
      ))}
    </Tag>
  )
}
