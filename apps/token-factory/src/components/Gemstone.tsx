// Two-facet pixel-art gemstone. 36×36 logical px.
// Top half = light value (#ffffff). Bottom half = dark value (#202223).
// The seam between them is the visible result of the `light-dark()`
// fusion: one stone, two facets.

export function Gemstone() {
  return (
    <svg
      className="gemstone-sprite"
      viewBox="0 0 36 36"
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Light half (top) — diamond top */}
      <rect x={14} y={2} width={8} height={2} fill="#ffffff" />
      <rect x={12} y={4} width={12} height={2} fill="#ffffff" />
      <rect x={10} y={6} width={16} height={2} fill="#ffffff" />
      <rect x={8} y={8} width={20} height={2} fill="#ffffff" />
      <rect x={6} y={10} width={24} height={2} fill="#ffffff" />
      <rect x={4} y={12} width={28} height={2} fill="#ffffff" />
      <rect x={2} y={14} width={32} height={2} fill="#ffffff" />

      {/* light highlight (top-left edges) */}
      <rect x={14} y={2} width={8} height={1} fill="#fff1e8" />
      <rect x={12} y={4} width={2} height={2} fill="#fff1e8" />
      <rect x={10} y={6} width={2} height={2} fill="#fff1e8" />
      <rect x={8} y={8} width={2} height={2} fill="#fff1e8" />
      <rect x={6} y={10} width={2} height={2} fill="#fff1e8" />
      <rect x={4} y={12} width={2} height={2} fill="#fff1e8" />
      <rect x={2} y={14} width={2} height={2} fill="#fff1e8" />
      {/* light shadow (right edges) */}
      <rect x={22} y={4} width={2} height={2} fill="#c2c3c7" />
      <rect x={24} y={6} width={2} height={2} fill="#c2c3c7" />
      <rect x={26} y={8} width={2} height={2} fill="#c2c3c7" />
      <rect x={28} y={10} width={2} height={2} fill="#c2c3c7" />
      <rect x={30} y={12} width={2} height={2} fill="#c2c3c7" />
      <rect x={32} y={14} width={2} height={2} fill="#c2c3c7" />

      {/* Cut seam — yellow glint between the two facets */}
      <rect x={2} y={16} width={32} height={2} fill="#ffec27" />
      <rect x={2} y={17} width={32} height={1} fill="#ffa300" />

      {/* Dark half (bottom) — inverted diamond */}
      <rect x={2} y={18} width={32} height={2} fill="#202223" />
      <rect x={4} y={20} width={28} height={2} fill="#202223" />
      <rect x={6} y={22} width={24} height={2} fill="#202223" />
      <rect x={8} y={24} width={20} height={2} fill="#202223" />
      <rect x={10} y={26} width={16} height={2} fill="#202223" />
      <rect x={12} y={28} width={12} height={2} fill="#202223" />
      <rect x={14} y={30} width={8} height={2} fill="#202223" />

      {/* dark highlight on right side (catches the light) */}
      <rect x={32} y={18} width={2} height={2} fill="#3d3d3f" />
      <rect x={30} y={20} width={2} height={2} fill="#3d3d3f" />
      <rect x={28} y={22} width={2} height={2} fill="#3d3d3f" />
      <rect x={26} y={24} width={2} height={2} fill="#3d3d3f" />
      <rect x={24} y={26} width={2} height={2} fill="#3d3d3f" />
      <rect x={22} y={28} width={2} height={2} fill="#3d3d3f" />
      {/* dark shadow on left */}
      <rect x={2} y={18} width={2} height={2} fill="#0a0a0b" />
      <rect x={4} y={20} width={2} height={2} fill="#0a0a0b" />
      <rect x={6} y={22} width={2} height={2} fill="#0a0a0b" />
      <rect x={8} y={24} width={2} height={2} fill="#0a0a0b" />
    </svg>
  )
}
