import { useEffect, useState } from 'react'
import { LibrarianBot } from './LibrarianBot'

type Props = {
  lines: string[]
  /** When true, the narrator advances to the next line automatically
   *  after the current line finishes typing + a short hold. */
  autoAdvance?: boolean
  /** Bumped whenever the driver requests a skip — completes the current
   *  line instantly or advances to the next pending line. */
  skipTick?: number
  /** Emitted whenever the narrator moves to a new line. Scenes can use
   *  this to drive their visual state in lock-step with the narration. */
  onBeatChange?: (idx: number) => void
}

// Top-right narrator overlay. The librarian-bot is the same sprite as
// before, but the bubble below it types out narrator beats one at a
// time. Auto-types each line, holds, then types the next line in the
// same bubble.
const CHAR_MS = 28
const HOLD_MS = 1400

export function Narrator({
  lines,
  autoAdvance = true,
  skipTick = 0,
  onBeatChange,
}: Props) {
  const [lineIdx, setLineIdx] = useState(0)
  const [typed, setTyped] = useState('')

  // Reset when the line set changes (new scene).
  useEffect(() => {
    setLineIdx(0)
    setTyped('')
  }, [lines])

  // Notify the scene whenever lineIdx changes so its visuals can sync.
  useEffect(() => {
    onBeatChange?.(lineIdx)
  }, [lineIdx, onBeatChange])

  // Skip handler — completes current line if mid-typing, else advances.
  useEffect(() => {
    if (skipTick === 0) return
    const current = lines[lineIdx] ?? ''
    if (typed.length < current.length) {
      setTyped(current)
    } else if (lineIdx < lines.length - 1) {
      setLineIdx((i) => i + 1)
      setTyped('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipTick])

  // Type out the current line one character at a time.
  useEffect(() => {
    const current = lines[lineIdx] ?? ''
    if (typed.length >= current.length) return
    const id = window.setTimeout(() => {
      setTyped(current.slice(0, typed.length + 1))
    }, CHAR_MS)
    return () => window.clearTimeout(id)
  }, [lines, lineIdx, typed])

  // Auto-advance to the next line after the hold.
  useEffect(() => {
    if (!autoAdvance) return
    const current = lines[lineIdx] ?? ''
    if (typed.length < current.length) return
    if (lineIdx >= lines.length - 1) return
    const id = window.setTimeout(() => {
      setLineIdx((i) => i + 1)
      setTyped('')
    }, HOLD_MS)
    return () => window.clearTimeout(id)
  }, [autoAdvance, lines, lineIdx, typed])

  return (
    <div className="narrator">
      <LibrarianBot />
      {lines.length > 0 && (
        <div className="narrator-bubble">
          <span>{typed}</span>
          <span className="narrator-caret" />
        </div>
      )}
    </div>
  )
}
