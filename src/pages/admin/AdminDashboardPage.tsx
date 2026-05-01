import { useQuery } from '@tanstack/react-query'
import {
  ArrowRight,
  Bell,
  Bike,
  FileText,
  Mail,
  MapPinned,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '../../components/ui/Badge'
import { LoadingState } from '../../components/ui/LoadingState'
import { Reveal } from '../../components/ui/Reveal'
import { getAdminSummary } from '../../services/adminService'

const moduleMeta = [
  {
    title: 'Products',
    description: 'Manage catalog visibility, pricing, specifications, and modal-ready product content.',
    icon: Bike,
    accent: 'from-blue-600/18 to-cyan-400/14',
  },
  {
    title: 'Blogs',
    description: 'Publish updates, mobility guides, and feature stories that feed the public blog page.',
    icon: FileText,
    accent: 'from-sky-500/18 to-emerald-300/14',
  },
  {
    title: 'Dealers / Map Points',
    description: 'Update regional showroom coverage and keep the dealer finder accurate across Bangladesh.',
    icon: MapPinned,
    accent: 'from-indigo-600/18 to-sky-300/14',
  },
  {
    title: 'Messages',
    description: 'Review inbound contact requests, test ride leads, and support conversations.',
    icon: Mail,
    accent: 'from-violet-500/18 to-blue-400/14',
  },
  {
    title: 'Settings',
    description: 'Control API-connected business settings, content preferences, and dashboard behavior.',
    icon: Settings,
    accent: 'from-slate-500/18 to-slate-300/14',
  },
  {
    title: 'Admins',
    description: 'Oversee admin access rules linked to approved backend phone numbers.',
    icon: UserCog,
    accent: 'from-blue-700/18 to-indigo-300/14',
  },
] as const

export function AdminDashboardPage() {
  const summaryQuery = useQuery({
    queryKey: ['admin-summary'],
    queryFn: getAdminSummary,
  })

  const summaryCards = [
    {
      label: 'Products',
      value: summaryQuery.data?.products ?? 0,
      icon: Bike,
      helper: 'Live catalog records',
    },
    {
      label: 'Blogs',
      value: summaryQuery.data?.blogs ?? 0,
      icon: FileText,
      helper: 'Published or draft posts',
    },
    {
      label: 'Dealers',
      value: summaryQuery.data?.dealers ?? 0,
      icon: MapPinned,
      helper: 'Regional showroom entries',
    },
    {
      label: 'Messages',
      value: summaryQuery.data?.messages ?? 0,
      icon: Mail,
      helper: 'Incoming contact items',
    },
    {
      label: 'Users',
      value: summaryQuery.data?.users ?? 0,
      icon: Users,
      helper: 'Registered accounts',
    },
    {
      label: 'Admins',
      value: summaryQuery.data?.admins ?? 0,
      icon: ShieldCheck,
      helper: 'Authorized operator accounts',
    },
  ]

  const commandItems = [
    {
      label: 'Open product management',
      value: 'Review model listings, charging specs, range, pricing, and visuals before they appear on the website.',
      href: '/admin/products',
    },
    {
      label: 'Check dealer coverage',
      value: 'Keep regional dealer points aligned with the latest showroom network across Bangladesh.',
      href: '#modules',
    },
    {
      label: 'Watch incoming leads',
      value: 'Follow contact requests and test ride interest so the customer journey stays responsive.',
      href: '#overview',
    },
  ]

  return (
    <>
      <Reveal>
            <div className="overflow-hidden rounded-[2.4rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(242,247,255,0.88))] p-6 shadow-[0_24px_80px_rgba(8,17,31,0.24)] sm:p-8">
              <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
                <div>
                  <Badge>Dashboard Overview</Badge>
                  <h1 className="mt-4 max-w-3xl font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl xl:text-5xl">
                    Manage Energion's product catalog, dealer presence, and content from one control panel.
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-600 sm:text-base">
                    This workspace keeps the public website aligned with the real business. Update products,
                    showroom coverage, stories, and lead handling here so riders always see the latest Energion
                    information.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(49,94,230,0.24)] transition hover:opacity-95"
                    >
                      Review storefront
                      <ArrowRight className="size-4" />
                    </Link>
                    <a
                      href="#modules"
                      className="inline-flex items-center gap-2 rounded-full border border-[rgba(16,27,45,0.1)] bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-[rgba(49,94,230,0.18)] hover:text-slate-950"
                    >
                      Jump to modules
                    </a>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.8rem] bg-slate-950 p-5 text-white shadow-[0_18px_40px_rgba(15,23,42,0.28)] sm:col-span-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                        Session Status
                      </div>
                      <Bell className="size-4 text-[var(--brand-end)]" />
                    </div>
                    <div className="mt-4 text-2xl font-semibold">Workspace active</div>
                    <p className="mt-2 text-sm leading-7 text-slate-300">
                      Product, dealer, and content controls are ready for live business updates.
                    </p>
                  </div>

                  <div className="rounded-[1.6rem] border border-[rgba(16,27,45,0.08)] bg-white/80 p-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Catalog Focus</div>
                    <div className="mt-3 text-2xl font-semibold text-slate-950">Products</div>
                    <p className="mt-2 text-sm leading-7 text-slate-600">Maintain names, specs, images, and pricing across the lineup.</p>
                  </div>

                  <div className="rounded-[1.6rem] border border-[rgba(16,27,45,0.08)] bg-white/80 p-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Website Sync</div>
                    <div className="mt-3 text-2xl font-semibold text-slate-950">Public Ready</div>
                    <p className="mt-2 text-sm leading-7 text-slate-600">Updates here are meant to flow directly into the public website experience.</p>
                  </div>
                </div>
              </div>
            </div>
      </Reveal>

      <Reveal delay={0.08}>
        <section id="overview" className="rounded-[2.2rem] border border-white/10 bg-white/92 p-6 shadow-[0_24px_80px_rgba(8,17,31,0.22)] sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Badge>System Snapshot</Badge>
                <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                  A quick view of what currently powers the Energion website.
                </h2>
              </div>
              <div className="text-sm text-slate-500">Products, content, dealers, messages, and account totals</div>
            </div>

            {summaryQuery.isLoading ? (
              <div className="mt-6">
                <LoadingState label="Loading admin summary..." />
              </div>
            ) : summaryQuery.isError ? (
              <div className="mt-6">
                <div className="rounded-[2rem] border border-dashed border-[rgba(16,27,45,0.12)] px-6 py-14 text-center">
                  <h3 className="font-display text-xl font-semibold text-slate-900">Summary unavailable</h3>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
                    The dashboard loaded, but the summary endpoint did not respond. Check backend auth or API availability.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {summaryCards.map((card, index) => {
                  const Icon = card.icon

                  return (
                    <Reveal key={card.label} delay={0.04 * index} y={18}>
                      <div className="rounded-[1.8rem] border border-[rgba(16,27,45,0.08)] bg-slate-50/90 p-5 transition hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(8,17,31,0.08)]">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                            {card.label}
                          </div>
                          <div className="flex size-11 items-center justify-center rounded-2xl bg-brand-gradient text-white">
                            <Icon className="size-5" />
                          </div>
                        </div>
                        <div className="mt-5 text-3xl font-semibold text-slate-950">{card.value}</div>
                        <p className="mt-2 text-sm leading-7 text-slate-600">{card.helper}</p>
                      </div>
                    </Reveal>
                  )
                })}
              </div>
            )}
        </section>
      </Reveal>

      <div className="grid gap-5 xl:grid-cols-[1.12fr_0.88fr]">
        <Reveal delay={0.12}>
          <section id="modules" className="rounded-[2.2rem] border border-white/10 bg-white/92 p-6 shadow-[0_24px_80px_rgba(8,17,31,0.22)] sm:p-8">
              <Badge>Admin Modules</Badge>
              <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                The core operational areas that shape the public Energion experience.
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {moduleMeta.map((item, index) => {
                  const Icon = item.icon

                  return (
                    <Reveal key={item.title} delay={0.05 * index} y={18}>
                      <div
                        className={`rounded-[1.8rem] border border-[rgba(16,27,45,0.08)] bg-gradient-to-br ${item.accent} p-[1px]`}
                      >
                        <div className="h-full rounded-[1.75rem] bg-white/96 p-5">
                          <div className="flex items-center justify-between">
                            <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                              <Icon className="size-5" />
                            </div>
                            <ArrowRight className="size-4 text-slate-400" />
                          </div>
                          <h3 className="mt-5 text-xl font-semibold text-slate-950">{item.title}</h3>
                          <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                        </div>
                      </div>
                    </Reveal>
                  )
                })}
              </div>
          </section>
        </Reveal>

        <Reveal delay={0.16}>
          <section className="space-y-5">
            <div className="rounded-[2.2rem] border border-white/10 bg-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(8,17,31,0.24)] sm:p-8">
                <Badge tone="gradient">Quick Actions</Badge>
                <div className="mt-4 space-y-4">
                  {commandItems.map((item, index) => (
                    <Reveal key={item.label} delay={0.05 * index} y={18}>
                      <a
                        href={item.href}
                        className="flex items-start justify-between rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4 transition hover:bg-white/8"
                      >
                        <div>
                          <div className="font-semibold text-white">{item.label}</div>
                          <div className="mt-2 max-w-md text-sm leading-7 text-slate-300">{item.value}</div>
                        </div>
                        <ArrowRight className="mt-1 size-4 shrink-0 text-[var(--brand-end)]" />
                      </a>
                    </Reveal>
                  ))}
                </div>
            </div>

            <div className="rounded-[2.2rem] border border-white/10 bg-white/92 p-6 shadow-[0_24px_80px_rgba(8,17,31,0.22)] sm:p-8">
                <Badge>Admin Session</Badge>
                <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">
                  <p>
                    This area is reserved for approved Energion operators who maintain the product catalog and
                    website content.
                  </p>
                  <p>
                    The same login page supports both public users and admins, but approved phone numbers unlock
                    this control panel instantly.
                  </p>
                  <p>
                    As the backend grows, this dashboard can manage real storefront updates, editorial content,
                    showroom points, support flow, and internal admin access rules.
                  </p>
                </div>
            </div>
          </section>
        </Reveal>
      </div>
    </>
  )
}
