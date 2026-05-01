import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { Blog } from '../../types/blog'
import { Badge } from '../ui/Badge'

interface BlogCardProps {
  blog: Blog
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <article className="group surface-card overflow-hidden rounded-[2rem] border border-[rgba(16,27,45,0.08)] shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-1">
      <div className="relative h-64 overflow-hidden">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-5 top-5">
          <Badge tone="gradient">{blog.category}</Badge>
        </div>
      </div>
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
          <span>{blog.readTime}</span>
        </div>
        <div>
          <h3 className="font-display text-2xl font-semibold text-slate-950">{blog.title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">{blog.excerpt}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">{blog.author}</span>
          <Link
            to={`/blog/${blog.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-start)]"
          >
            Read article
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}
