import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { CatalogState } from '../components/ui/CatalogState'
import { SmoothImage } from '../components/ui/SmoothImage'
import { getBlogBySlug } from '../services/blogService'
import { CampaignHeading } from '../components/campaign/CampaignHeading'

export function BlogDetailsPage() {
  const { slug = '' } = useParams()
  const query = useQuery({ queryKey: ['blog', slug], queryFn: () => getBlogBySlug(slug) })
  useEffect(() => {
    if (!query.data) return
    document.title = `${query.data.title} | Energion journal`
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (description) description.content = query.data.excerpt
    const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]')
    if (ogTitle) ogTitle.content = document.title
  }, [query.data])
  if (query.isPending || query.isError)
    return (
      <Container className="py-16">
        <CatalogState error={query.isError} retry={() => void query.refetch()} />
      </Container>
    )
  const blog = query.data
  if (!blog)
    return (
      <Container className="py-16">
        <div className="status-panel">
          <h1 className="section-title">Story not found.</h1>
          <Link to="/blog" className="text-link">
            Back to the journal
          </Link>
        </div>
      </Container>
    )
  return (
    <Container>
      <article className="article-layout pb-20">
        <div className="page-intro article-campaign-intro">
          <Link to="/blog" className="text-link mb-8">
            <ArrowLeft size={15} /> The journal
          </Link>
          <div>
            <span className="eyebrow">{blog.category}</span>
          </div>
          <CampaignHeading as="h1" lines={[blog.title]} className="section-title my-5" />
          <p className="body-copy">{blog.excerpt}</p>
          <div className="mt-5 flex flex-wrap gap-4 text-xs text-slate-500">
            <span>{blog.author}</span>
            <time dateTime={blog.publishedAt}>
              {new Date(blog.publishedAt).toLocaleDateString('en-GB')}
            </time>
            <span>{blog.readTime}</span>
          </div>
        </div>
        <SmoothImage src={blog.coverImage} alt="" loading="eager" className="article-cover" />
        <div className="prose-rich space-y-10">
          {blog.content.map((section) => (
            <section key={section.heading} className="space-y-4">
              <h2 className="text-4xl font-medium">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets && (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </article>
    </Container>
  )
}
