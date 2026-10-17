import { motion, useReducedMotion } from 'framer-motion'

import { campaignEase } from '../../lib/campaignMotion'

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
  return (
    <Tag className={`campaign-heading ${className}`} aria-label={lines.join(' ')}>
      {lines.map((line, index) => (
        <span className="heading-mask" key={line} aria-hidden="true">
          <motion.span
            initial={reduced ? false : { y: '110%', rotate: 2 }}
            whileInView={{ y: '0%', rotate: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: reduced ? 0 : 0.85, delay: index * 0.09, ease: campaignEase }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
