import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, ScrollRestoration, useNavigation } from 'react-router-dom'

import { AdminSidebar } from '../components/admin/AdminSidebar'
import { PageTransition } from '../components/ui/PageTransition'
import { Reveal } from '../components/ui/Reveal'

export function AdminLayout() {
  const navigation = useNavigation()
  const isNavigating = navigation.state === 'loading'

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(49,94,230,0.18),transparent_26%),linear-gradient(180deg,#08111f_0%,#0d1627_100%)] px-4 py-4 sm:px-5 sm:py-5">
      <div className="grid min-h-[calc(100vh-2rem)] gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Reveal className="xl:h-full">
          <AdminSidebar />
        </Reveal>
        <PageTransition>
          <div className="space-y-5">
            <Outlet />
          </div>
        </PageTransition>
      </div>
      <AnimatePresence>
        {isNavigating ? (
          <motion.div
            key="admin-route-loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="pointer-events-none fixed inset-0 z-[70] bg-slate-950/22 backdrop-blur-[2px]"
          >
            <div className="flex h-full items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="rounded-full border border-white/10 bg-white/8 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(8,17,31,0.22)] backdrop-blur-xl"
              >
                <span className="inline-flex items-center gap-3">
                  <span className="size-2.5 animate-pulse rounded-full bg-[var(--brand-end)]" />
                  Loading workspace
                </span>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <ScrollRestoration />
    </div>
  )
}
