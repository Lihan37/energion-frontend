import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'

import { BlogCard } from '../components/blog/BlogCard'
import { Badge } from '../components/ui/Badge'
import { Container } from '../components/ui/Container'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingState } from '../components/ui/LoadingState'
import { SectionHeading } from '../components/ui/SectionHeading'
import { getBlogs } from '../services/blogService'

const filters = ['All', 'Company', 'Technology', 'Guides'] as const

export function BlogPage() {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>('All')
  const blogsQuery = useQuery({ queryKey: ['blogs'], queryFn: getBlogs })

  const filteredBlogs = useMemo(() => {
    const blogs = blogsQuery.data ?? []
    return blogs.filter((blog) => {
      const matchesQuery =
        blog.title.toLowerCase().includes(query.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(query.toLowerCase())
      const matchesFilter = activeFilter === 'All' || blog.category === activeFilter
      return matchesQuery && matchesFilter
    })
  }, [activeFilter, blogsQuery.data, query])

  return (
    <div className="py-16">
      <Container className="space-y-10">
        <div className="surface-card rounded-[2.4rem] border border-[rgba(16,27,45,0.08)] px-6 py-8 shadow-[var(--shadow-soft)] sm:px-8">
          <SectionHeading
            eyebrow="Blog"
            title="Admin-ready publishing frontend with polished discovery and a clean reading experience."
            description="When backend APIs arrive, this page can swap from dummy content to live posts without changing the presentation structure."
          />
          <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search blog posts"
                className="h-14 w-full rounded-full border border-[rgba(16,27,45,0.08)] bg-white/90 pl-12 pr-5 outline-none transition focus:border-[rgba(49,94,230,0.32)] focus:ring-4 focus:ring-[rgba(49,94,230,0.08)]"
              />
            </label>
            <div className="flex flex-wrap gap-3">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
                    activeFilter === filter
                      ? 'bg-brand-gradient text-white'
                      : 'border border-[rgba(16,27,45,0.08)] bg-white/85 text-slate-700'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-900">{filteredBlogs.length}</span> articles
          </div>
          <Badge>{activeFilter === 'All' ? 'All posts' : activeFilter}</Badge>
        </div>

        {blogsQuery.isLoading ? (
          <LoadingState label="Loading blog posts..." />
        ) : filteredBlogs.length ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No articles found."
            description="Try a simpler search term or reset the category filter to reveal more posts."
          />
        )}
      </Container>
    </div>
  )
}
