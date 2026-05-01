import {
  ArrowUpRight,
  Globe,
  Leaf,
  ShieldCheck,
  Target,
  Users,
  Zap,
} from 'lucide-react'

import { Badge } from '../components/ui/Badge'
import { Container } from '../components/ui/Container'
import { Reveal } from '../components/ui/Reveal'

const aboutParagraphs = [
  'Energion-E Mobility is committed to transforming the transportation sector with eco-friendly electric vehicles (EVs). While we are in the early stages of our journey, our management team brings over a decade of experience in the industry, ensuring that we deliver innovative, sustainable, and reliable mobility solutions.',
  'Our mission is to provide high-quality EV options that reduce carbon emissions and contribute to a greener, more sustainable future. We embrace the latest technologies and are dedicated to meeting the evolving needs of our customers with outstanding service.',
  'At Energion-E Mobility, our talented and diverse team plays a crucial role in our success. We foster a positive and inclusive work environment where innovation and personal growth are encouraged. With strong HR and payroll policies, we uphold values of integrity, collaboration, and excellence, ensuring that every team member is supported and motivated.',
  'Driven by a clear vision, we are shaping the future of transportation with cleaner, smarter, and more sustainable solutions for tomorrow.',
]

const summaryStats = [
  { label: 'Industry Experience', value: '10+ Years' },
  { label: 'Core Direction', value: 'Clean EV Mobility' },
  { label: 'Priority', value: 'Reliable Innovation' },
]

const pillars = [
  {
    title: 'Mission',
    description:
      'To deliver reliable, high-quality electric vehicles that reduce emissions and meet everyday mobility needs through innovation and strong customer focus.',
    icon: Target,
    tone: 'dark',
  },
  {
    title: 'Vision',
    description:
      'To lead the transition to sustainable transportation by making electric mobility accessible, reliable, and environmentally responsible for everyone.',
    icon: Globe,
    tone: 'dark',
  },
] as const

const values = [
  {
    title: 'Innovation and technology',
    description:
      'We embrace the latest technologies to deliver mobility solutions that feel modern, practical, and dependable in daily use.',
    icon: Zap,
  },
  {
    title: 'Customer-first service',
    description:
      'We are dedicated to meeting evolving customer needs through quality vehicles, stronger support, and a service experience built on trust.',
    icon: ShieldCheck,
  },
  {
    title: 'People and culture',
    description:
      'A talented and diverse team powers the company. We encourage personal growth, collaboration, and an inclusive work environment.',
    icon: Users,
  },
  {
    title: 'Why electric mobility',
    description:
      'Electric mobility reduces carbon emissions and helps build a cleaner, smarter, and more sustainable transportation future.',
    icon: Leaf,
  },
]

export function AboutPage() {
  return (
    <div className="py-14 sm:py-16">
      <Container className="space-y-14">
        <Reveal>
          <section className="relative overflow-hidden rounded-[2.6rem] border border-[rgba(16,27,45,0.08)] bg-slate-950 px-6 py-8 text-white shadow-[var(--shadow-soft)] sm:px-8 lg:px-12 lg:py-12">
            <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-[rgba(96,165,250,0.22)] blur-3xl" />
            <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-[rgba(37,99,235,0.18)] blur-3xl" />

            <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
              <div className="space-y-6">
                <Badge tone="gradient">About Energion</Badge>
                <h1 className="max-w-3xl font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Building cleaner mobility with experience, discipline, and long-term vision.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                  Energion-E Mobility is shaping a smarter EV future through reliable products, practical innovation, and a team culture grounded in integrity, collaboration, and excellence.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {summaryStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[1.75rem] border border-white/10 bg-white/8 px-5 py-5 backdrop-blur-md"
                  >
                    <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                      {stat.label}
                    </div>
                    <div className="mt-3 font-display text-2xl font-semibold text-white">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <Reveal>
            <section className="surface-card rounded-[2.4rem] border border-[rgba(16,27,45,0.08)] p-6 shadow-[var(--shadow-card)] sm:p-8 lg:p-10">
              <Badge>Company Narrative</Badge>
              <h2 className="mt-5 max-w-3xl font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                The actual company story, blended into a cleaner and more structured About experience.
              </h2>
              <div className="mt-6 space-y-5 text-base leading-8 text-slate-600">
                {aboutParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          </Reveal>

          <div className="grid gap-6">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 0.08}>
                <section
                  className={`rounded-[2.2rem] border p-6 shadow-[var(--shadow-card)] sm:p-8 ${
                    pillar.tone === 'dark'
                      ? 'border-slate-950 bg-slate-950 text-white'
                      : 'surface-card border-[rgba(16,27,45,0.08)] text-slate-950'
                  }`}
                >
                  <div
                    className={`inline-flex rounded-2xl p-3 ${
                      pillar.tone === 'dark'
                        ? 'bg-white/10 text-[var(--brand-end)]'
                        : 'bg-brand-gradient text-white'
                    }`}
                  >
                    <pillar.icon className="size-5" />
                  </div>
                  <h3 className="mt-6 font-display text-3xl font-semibold tracking-tight">{pillar.title}</h3>
                  <p
                    className={`mt-4 text-base leading-8 ${
                      pillar.tone === 'dark' ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {pillar.description}
                  </p>
                </section>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal>
          <section className="grid gap-8 rounded-[2.5rem] border border-[rgba(16,27,45,0.08)] bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(248,251,255,0.82))] px-6 py-8 shadow-[var(--shadow-soft)] sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-12 lg:py-10">
            <div className="space-y-5">
              <Badge>How We Operate</Badge>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                A culture built around innovation, accountability, and sustainable progress.
              </h2>
              <p className="text-base leading-8 text-slate-600">
                Strong internal values matter because mobility brands are not defined only by machines. They are also shaped by people, processes, and how consistently they serve customers.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {values.map((value, index) => (
                <Reveal key={value.title} delay={0.08 + index * 0.06}>
                  <article className="rounded-[1.8rem] border border-[rgba(16,27,45,0.08)] bg-white/90 p-5 transition duration-300 hover:-translate-y-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="inline-flex rounded-2xl bg-brand-gradient p-3 text-white">
                        <value.icon className="size-5" />
                      </div>
                      <ArrowUpRight className="size-5 text-slate-300" />
                    </div>
                    <h3 className="mt-5 font-display text-2xl font-semibold text-slate-950">{value.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{value.description}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </section>
        </Reveal>
      </Container>
    </div>
  )
}
