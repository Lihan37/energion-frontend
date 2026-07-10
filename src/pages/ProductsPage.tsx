import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'

import { ProductCard } from '../components/product/ProductCard'
import { ProductModal } from '../components/product/ProductModal'
import { Badge } from '../components/ui/Badge'
import { Container } from '../components/ui/Container'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingState } from '../components/ui/LoadingState'
import { SectionHeading } from '../components/ui/SectionHeading'
import { getProducts } from '../services/productService'
import type { Product, ProductCategory } from '../types/product'

export function ProductsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<ProductCategory | 'All'>('All')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const productsQuery = useQuery({ queryKey: ['products'], queryFn: getProducts })

  const categories = useMemo<Array<ProductCategory | 'All'>>(() => {
    const items = new Set((productsQuery.data ?? []).map((product) => product.category))
    return ['All', ...items]
  }, [productsQuery.data])

  const filteredProducts = useMemo(() => {
    const data = productsQuery.data ?? []
    return data.filter((product) => {
      const matchesQuery =
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.shortDescription.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = category === 'All' || product.category === category
      return matchesQuery && matchesCategory
    })
  }, [category, productsQuery.data, query])

  return (
    <div className="py-16">
      <Container className="space-y-10">
        <div className="surface-card rounded-[2.4rem] border border-[rgba(16,27,45,0.08)] px-6 py-8 shadow-[var(--shadow-soft)] sm:px-8">
          <SectionHeading
            eyebrow="Products"
            title="Explore Energion's electric mobility lineup with searchable cards and modal-first product details."
            description="Products on this page now come from the backend, so admin-added models appear here automatically after publish."
          />
          <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto]">
            <label className="group relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[var(--brand-start)]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by product name or keyword"
                className="h-14 w-full rounded-full border border-[rgba(16,27,45,0.08)] bg-white/90 pl-12 pr-12 outline-none transition focus:border-[rgba(49,94,230,0.32)] focus:ring-4 focus:ring-[rgba(49,94,230,0.08)]"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="size-4" />
                </button>
              ) : null}
            </label>
            <div className="flex flex-wrap gap-3">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`rounded-full px-4 py-3 text-sm font-semibold transition duration-200 active:scale-95 ${
                    category === item
                      ? 'bg-brand-gradient text-white shadow-[0_10px_24px_rgba(37,99,235,0.22)]'
                      : 'border border-[rgba(16,27,45,0.08)] bg-white/85 text-slate-700 hover:border-[rgba(49,94,230,0.28)] hover:bg-white hover:text-slate-950'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-900">{filteredProducts.length}</span> models
          </div>
          <Badge>{category === 'All' ? 'All categories' : category}</Badge>
        </div>

        {productsQuery.isLoading ? (
          <LoadingState label="Loading products..." />
        ) : filteredProducts.length ? (
          <motion.div
            key={category}
            className="grid gap-6 lg:grid-cols-2"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
          >
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                }}
              >
                <ProductCard product={product} onOpen={setSelectedProduct} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EmptyState
            title="No bikes match the current filter."
            description="Try a broader keyword or switch the selected category to see the full Energion lineup."
          />
        )}
      </Container>

      <ProductModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  )
}
