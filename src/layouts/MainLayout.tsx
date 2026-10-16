import { useEffect } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import { Footer } from '../components/shared/Footer'
import { Navbar } from '../components/shared/Navbar'
import { PageTransition } from '../components/ui/PageTransition'
import { prefetchAllRoutes } from '../app/routePrefetch'
import { PageMetadata } from '../components/shared/PageMetadata'

export function MainLayout() {
  const { pathname } = useLocation()
  useEffect(() => {
    prefetchAllRoutes()
  }, [])
  return (
    <div className="site-shell public-page">
      <PageMetadata />
      <Navbar />
      <main id="main-content" className={pathname === '/' ? '' : 'pt-20'}>
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  )
}
