import { useEffect } from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'

import { Footer } from '../components/shared/Footer'
import { Navbar } from '../components/shared/Navbar'
import { PageTransition } from '../components/ui/PageTransition'
import { prefetchAllRoutes } from '../app/routePrefetch'

export function MainLayout() {
  // Warm every route's JS chunk while the browser is idle so switching pages
  // no longer stalls on a download before the new page can render.
  useEffect(() => {
    prefetchAllRoutes()
  }, [])

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="pt-20">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  )
}
