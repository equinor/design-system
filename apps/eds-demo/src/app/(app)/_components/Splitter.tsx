'use client'

import { Icon } from '@equinor/eds-core-react/next'
import { drag_handle } from '@equinor/eds-icons'
import {
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type RefObject,
} from 'react'

export const SPLIT = { min: 0.2, max: 0.8, initial: 0.5, step: 0.05 }

const clamp = (value: number) => Math.min(SPLIT.max, Math.max(SPLIT.min, value))

type SplitterProps = {
  /** What the splitter resizes, such as "Resize the frame and the editor" */
  label: string
  /** vertical: side by side. horizontal: stacked */
  orientation: 'vertical' | 'horizontal'
  /** The first part's share of the space, from SPLIT.min to SPLIT.max */
  value: number
  onChange: (value: number) => void
  onDragging: (dragging: boolean) => void
  /** The element the two parts share */
  container: RefObject<HTMLElement | null>
}

/** The divider between two parts, such as the frame and the editor. Drag
 * it, move it with the arrow keys, Home and End, or double-click it to share
 * the space evenly. */
export function Splitter({
  label,
  orientation,
  value,
  onChange,
  onDragging,
  container,
}: SplitterProps) {
  const [dragging, setDragging] = useState(false)
  const vertical = orientation === 'vertical'

  const fromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const rect = container.current?.getBoundingClientRect()
    if (!rect) return
    onChange(
      clamp(
        vertical
          ? (event.clientX - rect.left) / rect.width
          : (event.clientY - rect.top) / rect.height,
      ),
    )
  }

  const setDrag = (next: boolean) => {
    setDragging(next)
    onDragging(next)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const decrease = vertical ? 'ArrowLeft' : 'ArrowUp'
    const increase = vertical ? 'ArrowRight' : 'ArrowDown'
    const next =
      event.key === decrease
        ? value - SPLIT.step
        : event.key === increase
          ? value + SPLIT.step
          : event.key === 'Home'
            ? SPLIT.min
            : event.key === 'End'
              ? SPLIT.max
              : null
    if (next === null) return
    event.preventDefault()
    onChange(clamp(next))
  }

  return (
    // A focusable separator with a value is the WAI-ARIA window splitter
    // pattern, an interactive widget; jsx-a11y treats every separator as
    // static.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      className="splitter"
      role="separator"
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      aria-label={label}
      aria-orientation={orientation}
      aria-valuemin={SPLIT.min * 100}
      aria-valuemax={SPLIT.max * 100}
      aria-valuenow={Math.round(value * 100)}
      data-orientation={orientation}
      data-dragging={dragging || undefined}
      onPointerDown={(event) => {
        if (event.button !== 0) return
        event.currentTarget.setPointerCapture(event.pointerId)
        setDrag(true)
      }}
      onPointerMove={(event) => {
        if (dragging) fromPointer(event)
      }}
      onPointerUp={(event) => {
        event.currentTarget.releasePointerCapture(event.pointerId)
        setDrag(false)
      }}
      onPointerCancel={() => setDrag(false)}
      onDoubleClick={() => onChange(SPLIT.initial)}
      onKeyDown={onKeyDown}
    >
      <Icon data={drag_handle} className="splitter-handle" />
    </div>
  )
}
