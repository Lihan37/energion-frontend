import { Link } from 'react-router-dom'
import { MapPin, MessageCircle, Phone, Send, Zap } from 'lucide-react'

import { siteConfig } from '../../constants/site'
import { Container } from '../ui/Container'

const footerLinks = [
  { label: 'Products', href: '/products' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function Footer() {
  return (
    <footer className="border-t border-[rgba(16,27,45,0.08)] bg-slate-950 text-slate-200">
      <Container className="grid gap-10 py-14 lg:grid-cols-[1.4fr_0.8fr_1fr]">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-brand-gradient text-lg font-bold text-white">
              E
            </div>
            <div>
              <div className="font-display text-lg font-semibold">Energion E-Mobility</div>
              <div className="text-sm text-slate-400">{siteConfig.tagline}</div>
            </div>
          </div>
          <p className="max-w-md text-sm leading-7 text-slate-400">
            Electric bikes engineered for modern city life, premium daily comfort, and a cleaner next decade of movement.
          </p>
          <div className="flex gap-3">
            {[MessageCircle, Send, Zap].map((Icon, index) => (
              <a
                key={index}
                href="#"
                className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:border-white/20 hover:bg-white/10"
              >
                <Icon className="size-5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display text-lg font-semibold text-white">Quick Links</h3>
          <div className="mt-5 flex flex-col gap-3 text-sm text-slate-400">
            {footerLinks.map((link) => (
              <Link key={link.href} to={link.href} className="transition hover:text-white">
                {link.label}
              </Link>
            ))}
            <Link to="/admin" className="transition hover:text-white">
              Admin Login
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-display text-lg font-semibold text-white">Contact</h3>
          <div className="mt-5 space-y-4 text-sm text-slate-400">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-5 text-[var(--brand-end)]" />
              <span>{siteConfig.address}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="size-5 text-[var(--brand-end)]" />
              <span>{siteConfig.phone}</span>
            </div>
            <p>{siteConfig.email}</p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
