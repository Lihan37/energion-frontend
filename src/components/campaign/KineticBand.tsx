import { useInView, useReducedMotion } from 'framer-motion'
import { Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export function KineticBand() {
  const ref = useRef<HTMLDivElement>(null)
  const phraseRef = useRef<HTMLSpanElement>(null)
  const [copies, setCopies] = useState(4)
  const inView = useInView(ref)
  const reduced = useReducedMotion()
  const [playing, setPlaying] = useState(true)
  useEffect(() => {
    const band = ref.current
    const phrase = phraseRef.current
    if (!band || !phrase || !window.ResizeObserver) return
    const observer = new ResizeObserver(() => {
      const phraseWidth = phrase.getBoundingClientRect().width
      if (phraseWidth > 0) setCopies(Math.max(2, Math.ceil(band.clientWidth / phraseWidth) + 1))
    })
    observer.observe(band)
    observer.observe(phrase)
    return () => observer.disconnect()
  }, [])
  return (
    <div ref={ref} className={`kinetic-band ${playing && inView && !reduced ? 'is-running' : ''}`}>
      <span className="sr-only">EZ GO. A Homegrown Electric Brand.</span>
      <div className="kinetic-track" aria-hidden="true" style={{ animationDuration: `${copies * 20}s` }}>
        {[0, 1].map((index) => (
          <div className="kinetic-group" key={index}>
            {Array.from({ length: copies }, (_, copy) => (
              <span ref={index === 0 && copy === 0 ? phraseRef : undefined} key={copy}>
                EZ GO <i>↗</i> A HOMEGROWN ELECTRIC BRAND <i>↗</i>
              </span>
            ))}
          </div>
        ))}
      </div>
      {!reduced && (
        <button
          className="kinetic-toggle"
          onClick={() => setPlaying((value) => !value)}
          aria-label={playing ? 'Pause moving text' : 'Play moving text'}
        >
          {playing ? <Pause size={14} /> : <Play size={14} />}
        </button>
      )}
    </div>
  )
}
