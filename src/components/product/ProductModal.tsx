import { ArrowRight, CheckCircle2, ImageOff } from 'lucide-react'

import type { Product } from '../../types/product'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'

interface ProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  if (!product) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product.name}>
      <div className="space-y-8 p-6 lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5">
            <div className="overflow-hidden rounded-[1.75rem]">
              {product.image ? (
                <img src={product.image} alt={product.name} className="h-[360px] w-full object-cover" />
              ) : (
                <div className="flex h-[360px] w-full items-center justify-center bg-slate-100 text-center">
                  <div className="text-slate-500">
                    <ImageOff className="mx-auto size-10 text-slate-400" />
                    <div className="mt-4 text-base font-medium">Product image will be added soon</div>
                  </div>
                </div>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ['Battery', product.battery],
                ['Range', product.range],
                ['Top Speed', product.topSpeed],
                ['Charge Time', product.chargingTime],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[1.5rem] border border-[rgba(16,27,45,0.08)] bg-slate-50/80 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</div>
                  <div className="mt-2 text-sm font-semibold text-slate-950">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="gradient">{product.category}</Badge>
              {product.tag ? <Badge>{product.tag}</Badge> : null}
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.26em] text-slate-500">Starting price</div>
              <div className="mt-2 font-display text-4xl font-bold text-slate-950">Tk {product.price.toLocaleString()}</div>
            </div>
            <p className="text-base leading-8 text-slate-600">{product.description}</p>

            <div className="rounded-[1.75rem] border border-[rgba(16,27,45,0.08)] bg-white/80 p-5">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Available Colors</div>
              <div className="mt-4 flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <span key={color} className="rounded-full border border-[rgba(16,27,45,0.08)] px-4 py-2 text-sm font-medium text-slate-700">
                    {color}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button className="sm:flex-1">
                Book a Test Ride
                <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button variant="secondary" className="sm:flex-1">
                Talk to Sales
              </Button>
            </div>
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Features & Specs</div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {product.specs.map((spec) => (
              <div
                key={spec.label}
                className="flex items-start gap-3 rounded-[1.25rem] border border-[rgba(16,27,45,0.06)] bg-slate-50/70 px-4 py-3"
              >
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[var(--brand-start)]" />
                <div>
                  <div className="text-sm font-semibold text-slate-900">{spec.label}</div>
                  <div className="text-sm text-slate-600">{spec.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}
