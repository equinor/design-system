// Other-lane material sprites used by Scene 8 (packaging) and
// Scene 9 (jeweller). Each represents a non-color lane in the
// pipeline: spacing → cords, density → clasps, typography → chains.
// 16×16 logical px so they crop tightly inside any container.

export function CordSprite() {
  return (
    <svg
      className="lane-sprite"
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
    >
      <rect x={2} y={3} width={2} height={2} fill="#83769c" />
      <rect x={4} y={5} width={2} height={2} fill="#83769c" />
      <rect x={6} y={7} width={2} height={2} fill="#83769c" />
      <rect x={8} y={9} width={2} height={2} fill="#83769c" />
      <rect x={10} y={11} width={2} height={2} fill="#83769c" />
      <rect x={12} y={9} width={2} height={2} fill="#83769c" />
      <rect x={10} y={7} width={2} height={2} fill="#83769c" />
      <rect x={8} y={5} width={2} height={2} fill="#83769c" />
    </svg>
  )
}

export function ClaspSprite() {
  return (
    <svg
      className="lane-sprite"
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
    >
      <rect x={5} y={3} width={6} height={2} fill="#ffa300" />
      <rect x={3} y={5} width={2} height={6} fill="#ffa300" />
      <rect x={11} y={5} width={2} height={6} fill="#ffa300" />
      <rect x={5} y={11} width={6} height={2} fill="#ffa300" />
      <rect x={6} y={6} width={4} height={4} fill="#ffec27" />
    </svg>
  )
}

export function ChainSprite() {
  return (
    <svg
      className="lane-sprite"
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
    >
      <rect x={3} y={3} width={4} height={3} fill="#c2c3c7" />
      <rect x={4} y={4} width={2} height={1} fill="#202223" />
      <rect x={6} y={7} width={4} height={3} fill="#c2c3c7" />
      <rect x={7} y={8} width={2} height={1} fill="#202223" />
      <rect x={9} y={11} width={4} height={3} fill="#c2c3c7" />
      <rect x={10} y={12} width={2} height={1} fill="#202223" />
    </svg>
  )
}
