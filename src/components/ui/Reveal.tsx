import { useReducedMotion } from 'framer-motion'
import type { PropsWithChildren } from 'react'

import { cn } from '../../lib/cn'
import { useViewportEntrance } from '../../lib/useViewportEntrance'

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
  duration = 0.6,
  once = true,
  amount = 0.24,
  blur = false,
  y = 24,
  x = 24,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion()

  const transform = {
    up: `translateY(${y}px)`,
    down: `translateY(${-y}px)`,
    left: `translateX(${x}px)`,
    right: `translateX(${-x}px)`,
    scale: 'translateY(24px) scale(0.9)',
  }[direction]
  const ref = useViewportEntrance<HTMLDivElement>({
    disabled: prefersReducedMotion,
    keyframes: [
      { opacity: 0, transform, filter: blur ? 'blur(6px)' : 'none' },
      { opacity: 1, transform: 'none', filter: 'none' },
    ],
    duration: duration * 1000,
    delay: delay * 1000,
    once,
    amount,
  })

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  )
}
