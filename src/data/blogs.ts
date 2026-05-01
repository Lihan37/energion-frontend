import type { Blog } from '../types/blog'

export const blogs: Blog[] = [
  {
    id: 'blog-01',
    slug: 'how-electric-bikes-are-changing-city-commutes',
    title: 'How Electric Bikes Are Changing City Commutes',
    excerpt:
      'Electric mobility is no longer a niche idea. It is becoming the most practical answer to crowded cities, rising fuel costs, and time lost in traffic.',
    category: 'Guides',
    author: 'Nadia Rahman',
    coverImage:
      'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2026-04-07',
    readTime: '6 min read',
    featured: true,
    content: [
      {
        heading: 'The shift to cleaner daily transport',
        paragraphs: [
          'Cities are becoming denser while roads are not growing at the same speed. For many commuters, that means more waiting, more frustration, and higher fuel costs.',
          'Electric bikes answer this by cutting through the inefficiency. They lower running costs, shorten many urban trips, and make everyday movement feel lighter instead of exhausting.',
        ],
      },
      {
        heading: 'Why riders stay with e-bikes after switching',
        paragraphs: [
          'Most first-time riders are drawn by convenience, but they stay because the routine changes. Parking becomes simple, small errands become fast, and short commutes stop feeling like wasted time.',
        ],
        bullets: [
          'Lower daily transport cost',
          'Less dependence on fuel and traffic',
          'A healthier but less tiring ride experience',
        ],
      },
    ],
  },
  {
    id: 'blog-02',
    slug: 'battery-care-tips-for-longer-range-and-better-performance',
    title: 'Battery Care Tips for Longer Range and Better Performance',
    excerpt:
      'Good battery habits protect range, extend component life, and keep your e-bike ready when your week gets busy.',
    category: 'Technology',
    author: 'Imran Hossain',
    coverImage:
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2026-03-29',
    readTime: '5 min read',
    content: [
      {
        heading: 'Charge smarter, not just more often',
        paragraphs: [
          'Modern lithium batteries reward consistency. Avoid leaving the bike at a full charge for extended periods in high heat, and use the original charger whenever possible.',
          'If the bike will sit unused for a while, keep the battery partially charged instead of fully topped up.',
        ],
      },
      {
        heading: 'Everyday range habits',
        paragraphs: [
          'Smooth acceleration, proper tire pressure, and choosing the right assist mode can noticeably improve range during the week without sacrificing ride quality.',
        ],
      },
    ],
  },
  {
    id: 'blog-03',
    slug: 'why-dealer-support-matters-when-buying-an-e-bike',
    title: 'Why Dealer Support Matters When Buying an E-Bike',
    excerpt:
      'A premium electric bike is not only about the frame and motor. Dealer support shapes the ownership experience long after the first ride.',
    category: 'Company',
    author: 'Energion Editorial',
    coverImage:
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2026-03-12',
    readTime: '4 min read',
    content: [
      {
        heading: 'Service confidence matters',
        paragraphs: [
          'Dealer networks make maintenance simpler, help with updates, and give riders direct access to parts and support. That reduces downtime and builds trust.',
        ],
      },
      {
        heading: 'The ownership layer buyers overlook',
        paragraphs: [
          'The right dealer can guide fit, setup, accessories, and diagnostics. For new riders especially, that guidance is a major part of the value of a premium brand.',
        ],
      },
    ],
  },
]
