import { forwardRef } from 'react'

import { cn } from '../../lib/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, error, ...props },
  ref,
) {
  return (
    <label className="flex flex-col gap-2">
      {label ? <span className="text-sm font-semibold text-slate-800">{label}</span> : null}
      <input
        ref={ref}
        className={cn(
          'h-12 rounded-2xl border border-[rgba(16,27,45,0.1)] bg-white/90 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[rgba(49,94,230,0.38)] focus:ring-4 focus:ring-[rgba(49,94,230,0.1)]',
          error && 'border-rose-300 focus:border-rose-400 focus:ring-rose-100',
          className,
        )}
        {...props}
      />
      {error ? <span className="text-sm text-rose-500">{error}</span> : null}
    </label>
  )
})
