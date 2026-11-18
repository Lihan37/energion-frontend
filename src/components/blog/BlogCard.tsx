import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Blog } from '../../types/blog'
import { SmoothImage } from '../ui/SmoothImage'

export function BlogCard({ blog }: { blog: Blog }) {
  return (
    <article className="journal-card">
      <div className="flex justify-between pt-4 text-[10px] uppercase tracking-widest text-slate-500">
        <span>{blog.category}</span>
        <span>{blog.readTime}</span>
      </div>
      <Link to={`/blog/${blog.slug}`} aria-label={`Read ${blog.title}`}>
        <figure>
          <div className="journal-image">
            <SmoothImage src={blog.coverImage} alt={blog.coverAlt ?? ''} className="h-full w-full object-cover" />
          </div>
          {blog.aiIllustration && <figcaption className="editorial-image-credit">AI-generated illustration</figcaption>}
        </figure>
        <h3>{blog.title}</h3>
      </Link>
      <p>{blog.excerpt}</p>
      <Link to={`/blog/${blog.slug}`} className="text-link mt-5">
        Read the story <ArrowUpRight size={15} />
      </Link>
    </article>
  )
}
