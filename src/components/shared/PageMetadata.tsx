import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../../services/productService'

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
  const isModel = pathname.startsWith('/products/')
  const query = useQuery({ queryKey: ['products'], queryFn: getProducts, enabled: isModel })
  let slug = ''
  try {
    slug = decodeURIComponent(pathname.slice('/products/'.length))
  } catch {
    /* Invalid URL gets the unavailable-model state. */
  }
  const product = isModel ? query.data?.find((item) => item.slug === slug) : undefined
  useEffect(() => {
    const [title, description] = product
      ? [product.name, product.shortDescription]
      : isModel
        ? [
            'Model details',
            'Explore the Energion electric vehicle collection and find your next ride.',
          ]
        : (metadata[pathname] ?? [
            'Energion journal',
            'Electric mobility stories from Energion E-Mobility.',
          ])
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
    setMeta('og:image', product?.image || 'https://energion-emobility.com/favicon.png', true)
    setMeta('robots', isModel && query.isSuccess && !product ? 'noindex, follow' : 'index, follow')
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.append(canonical)
    }
    canonical.href = `https://energion-emobility.com${pathname}`
  }, [pathname, product, isModel, query.isSuccess])
  return null
}
