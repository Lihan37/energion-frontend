import type { PropsWithChildren } from 'react'

import { cn } from '../../lib/cn'

interface BadgeProps extends PropsWithChildren {
  className?: string
  tone?: 'gradient' | 'soft'
}

export function Badge({ children, className, tone = 'soft' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-[0.24em] uppercase',
        tone === 'gradient'
          ? 'bg-brand-gradient text-white'
          : 'border border-[rgba(49,94,230,0.12)] bg-[rgba(49,94,230,0.06)] text-[var(--brand-start)]',
        className,
      )}
    >
      {children}
    </span>
  )
}
