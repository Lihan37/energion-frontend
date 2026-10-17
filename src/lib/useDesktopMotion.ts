import { useSyncExternalStore } from 'react'

const query = '(min-width: 1024px) and (hover: hover) and (prefers-reduced-motion: no-preference)'
function subscribe(callback: () => void) {
  const media = window.matchMedia(query)
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}
function snapshot() {
  return window.matchMedia(query).matches
}

export function useDesktopMotion() {
  return useSyncExternalStore(subscribe, snapshot, () => false)
}
