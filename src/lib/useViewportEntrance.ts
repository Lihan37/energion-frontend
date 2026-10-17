import { useEffect, useEffectEvent, useRef } from 'react'

import { campaignEase } from './campaignMotion'

interface EntranceOptions {
  keyframes: Keyframe[]
  duration?: number
  delay?: number
  stagger?: number
  once?: boolean
  amount?: number
  selector?: string
  disabled?: boolean | null
}

// Content is visible at rest. The observer only enhances its entrance, never
// controls whether it can be read; interrupted/unsupported animations fail open.
export function useViewportEntrance<T extends HTMLElement>({
  keyframes,
  duration = 600,
  delay = 0,
  stagger = 0,
  once = true,
  amount = 0,
  selector,
  disabled,
}: EntranceOptions) {
  const ref = useRef<T>(null)
  const animations = useRef(new Set<Animation>())
  const enter = useEffectEvent((root: T) => {
    const targets = selector ? [...root.querySelectorAll<HTMLElement>(selector)] : [root]
    targets.forEach((target, index) => {
      if (typeof target.animate !== 'function') return
      try {
        const animation = target.animate(keyframes, {
          duration,
          delay: delay + index * stagger,
          easing: `cubic-bezier(${campaignEase.join(',')})`,
          fill: 'backwards',
        })
        animations.current.add(animation)
        void animation.finished.then(
          () => animations.current.delete(animation),
          () => animations.current.delete(animation),
        )
      } catch {
        // Optional visual effects must not make the underlying content disappear.
      }
    })
  })

  useEffect(() => {
    const root = ref.current
    const running = animations.current
    if (disabled || !root || typeof IntersectionObserver === 'undefined') return
    let observer: IntersectionObserver
    try {
      observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return
          enter(root)
          if (once) observer.disconnect()
        },
        // Observe the stationary wrapper, not a masked/transformed text line.
        { threshold: Math.min(Math.max(amount, 0), 0.1), rootMargin: '0px 0px 80px 0px' },
      )
      observer.observe(root)
    } catch {
      return
    }
    return () => {
      observer.disconnect()
      running.forEach((animation) => animation.cancel())
      running.clear()
    }
  }, [disabled, once, amount])

  return ref
}
