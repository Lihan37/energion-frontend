/**
 * Warm the lazily-loaded route chunks so navigation feels instant.
 *
 * Each entry uses the SAME import specifier as the router, so Vite serves the
 * exact same chunk — calling these just moves the download earlier (on link
 * hover/focus, or while the browser is idle) instead of on click.
 */
const routeLoaders: Record<string, () => Promise<unknown>> = {
  '/': () => import('../pages/HomePage'),
  '/products': () => import('../pages/ProductsPage'),
  '/blog': () => import('../pages/BlogPage'),
  '/about': () => import('../pages/AboutPage'),
  '/contact': () => import('../pages/ContactPage'),
  '/map': () => import('../pages/MapPage'),
  '/auth': () => import('../pages/AuthPage'),
}

const prefetched = new Set<string>()

export function prefetchRoute(path: string) {
  if (prefetched.has(path)) return
  const loader = routeLoaders[path]
  if (!loader) return
  prefetched.add(path)
  // Swallow errors: a failed prefetch must never surface to the user; the real
  // navigation will retry the import and handle failures itself.
  void loader().catch(() => prefetched.delete(path))
}

/** Prefetch every route while the browser is idle, after the first paint. */
export function prefetchAllRoutes() {
  const run = () => {
    for (const path of Object.keys(routeLoaders)) prefetchRoute(path)
  }

  const ric = (window as unknown as {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
  }).requestIdleCallback

  if (typeof ric === 'function') {
    ric(run, { timeout: 2500 })
  } else {
    window.setTimeout(run, 1200)
  }
}
