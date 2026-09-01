import { useEffect, useRef } from 'react'

import type { DotFieldProps } from './DotField.types'

import './dot-field.css'

/**
 * The EDS dot grid, for hero bands and any similar full-bleed surface: 2px dots
 * on an 18px pitch at 50% of the accent icon colour, with a pointer-following
 * spotlight that lifts nearby dots to 100%.
 *
 * Render it as a child of the band and give the band `docs-dot-host`, which
 * makes it the positioning context. The field listens on that host rather than
 * on itself, so the spotlight tracks the pointer anywhere in the band — the
 * field is `pointer-events: none` and would never see the events otherwise.
 *
 *     <header className="my-band docs-dot-host">
 *       <DotField />
 *       …
 *     </header>
 *
 * Bands that cannot host an element (markdown-driven ones) can set
 * `background-image: var(--docs-dot-grid)` instead, which gives the resting
 * grid without the spotlight.
 */
export function DotField({ className }: DotFieldProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const field = ref.current
    const host = field?.parentElement
    if (!field || !host) return

    /* The spotlight position goes straight to custom properties rather than to
       state — pointermove fires far too often to re-render on, and the field is
       the only thing that reads it. */
    let frame = 0
    const track = ({ clientX, clientY }: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const { left, top } = field.getBoundingClientRect()
        field.style.setProperty('--docs-dot-x', `${clientX - left}px`)
        field.style.setProperty('--docs-dot-y', `${clientY - top}px`)
      })
    }

    host.addEventListener('pointermove', track, { passive: true })
    return () => {
      host.removeEventListener('pointermove', track)
      cancelAnimationFrame(frame)
    }
  }, [])

  const classes = ['docs-dot-field', className].filter(Boolean).join(' ')

  return <div ref={ref} className={classes} aria-hidden="true" />
}

DotField.displayName = 'DotField'
