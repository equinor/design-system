// Pixel-art lever sprite. 20×40 logical px. Two states: up and down.

type LeverProps = {
  label: string
  active: boolean
  onToggle: () => void
}

export function Lever({ label, active, onToggle }: LeverProps) {
  return (
    <button
      type="button"
      className={`lever ${active ? 'is-down' : ''}`}
      onClick={onToggle}
    >
      <svg
        className="lever-sprite"
        viewBox="0 0 20 40"
        shapeRendering="crispEdges"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* base plate */}
        <rect x={2} y={30} width={16} height={8} fill="#5f574f" />
        <rect x={2} y={30} width={16} height={1} fill="#83769c" />
        <rect x={2} y={37} width={16} height={1} fill="#1d2b53" />
        {/* pivot */}
        <rect x={8} y={28} width={4} height={4} fill="#1d2b53" />

        {active ? (
          <>
            {/* shaft angled forward (down position) */}
            <rect x={9} y={26} width={2} height={4} fill="#c2c3c7" />
            <rect x={11} y={24} width={2} height={2} fill="#c2c3c7" />
            <rect x={13} y={22} width={2} height={2} fill="#c2c3c7" />
            {/* knob */}
            <rect x={14} y={20} width={4} height={4} fill="#ff004d" />
            <rect x={15} y={21} width={2} height={1} fill="#fff1e8" />
          </>
        ) : (
          <>
            {/* shaft vertical (up position) */}
            <rect x={9} y={14} width={2} height={16} fill="#c2c3c7" />
            {/* knob */}
            <rect x={7} y={8} width={6} height={6} fill="#ff004d" />
            <rect x={8} y={9} width={3} height={2} fill="#fff1e8" />
          </>
        )}
      </svg>
      <span className="lever-label">{label}</span>
    </button>
  )
}
