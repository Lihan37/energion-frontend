import { motion, useReducedMotion } from 'framer-motion'
import type { PropsWithChildren } from 'react'

import { cn } from '../../lib/cn'

interface RevealProps extends PropsWithChildren {
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale'
  duration?: number
  once?: boolean
  amount?: number
  blur?: boolean
  y?: number
  x?: number
}

export function Reveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  duration = 0.75,
  once = true,
  amount = 0.24,
  blur = true,
  y = 42,
  x = 72,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion()

  // Honour reduced-motion: render content in place with no transform/blur work.
  if (prefersReducedMotion) {
    return <div className={cn(className)}>{children}</div>
  }

  const initialOffset = {
    up: { y },
    down: { y: -y },
    left: { x },
    right: { x: -x },
    scale: { y: 24, scale: 0.9 },
  }[direction]

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, filter: blur ? 'blur(6px)' : 'blur(0px)', ...initialOffset }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
