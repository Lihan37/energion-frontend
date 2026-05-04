import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import scooty from '../../assets/scooty.png'

const INTRO_DURATION_MS = 4800

export function SiteIntroLoader() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setIsVisible(false)
    }, INTRO_DURATION_MS)

    return () => window.clearTimeout(timeout)
  }, [])

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#eaf2fb_100%)]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.38, ease: 'easeOut' }}
          aria-label="Loading Energion E-Mobility"
          role="status"
        >
          <div className="absolute inset-x-0 top-1/2 h-px bg-[linear-gradient(90deg,transparent,rgba(37,99,235,0.28),transparent)]" />
          <motion.div
            className="absolute left-0 top-1/2 flex -translate-y-1/2 items-end"
            initial={{ x: '-45vw' }}
            animate={{ x: '112vw' }}
            transition={{ duration: 4.65, ease: [0.45, 0, 0.2, 1] }}
          >
            <motion.div
              className="absolute bottom-1 left-[15%] h-5 w-[72%] rounded-full bg-slate-950/18 blur-md"
              animate={{ scaleX: [0.7, 1.08, 0.72], opacity: [0.35, 0.58, 0.24] }}
              transition={{ duration: 0.42, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.img
              src={scooty}
              alt=""
              className="relative z-10 w-44 max-w-none object-contain sm:w-56 md:w-64"
              animate={{ y: [0, -7, 0], rotate: [0, -1.2, 0.8, 0] }}
              transition={{ duration: 0.34, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>

          <motion.div
            className="absolute inset-x-6 bottom-10 mx-auto max-w-sm text-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, delay: 0.18 }}
          >
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand-start)]">
              Energion E-Mobility
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-200">
              <motion.div
                className="h-full rounded-full bg-brand-gradient"
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: 4.65, ease: [0.45, 0, 0.2, 1] }}
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
