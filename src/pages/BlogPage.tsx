import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useDeferredValue, useState } from 'react'
import { BlogCard } from '../components/blog/BlogCard'
import { Container } from '../components/ui/Container'
import { CatalogState } from '../components/ui/CatalogState'
import { getBlogs } from '../services/blogService'

export function BlogPage() {
  const [search, setSearch] = useState('')
  const deferred = useDeferredValue(search)
  const [category, setCategory] = useState('All')
  const query = useQuery({ queryKey: ['blogs'], queryFn: getBlogs })
  const blogs = query.data ?? []
  const categories = ['All', ...new Set(blogs.map((blog) => blog.category))]
  const filtered = blogs.filter(
    (blog) =>
      (category === 'All' || blog.category === category) &&
      `${blog.title} ${blog.excerpt}`.toLowerCase().includes(deferred.toLowerCase()),
  )
  return (
    <Container>
      <div className="page-intro">
        <span className="eyebrow">The Energion journal</span>
        <h1 className="display-title">
          Ideas in
          <br />
          motion.
        </h1>
        <p className="body-copy">
          Explore electric mobility, get to know your ride and discover a different way forward.
        </p>
      </div>
      <div className="catalog-tools">
        <div className="filter-tabs">
          {categories.map((item) => (
            <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>
              {item === 'All' ? 'All stories' : item}
            </button>
          ))}
        </div>
        <label className="catalog-search">
          <Search aria-hidden="true" />
          <span className="sr-only">Search stories</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Find a story"
          />
        </label>
      </div>
      <div className="pb-20">
        {query.isPending || query.isError ? (
          <CatalogState error={query.isError} retry={() => void query.refetch()} />
        ) : filtered.length ? (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="status-panel">
            <h2>No matching stories.</h2>
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
      </div>
    </Container>
  )
}
