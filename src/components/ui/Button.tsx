import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

import { cn } from '../../lib/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, PropsWithChildren {
  variant?: 'primary' | 'secondary' | 'ghost'
  fullWidth?: boolean
}

export function Button({
  children,
  className,
  variant = 'primary',
  fullWidth = false,
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-brand-gradient text-ink-950 hover:brightness-95',
    secondary:
      'border border-[rgba(16,27,45,0.1)] bg-white/80 text-slate-900 hover:bg-white hover:shadow-[0_10px_24px_rgba(8,17,31,0.08)]',
    ghost:
      'border border-transparent bg-transparent text-slate-700 hover:border-[rgba(16,27,45,0.08)] hover:bg-white/60',
  }

  return (
    <button
      className={cn(
        'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-semibold transition duration-200 ease-out active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-start)] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100',
        variants[variant],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
