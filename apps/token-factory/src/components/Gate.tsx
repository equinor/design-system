// Sliding gate on the factory wall. Two halves that part open vertically
// (top half slides up, bottom half slides down) when triggered.
// `open` is driven by the Dock scene's crate-journey state machine.

export function Gate({ open }: { open: boolean }) {
  return (
    <div className={`gate ${open ? 'is-open' : ''}`}>
      <div className="gate-half gate-top">
        <svg
          viewBox="0 0 20 12"
          shapeRendering="crispEdges"
          preserveAspectRatio="none"
        >
          <rect x={0} y={0} width={20} height={12} fill="#a86120" />
          <rect x={0} y={0} width={20} height={1} fill="#c87a30" />
          <rect x={0} y={3} width={20} height={1} fill="#5f3110" />
          <rect x={0} y={11} width={20} height={1} fill="#5f3110" />
          <rect x={0} y={6} width={20} height={1} fill="#5f3110" />
          <rect x={0} y={9} width={20} height={1} fill="#5f3110" />
        </svg>
      </div>
      <div className="gate-half gate-bottom">
        <svg
          viewBox="0 0 20 12"
          shapeRendering="crispEdges"
          preserveAspectRatio="none"
        >
          <rect x={0} y={0} width={20} height={12} fill="#a86120" />
          <rect x={0} y={0} width={20} height={1} fill="#5f3110" />
          <rect x={0} y={2} width={20} height={1} fill="#5f3110" />
          <rect x={0} y={5} width={20} height={1} fill="#5f3110" />
          <rect x={0} y={8} width={20} height={1} fill="#5f3110" />
          <rect x={0} y={11} width={20} height={1} fill="#5f3110" />
        </svg>
      </div>
    </div>
  )
}
