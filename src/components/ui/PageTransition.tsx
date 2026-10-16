import { motion, useReducedMotion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import type { PropsWithChildren } from 'react'

export function PageTransition({ children }: PropsWithChildren) {
  const { pathname } = useLocation()
  const reduced = useReducedMotion()
  // An exiting Outlet also receives the new route context, duplicating forms.
  // A single immediate route mount keeps navigation and focus predictable.
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: reduced ? 1 : 0.85 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
    >
      {children}
    </motion.div>
  )
}
