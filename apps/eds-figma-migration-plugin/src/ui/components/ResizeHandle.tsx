import { useRef } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'
import { clampSize } from '../../shared/window'
import { send } from '../figma'

/** How far one arrow key press resizes the window. */
const STEP = 40

type Drag = { x: number; y: number; width: number; height: number }

/**
 * The grip in the bottom right corner that makes the window wider, narrower,
 * taller or shorter. Figma plugin windows cannot be resized by hand, so the
 * grip sends the size to the main thread, which resizes the window and keeps
 * the size for the next time. Screen coordinates are used because the window
 * grows under the pointer while it is dragged. The arrow keys do the same.
 */
export function ResizeHandle() {
  const drag = useRef<Drag | null>(null)
  const frame = useRef(0)
  // The size last asked for: the window takes a moment to follow, so quick
  // key presses add up from here rather than from the window's size.
  const asked = useRef<{ width: number; height: number } | null>(null)

  const resize = (width: number, height: number, done: boolean) => {
    const size = clampSize(width, height)
    asked.current = size
    send({ type: 'resize', ...size, done })
  }

  const sizeAt = (event: PointerEvent<HTMLButtonElement>) => {
    const start = drag.current
    if (!start) return undefined
    return {
      width: start.width + event.screenX - start.x,
      height: start.height + event.screenY - start.y,
    }
  }

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    asked.current = null
    drag.current = {
      x: event.screenX,
      y: event.screenY,
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const size = sizeAt(event)
    if (!size) return
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() =>
      resize(size.width, size.height, false),
    )
  }

  const onPointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    const size = sizeAt(event)
    drag.current = null
    cancelAnimationFrame(frame.current)
    if (size) resize(size.width, size.height, true)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const moves: Record<string, [number, number]> = {
      ArrowRight: [STEP, 0],
      ArrowLeft: [-STEP, 0],
      ArrowDown: [0, STEP],
      ArrowUp: [0, -STEP],
    }
    const move = moves[event.key]
    if (!move) return
    event.preventDefault()
    const base = asked.current ?? {
      width: window.innerWidth,
      height: window.innerHeight,
    }
    resize(base.width + move[0], base.height + move[1], true)
  }

  return (
    <button
      type="button"
      className="resize-handle"
      aria-label="Resize the window. Arrow keys make it wider, narrower, taller or shorter."
      title="Drag to resize the window"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
    >
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M15 6 6 15M15 10l-5 5M15 14l-1 1" />
      </svg>
    </button>
  )
}
