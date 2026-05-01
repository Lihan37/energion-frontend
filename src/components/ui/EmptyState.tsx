interface EmptyStateProps {
  title: string
  description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="surface-card rounded-[2rem] border border-dashed border-[rgba(16,27,45,0.12)] px-6 py-14 text-center">
      <h3 className="font-display text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">{description}</p>
    </div>
  )
}
