import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useDeferredValue, useState } from 'react'
import { ProductCard } from '../components/product/ProductCard'
import { Container } from '../components/ui/Container'
import { CatalogState } from '../components/ui/CatalogState'
import { Reveal } from '../components/ui/Reveal'
import { EnquiryCTA } from '../components/shared/EnquiryCTA'
import { getProducts } from '../services/productService'
import { CampaignIntro } from '../components/campaign/CampaignIntro'

export function ProductsPage() {
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)
  const [category, setCategory] = useState('All')
  const query = useQuery({ queryKey: ['products'], queryFn: getProducts })
  const products = query.data ?? []
  const categories = ['All', ...new Set(products.map((product) => product.category))]
  const filtered = products.filter(
    (product) =>
      (category === 'All' || product.category === category) &&
      `${product.name} ${product.shortDescription}`
        .toLowerCase()
        .includes(deferredSearch.toLowerCase()),
  )

  return (
    <>
      <Container>
        <CampaignIntro
          eyebrow="The Energion collection"
          index="01"
          tone="black"
          lines={['Find your', 'kind of electric.']}
          description="City streets. New routes. Everyday adventures. Meet the lineup and discover the ride that moves you."
        />
        <div className="catalog-tools">
          <div className="filter-tabs" aria-label="Filter by category">
            {categories.map((item) => (
              <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>
                {item === 'All' ? 'All models' : item}
              </button>
            ))}
          </div>
          <label className="catalog-search">
            <Search aria-hidden="true" />
            <span className="sr-only">Search models</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Find your model"
            />
          </label>
        </div>
        <p className="mb-5 text-xs text-slate-500" role="status">
          {filtered.length} models {category !== 'All' ? ` / ${category}` : ''}
        </p>
        {query.isPending || query.isError ? (
          <CatalogState error={query.isError} retry={() => void query.refetch()} />
        ) : filtered.length ? (
          <div className="grid auto-rows-fr gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((product, index) => (
              <Reveal key={product.id} delay={Math.min(index * 0.05, 0.2)} className="h-full">
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="status-panel">
            <h2>No matching models.</h2>
            <p>Try another model name or explore the full collection.</p>
            <button
              className="cta"
              onClick={() => {
                setSearch('')
                setCategory('All')
              }}
            >
              Reset filters
            </button>
          </div>
        )}
        <div className="section-space">
          <EnquiryCTA />
        </div>
      </Container>
    </>
  )
}
