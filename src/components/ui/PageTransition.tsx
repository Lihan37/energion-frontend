import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import type { PropsWithChildren } from 'react'

export function PageTransition({ children }: PropsWithChildren) {
  const location = useLocation()
  const prefersReducedMotion = useReducedMotion()

  // `popLayout` lets the incoming page take its place immediately while the old
  // one fades out on top — no "wait for exit" gap, so navigation feels instant.
  // Reduced-motion users get a plain, near-instant fade with no vertical shift.
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: prefersReducedMotion ? 0.12 : 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
