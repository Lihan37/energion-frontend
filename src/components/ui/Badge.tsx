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
        'inline-flex items-center rounded-sm px-3 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase',
        tone === 'gradient'
          ? 'bg-brand-gradient text-ink-950'
          : 'border border-[var(--line-strong)] bg-surface-100 text-ink-950',
        className,
      )}
    >
      {children}
    </span>
  )
}
