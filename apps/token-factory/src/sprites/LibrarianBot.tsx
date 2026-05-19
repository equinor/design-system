import { useEffect, useState } from 'react'
import './librarian-bot.css'

// Placeholder pixel mascot. Two-frame blink cycle via React state until
// Aseprite assets land. Rendered as inline SVG with shape-rendering=crispEdges
// so it stays pixel-pure at any scale.
export function LibrarianBot({ saying }: { saying?: string }) {
  const [blink, setBlink] = useState(false)

  useEffect(() => {
    let alive = true
    const loop = () => {
      if (!alive) return
      setBlink(true)
      window.setTimeout(() => alive && setBlink(false), 140)
    }
    const id = window.setInterval(loop, 2600)
    return () => {
      alive = false
      window.clearInterval(id)
    }
  }, [])

  return (
    <div className="librarian">
      <svg
        className="librarian-sprite"
        viewBox="0 0 24 32"
        shapeRendering="crispEdges"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* body */}
        <rect x="4" y="14" width="16" height="14" fill="#c2c3c7" />
        <rect x="4" y="14" width="16" height="2" fill="#fff1e8" />
        <rect x="4" y="26" width="16" height="2" fill="#5f574f" />
        {/* head */}
        <rect x="6" y="4" width="12" height="10" fill="#c2c3c7" />
        <rect x="6" y="4" width="12" height="1" fill="#fff1e8" />
        <rect x="6" y="13" width="12" height="1" fill="#5f574f" />
        {/* antenna */}
        <rect x="11" y="1" width="2" height="3" fill="#5f574f" />
        <rect x="10" y="0" width="4" height="1" fill="#ffec27" />
        {/* eyes */}
        {!blink ? (
          <>
            <rect x="9" y="8" width="2" height="2" fill="#1d2b53" />
            <rect x="13" y="8" width="2" height="2" fill="#1d2b53" />
          </>
        ) : (
          <>
            <rect x="9" y="9" width="2" height="1" fill="#1d2b53" />
            <rect x="13" y="9" width="2" height="1" fill="#1d2b53" />
          </>
        )}
        {/* book */}
        <rect x="2" y="18" width="4" height="6" fill="#7e2553" />
        <rect x="2" y="18" width="4" height="1" fill="#fff1e8" />
        <rect x="3" y="20" width="2" height="1" fill="#fff1e8" />
        {/* feet */}
        <rect x="6" y="28" width="4" height="2" fill="#5f574f" />
        <rect x="14" y="28" width="4" height="2" fill="#5f574f" />
      </svg>
      {saying && (
        <div className="librarian-bubble">
          <span>{saying}</span>
        </div>
      )}
    </div>
  )
}
