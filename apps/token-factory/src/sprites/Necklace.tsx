import './necklace.css'

// Pixel-art necklace sprite. 48×40 logical px.
// Four states for the assembly sequence:
//   none   — empty bench
//   gem    — gemstone alone
//   cord   — gemstone + cord
//   full   — gemstone + cord + clasp (complete necklace)
//
// The gemstone fill colour mirrors --eds-color-bg-accent-fill-emphasis-default
// at the centre of the stone — the "real EDS value at full fidelity" inside
// pixel-art chrome (the world-vs-content rule).

export type NecklaceState = 'none' | 'gem' | 'cord' | 'full'

export function Necklace({ state }: { state: NecklaceState }) {
  if (state === 'none') {
    return <svg className="necklace-sprite" viewBox="0 0 48 40" />
  }

  return (
    <svg
      className="necklace-sprite"
      viewBox="0 0 48 40"
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* CORD: dark grey strand looping around top */}
      {(state === 'cord' || state === 'full') && (
        <>
          <rect x={10} y={8} width={2} height={2} fill="#5f574f" />
          <rect x={12} y={6} width={2} height={2} fill="#5f574f" />
          <rect x={14} y={5} width={4} height={1} fill="#5f574f" />
          <rect x={18} y={4} width={12} height={1} fill="#5f574f" />
          <rect x={30} y={5} width={4} height={1} fill="#5f574f" />
          <rect x={34} y={6} width={2} height={2} fill="#5f574f" />
          <rect x={36} y={8} width={2} height={2} fill="#5f574f" />
        </>
      )}

      {/* CLASP: small metal piece at top of cord */}
      {state === 'full' && (
        <>
          <rect x={22} y={2} width={4} height={3} fill="#fff1e8" />
          <rect x={23} y={3} width={2} height={1} fill="#c2c3c7" />
        </>
      )}

      {/* GEMSTONE: faceted teal jewel — the token incarnate.
          Inner core uses the real --eds-color-bg-accent-fill-emphasis-default
          via CSS, so it stays accurate to the actual published colour. */}
      <g>
        {/* outer facets — pixel-art teal gradient */}
        <rect x={18} y={14} width={12} height={2} fill="#1a4a52" />
        <rect x={16} y={16} width={16} height={2} fill="#206f77" />
        <rect x={14} y={18} width={20} height={8} fill="#287a83" />
        <rect x={16} y={26} width={16} height={2} fill="#206f77" />
        <rect x={18} y={28} width={12} height={2} fill="#1a4a52" />

        {/* inner highlight */}
        <rect x={20} y={18} width={4} height={2} fill="#7cbac1" />
        <rect x={18} y={20} width={2} height={2} fill="#7cbac1" />

        {/* outer border (pixel highlight + shadow) */}
        <rect x={18} y={14} width={12} height={1} fill="#7cbac1" />
        <rect x={30} y={16} width={1} height={10} fill="#15363c" />
        <rect x={16} y={26} width={16} height={1} fill="#15363c" />
      </g>
    </svg>
  )
}
