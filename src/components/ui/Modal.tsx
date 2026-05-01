import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, type PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

import { cn } from '../../lib/cn'

interface ModalProps extends PropsWithChildren {
  isOpen: boolean
  onClose: () => void
  title: string
  className?: string
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={cn(
              'surface-card max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/40 shadow-[0_28px_90px_rgba(8,17,31,0.32)]',
              className,
            )}
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={(event) => event.stopPropagation()}
            aria-modal="true"
            role="dialog"
            aria-label={title}
          >
            <div className="flex items-center justify-between border-b border-[rgba(16,27,45,0.08)] px-6 py-4">
              <h3 className="font-display text-lg font-semibold text-slate-950">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex size-10 items-center justify-center rounded-full border border-[rgba(16,27,45,0.08)] bg-white/80 text-slate-700 transition hover:bg-white"
                aria-label="Close modal"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="max-h-[calc(92vh-72px)] overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
