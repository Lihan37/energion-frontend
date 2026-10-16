import { useEffect, useEffectEvent, type RefObject } from 'react'

export function useDialogFocus(
  open: boolean,
  ref: RefObject<HTMLDivElement | null>,
  onClose: () => void,
) {
  const close = useEffectEvent(onClose)
  useEffect(() => {
    if (!open) return
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const frame = requestAnimationFrame(() =>
      ref.current?.querySelector<HTMLElement>('button, a, input')?.focus(),
    )
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      if (event.key !== 'Tab') return
      const nodes = Array.from(
        ref.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, textarea, select, [tabindex="0"]',
        ) ?? [],
      ).filter((node) => node.getClientRects().length)
      const first = nodes[0]
      const last = nodes.at(-1)
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(frame)
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKey)
      previousFocus?.focus()
    }
  }, [open, ref])
}
