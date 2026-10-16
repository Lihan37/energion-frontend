import { forwardRef, useId } from 'react'

import { cn } from '../../lib/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, error, id, ...props },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-semibold text-slate-800">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        ref={ref}
        className={cn(
          'h-12 rounded-2xl border border-[rgba(16,27,45,0.1)] bg-white/90 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[rgba(49,94,230,0.38)] focus:ring-4 focus:ring-[rgba(49,94,230,0.1)]',
          error && 'border-rose-300 focus:border-rose-400 focus:ring-rose-100',
          className,
        )}
        {...props}
      />
      {error ? (
        <span id={`${inputId}-error`} className="text-sm text-rose-600">
          {error}
        </span>
      ) : null}
    </div>
  )
})
