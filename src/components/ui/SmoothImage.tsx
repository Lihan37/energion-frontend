import { useCallback } from 'react'
import type { ImgHTMLAttributes } from 'react'

import { cn } from '../../lib/cn'

/**
 * Image that lazy-loads and fades in once decoded, so cards and heroes never
 * pop in with a harsh flash. Handles the cached-image case via a ref callback
 * (where React's onLoad can miss an already-complete image).
 */
export function SmoothImage({ className, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const markLoaded = useCallback((el: HTMLImageElement | null) => {
    if (el?.complete) {
      el.classList.add('is-loaded')
    }
  }, [])

  return (
    <img
      ref={markLoaded}
      loading="lazy"
      decoding="async"
      onLoad={(event) => event.currentTarget.classList.add('is-loaded')}
      className={cn('img-fade', className)}
      {...props}
    />
  )
}
