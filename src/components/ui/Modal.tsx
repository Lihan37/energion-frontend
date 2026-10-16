import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useRef, type PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'
import { useDialogFocus } from '../../lib/useDialogFocus'

interface ModalProps extends PropsWithChildren {
  isOpen: boolean
  onClose: () => void
  title: string
  className?: string
}
export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  useDialogFocus(isOpen, dialogRef, onClose)
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/70 p-3 backdrop-blur-sm sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.2 }}
          onClick={onClose}
        >
          <motion.div
            ref={dialogRef}
            className={cn(
              'flex max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden rounded-lg bg-surface-50 shadow-2xl',
              className,
            )}
            initial={{ y: reduced ? 0 : 20 }}
            animate={{ y: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-black/10 px-5 py-3">
              <span className="font-display text-xl font-semibold uppercase">{title}</span>
              <button
                type="button"
                className="icon-button"
                onClick={onClose}
                aria-label="Close modal"
              >
                <X size={19} />
              </button>
            </div>
            <div className="min-h-0 overflow-y-auto overscroll-contain">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
