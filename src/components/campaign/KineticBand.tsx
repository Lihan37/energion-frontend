import { useInView, useReducedMotion } from 'framer-motion'
import { Pause, Play } from 'lucide-react'
import { useRef, useState } from 'react'

export function KineticBand() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const reduced = useReducedMotion()
  const [playing, setPlaying] = useState(true)
  return (
    <div ref={ref} className={`kinetic-band ${playing && inView && !reduced ? 'is-running' : ''}`}>
      <span className="sr-only">Electric by nature. Energion by choice.</span>
      <div className="kinetic-track" aria-hidden="true">
        {[0, 1].map((index) => (
          <span key={index}>
            ELECTRIC BY NATURE <i>↗</i> ENERGION BY CHOICE <i>↗</i>&nbsp;
          </span>
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
