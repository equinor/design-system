import { useEffect, useState } from 'react'
import './station-log.css'

type Props = {
  lines: string[]
  maxVisible?: number
}

// Typewriter-effect log strip pinned to the bottom of the stage.
// Each new line types in one character at a time; older lines stay
// rendered (truncated to maxVisible).
export function StationLog({ lines, maxVisible = 3 }: Props) {
  const visible = lines.slice(-maxVisible)
  const last = visible[visible.length - 1] ?? ''
  const earlier = visible.slice(0, -1)

  const [typed, setTyped] = useState('')

  useEffect(() => {
    setTyped('')
    if (!last) return
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setTyped(last.slice(0, i))
      if (i >= last.length) window.clearInterval(id)
    }, 22)
    return () => window.clearInterval(id)
  }, [last])

  return (
    <div className="station-log">
      {earlier.map((line, idx) => (
        <div key={`${idx}-${line}`} className="log-line log-line-old">
          {line}
        </div>
      ))}
      {last && (
        <div className="log-line log-line-active">
          {typed}
          <span className="log-caret" />
        </div>
      )}
    </div>
  )
}
