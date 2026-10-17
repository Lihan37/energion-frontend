import { motion, useReducedMotion } from 'framer-motion'
import { campaignEase } from '../../lib/campaignMotion'

export function EnergyGraphic({ className = '' }: { className?: string }) {
  const reduced = useReducedMotion()
  return (
    <svg
      className={`energy-graphic ${className}`}
      viewBox="0 0 600 400"
      fill="none"
      aria-hidden="true"
    >
      {[0, 1, 2].map((index) => (
        <motion.path
          key={index}
          d={`M${-80 + index * 80} 400 L${180 + index * 80} 30 H${430 + index * 80} L${150 + index * 80} 400`}
          stroke="currentColor"
          strokeWidth="1.5"
          initial={reduced ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: reduced ? 0 : 1.4, delay: index * 0.12, ease: campaignEase }}
        />
      ))}
    </svg>
  )
}
