import { BatteryCharging, Gauge, ImageOff, Timer } from 'lucide-react'

import type { Product } from '../../types/product'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { SmoothImage } from '../ui/SmoothImage'

interface ProductCardProps {
  product: Product
  onOpen: (product: Product) => void
}

export function ProductCard({ product, onOpen }: ProductCardProps) {
  return (
    <article className="group surface-card card-lift flex h-full flex-col overflow-hidden rounded-[1.65rem] border border-[rgba(16,27,45,0.08)] shadow-[var(--shadow-card)]">
      <div className="relative flex h-52 items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#f7f9ff_0%,#e8effd_54%,#d5def0_100%)] sm:h-56">
        {product.image ? (
          <SmoothImage
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain p-3 transition duration-[600ms] ease-out group-hover:scale-[1.025]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-center">
            <div className="px-6 text-slate-700">
              <ImageOff className="mx-auto size-8 text-[var(--brand-start)]/70" />
              <div className="mt-3 text-sm font-semibold">{product.name}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-500">Visual coming soon</div>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/5 to-transparent" />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <Badge tone="gradient">{product.category}</Badge>
          {product.tag ? <Badge>{product.tag}</Badge> : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="font-display text-xl font-semibold text-slate-950">{product.name}</h3>
              <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-slate-600">{product.shortDescription}</p>
            </div>
            <div className="shrink-0 rounded-2xl bg-[rgba(49,94,230,0.06)] px-3 py-2 text-right">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Starting</div>
              <div className="mt-0.5 text-base font-bold text-[var(--brand-start)]">Tk {product.price.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 rounded-[1.35rem] border border-[rgba(16,27,45,0.06)] bg-slate-50/80 p-3">
          <Metric icon={BatteryCharging} label="Battery" value={product.battery} />
          <Metric icon={Gauge} label="Range" value={product.range} />
          <Metric icon={Gauge} label="Top Speed" value={product.topSpeed} />
          <Metric icon={Timer} label="Charge" value={product.chargingTime} />
        </div>

        <div className="mt-auto pt-0.5">
          <Button fullWidth onClick={() => onOpen(product)}>
            Details
          </Button>
        </div>
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
    <div className="flex min-h-16 items-start gap-2 rounded-xl bg-white/90 p-2.5">
      <div className="mt-0.5 rounded-lg bg-[rgba(49,94,230,0.08)] p-1.5 text-[var(--brand-start)]">
        <Icon className="size-3.5" />
      </div>
      <div className="min-w-0">
        <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</div>
        <div className="mt-1 line-clamp-2 break-words text-xs font-semibold leading-4 text-slate-900">{value}</div>
      </div>
    </div>
  )
}
