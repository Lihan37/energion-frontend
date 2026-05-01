import type { ReactNode } from 'react'

import { cn } from '../../lib/cn'
import { Badge } from './Badge'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  action?: ReactNode
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
}: SectionHeadingProps) {
  const isCentered = align === 'center'

  return (
    <div className={cn('flex flex-col gap-4 md:flex-row md:items-end md:justify-between', isCentered && 'items-center text-center')}>
      <div className={cn('max-w-2xl space-y-4', isCentered && 'mx-auto max-w-4xl')}>
        {eyebrow ? <Badge>{eyebrow}</Badge> : null}
        <div className="space-y-3">
          <h2
            className={cn(
              'font-display font-semibold tracking-tight text-[var(--ink)]',
              isCentered ? 'text-xl sm:text-2xl lg:text-4xl' : 'text-3xl sm:text-4xl',
            )}
          >
            {title}
          </h2>
          {description ? (
            <p className={cn('text-base leading-7 text-[var(--muted)]', isCentered && 'mx-auto max-w-3xl text-sm sm:text-base sm:leading-8')}>
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  )
}
