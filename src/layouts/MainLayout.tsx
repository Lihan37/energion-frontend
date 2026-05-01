import { Outlet, ScrollRestoration } from 'react-router-dom'

import { Footer } from '../components/shared/Footer'
import { Navbar } from '../components/shared/Navbar'
import { PageTransition } from '../components/ui/PageTransition'

export function MainLayout() {
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
