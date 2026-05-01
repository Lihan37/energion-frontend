import { Link } from 'react-router-dom'

import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Container className="max-w-2xl">
        <div className="surface-card rounded-[2.5rem] border border-[rgba(16,27,45,0.08)] px-6 py-12 text-center shadow-[var(--shadow-soft)] sm:px-10">
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--brand-start)]">404</div>
          <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight text-slate-950">
            Page not found.
          </h1>
          <p className="mt-4 text-base leading-8 text-slate-600">
            The route you requested does not exist in the current frontend structure.
          </p>
          <Link to="/" className="mt-8 inline-flex">
            <Button>Return Home</Button>
          </Link>
        </div>
      </Container>
    </div>
  )
}
