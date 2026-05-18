import { useEffect, useState } from 'react'

// Walking token character. 16×24 logical px. 4-frame cycle at 8 fps.
// Frames 0/2 = both feet grounded. Frames 1/3 = alternate foot lifted 1px.
//
// The token wears no insignia yet — Phase 2 has no transforms applied.
// Later phases will dress it up (prefix label after Transform Bench,
// format ribbons after Format Splitter, etc.).

const FRAME_MS = 125

export function Token() {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => setFrame((f) => (f + 1) % 4), FRAME_MS)
    return () => window.clearInterval(id)
  }, [])

  // Foot lift offsets per frame
  const leftFootY = frame === 3 ? 20 : 21
  const rightFootY = frame === 1 ? 20 : 21
  // tiny head/body bob on the active stride frames
  const bob = frame === 1 || frame === 3 ? -1 : 0

  return (
    <svg
      className="token-sprite"
      viewBox="0 0 16 24"
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* head */}
      <rect x={4} y={2 + bob} width={8} height={7} fill="#fff1e8" />
      <rect x={4} y={2 + bob} width={8} height={1} fill="#c2c3c7" />
      {/* eyes */}
      <rect x={6} y={4 + bob} width={1} height={1} fill="#1d2b53" />
      <rect x={9} y={4 + bob} width={1} height={1} fill="#1d2b53" />
      {/* mouth */}
      <rect x={7} y={6 + bob} width={2} height={1} fill="#1d2b53" />

      {/* body — token "coin" coloured */}
      <rect x={3} y={9 + bob} width={10} height={9} fill="#ffec27" />
      <rect x={3} y={9 + bob} width={10} height={1} fill="#ffa300" />
      <rect x={3} y={17 + bob} width={10} height={1} fill="#ffa300" />

      {/* arms */}
      <rect x={2} y={11 + bob} width={1} height={4} fill="#fff1e8" />
      <rect x={13} y={11 + bob} width={1} height={4} fill="#fff1e8" />

      {/* legs */}
      <rect x={5} y={18} width={2} height={3} fill="#5f574f" />
      <rect x={9} y={18} width={2} height={3} fill="#5f574f" />
      {/* feet */}
      <rect x={4} y={leftFootY} width={3} height={2} fill="#ffa300" />
      <rect x={9} y={rightFootY} width={3} height={2} fill="#ffa300" />
    </svg>
  )
}
