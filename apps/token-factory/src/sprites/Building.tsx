import './building.css'

// Factory building silhouette at the right end of the dock conveyor.
// Stepped roof — three increasing-height rectangles giving it an
// industrial profile. The gate is rendered as a separate component so
// its open/closed state can be controlled by the scene.

export function Building() {
  return (
    <svg
      className="building-sprite"
      viewBox="0 0 80 140"
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      {/* base wall */}
      <rect x={0} y={70} width={80} height={70} fill="#5f574f" />
      <rect x={0} y={70} width={80} height={1} fill="#83769c" />
      <rect x={0} y={139} width={80} height={1} fill="#1d2b53" />

      {/* stepped roof — three tiers */}
      <rect x={0} y={50} width={26} height={20} fill="#5f574f" />
      <rect x={0} y={50} width={26} height={1} fill="#83769c" />

      <rect x={26} y={30} width={28} height={40} fill="#5f574f" />
      <rect x={26} y={30} width={28} height={1} fill="#83769c" />

      <rect x={54} y={10} width={26} height={60} fill="#5f574f" />
      <rect x={54} y={10} width={26} height={1} fill="#83769c" />

      {/* chimney on tallest roof */}
      <rect x={66} y={0} width={6} height={12} fill="#5f574f" />
      <rect x={66} y={0} width={6} height={1} fill="#83769c" />

      {/* one small window per roof tier */}
      <rect x={6} y={58} width={6} height={4} fill="#29adff" />
      <rect x={34} y={40} width={6} height={6} fill="#29adff" />
      <rect x={60} y={24} width={8} height={6} fill="#29adff" />
    </svg>
  )
}
