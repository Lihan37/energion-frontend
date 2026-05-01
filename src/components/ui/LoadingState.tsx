export function LoadingState({ label = 'Loading content...' }: { label?: string }) {
  return (
    <div className="surface-card flex min-h-52 items-center justify-center rounded-[2rem] border border-[rgba(16,27,45,0.08)]">
      <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
        <span className="size-3 animate-pulse rounded-full bg-[var(--brand-start)]" />
        {label}
      </div>
    </div>
  )
}
