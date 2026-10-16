import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const metadata: Record<string, [string, string]> = {
  '/': [
    'Electric mobility, reimagined',
    'Discover Energion electric vehicles in Bangladesh. Explore models, specifications and your next electric ride.',
  ],
  '/products': [
    'Our electric bikes',
    'Explore the Energion electric vehicle lineup. Compare real battery, range and riding specifications, and enquire about your model.',
  ],
  '/about': [
    'About Energion',
    'Get to know Energion E-Mobility and our mission for reliable, accessible electric transportation.',
  ],
  '/contact': [
    'Contact Energion',
    'Talk to the Energion team about electric vehicles, model details and dealership enquiries.',
  ],
  '/map': ['Find a dealer', 'Find Energion dealer points by region across Bangladesh.'],
  '/blog': [
    'The Energion journal',
    'Stories and guides on electric mobility, everyday riding and Energion.',
  ],
  '/auth': ['Your Energion account', 'Sign in to your Energion E-Mobility account.'],
}

export function PageMetadata() {
  const { pathname } = useLocation()
  useEffect(() => {
    const [title, description] = metadata[pathname] ?? [
      'Energion journal',
      'Electric mobility stories from Energion E-Mobility.',
    ]
    document.title = `${title} | Energion E-Mobility`
    const setMeta = (key: string, value: string, property = false) => {
      const attribute = property ? 'property' : 'name'
      let node = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
      if (!node) {
        node = document.createElement('meta')
        node.setAttribute(attribute, key)
        document.head.append(node)
      }
      node.content = value
    }
    setMeta('description', description)
    setMeta('og:title', document.title, true)
    setMeta('og:description', description, true)
    setMeta('og:url', `https://energion-emobility.com${pathname}`, true)
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.append(canonical)
    }
    canonical.href = `https://energion-emobility.com${pathname}`
  }, [pathname])
  return null
}
