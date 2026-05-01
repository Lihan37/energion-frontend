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
    primary:
      'bg-brand-gradient text-white shadow-[0_14px_30px_rgba(49,94,230,0.25)] hover:opacity-95',
    secondary:
      'border border-[rgba(16,27,45,0.1)] bg-white/80 text-slate-900 hover:bg-white',
    ghost:
      'border border-transparent bg-transparent text-slate-700 hover:border-[rgba(16,27,45,0.08)] hover:bg-white/60',
  }

  return (
    <button
      className={cn(
        'inline-flex cursor-pointer items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-start)] disabled:cursor-not-allowed disabled:opacity-60',
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
