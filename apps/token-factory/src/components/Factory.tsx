import { Conveyor } from './Conveyor'
import { Token } from './Token'

// Phase 2 — empty factory floor. Background machinery silhouettes, a
// scrolling conveyor, and one token walking the full width. No stations
// active yet; this is the transport substrate that future phases plug
// into.

export function Factory() {
  return (
    <div className="factory">
      {/* far machinery silhouettes — static for now, parallax-ready */}
      <div className="machinery">
        <div className="pipe pipe-a" />
        <div className="pipe pipe-b" />
        <div className="tower tower-a" />
        <div className="tower tower-b" />
        <div className="tower tower-c" />
      </div>

      <Conveyor />

      <div className="token-walking">
        <Token />
      </div>
    </div>
  )
}
