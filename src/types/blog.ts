export interface Blog {
  id: string
  slug: string
  title: string
  excerpt: string
  content: Array<{
    heading: string
    paragraphs: string[]
    bullets?: string[]
  }>
  category: 'Company' | 'Technology' | 'Guides'
  author: string
  coverImage: string
  coverAlt?: string
  aiIllustration?: boolean
  publishedAt: string
  readTime: string
  featured?: boolean
}
