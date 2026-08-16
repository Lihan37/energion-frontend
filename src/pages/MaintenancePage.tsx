export function MaintenancePage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f7fb] px-6 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(49,94,230,0.12),transparent_34%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(49,94,230,0.12)] sm:h-[28rem] sm:w-[28rem]" />

      <h1 className="relative font-display text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl">
        Site under maintenance
      </h1>
    </main>
  )
}
