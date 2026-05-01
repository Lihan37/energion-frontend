import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingState } from '../components/ui/LoadingState'
import { getBlogBySlug } from '../services/blogService'

export function BlogDetailsPage() {
  const { slug = '' } = useParams()
  const blogQuery = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => getBlogBySlug(slug),
  })

  if (blogQuery.isLoading) {
    return (
      <div className="py-16">
        <Container>
          <LoadingState label="Loading article..." />
        </Container>
      </div>
    )
  }

  if (!blogQuery.data) {
    return (
      <div className="py-16">
        <Container>
          <EmptyState
            title="Article not found."
            description="This route is ready for backend-managed blog content, but the requested article does not exist in the current data set."
          />
        </Container>
      </div>
    )
  }

  const blog = blogQuery.data

  return (
    <div className="py-16">
      <Container className="max-w-5xl space-y-8">
        <Link to="/blog" className="inline-flex">
          <Button variant="secondary">
            <ArrowLeft className="mr-2 size-4" />
            Back to blog
          </Button>
        </Link>

        <article className="surface-card overflow-hidden rounded-[2.5rem] border border-[rgba(16,27,45,0.08)] shadow-[var(--shadow-soft)]">
          <div className="relative h-[340px] overflow-hidden sm:h-[460px]">
            <img src={blog.coverImage} alt={blog.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
              <Badge tone="gradient">{blog.category}</Badge>
              <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {blog.title}
              </h1>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-200">
                <span>{blog.author}</span>
                <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                <span>{blog.readTime}</span>
              </div>
            </div>
          </div>

          <div className="prose-rich space-y-10 px-6 py-8 sm:px-10 sm:py-10">
            <p className="text-lg leading-8">{blog.excerpt}</p>
            {blog.content.map((section) => (
              <section key={section.heading} className="space-y-4">
                <h2 className="text-2xl font-semibold">{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets ? (
                  <ul>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </article>
      </Container>
    </div>
  )
}
