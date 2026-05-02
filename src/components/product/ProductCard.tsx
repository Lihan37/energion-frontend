import { BatteryCharging, Gauge, ImageOff, Timer } from 'lucide-react'

import type { Product } from '../../types/product'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

interface ProductCardProps {
  product: Product
  onOpen: (product: Product) => void
}

export function ProductCard({ product, onOpen }: ProductCardProps) {
  return (
    <article className="group surface-card overflow-hidden rounded-[2rem] border border-[rgba(16,27,45,0.08)] shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-1">
      <div className="relative h-64 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(180deg,#e8eefc_0%,#dbe7ff_36%,#10172d_100%)] text-center">
            <div className="px-6 text-slate-700">
              <ImageOff className="mx-auto size-8 text-[var(--brand-start)]/70" />
              <div className="mt-3 text-sm font-semibold">{product.name}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-500">Visual coming soon</div>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/5 to-transparent" />
        <div className="absolute left-5 top-5 flex items-center gap-2">
          <Badge tone="gradient">{product.category}</Badge>
          {product.tag ? <Badge>{product.tag}</Badge> : null}
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-2xl font-semibold text-slate-950">{product.name}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{product.shortDescription}</p>
            </div>
            <div className="rounded-2xl bg-[rgba(49,94,230,0.06)] px-3 py-2 text-right">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Starting</div>
              <div className="mt-1 text-lg font-bold text-[var(--brand-start)]">Tk {product.price.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 rounded-[1.5rem] border border-[rgba(16,27,45,0.06)] bg-slate-50/80 p-4 sm:grid-cols-2">
          <Metric icon={BatteryCharging} label="Battery" value={product.battery} />
          <Metric icon={Gauge} label="Range" value={product.range} />
          <Metric icon={Gauge} label="Top Speed" value={product.topSpeed} />
          <Metric icon={Timer} label="Charge" value={product.chargingTime} />
        </div>

        <Button fullWidth onClick={() => onOpen(product)}>
          Details
        </Button>
      </div>
    </article>
  )
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BatteryCharging
  label: string
  value: string
}) {
  return (
    <div className="flex min-h-20 items-start gap-3 rounded-2xl bg-white/90 p-3">
      <div className="mt-0.5 rounded-xl bg-[rgba(49,94,230,0.08)] p-2 text-[var(--brand-start)]">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</div>
        <div className="mt-1 break-words text-sm font-semibold text-slate-900">{value}</div>
      </div>
    </div>
  )
}
