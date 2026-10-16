import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Container } from '../components/ui/Container'
export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center bg-ink-950 py-20 text-white">
      <Container>
        <span className="eyebrow">404 / A different direction</span>
        <h1 className="display-title my-8">
          Let's get you
          <br />
          back on track.
        </h1>
        <p className="mb-8 text-sm text-slate-300">
          This page doesn't exist. Your next journey is waiting.
        </p>
        <Link to="/" className="cta">
          Return to Energion <ArrowUpRight size={18} />
        </Link>
      </Container>
    </main>
  )
}
