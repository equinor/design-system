// Pixel-art Figma lorry sprite. 80×40 logical px.
// Simplified Figma logo on the cargo panel — 4 stacked coloured squares
// matching the brand's primary colour spots (orange, red, purple, green).

export function Lorry() {
  return (
    <svg
      className="lorry-sprite"
      viewBox="0 0 80 40"
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* cargo bed (rear of lorry) */}
      <rect x={2} y={10} width={48} height={22} fill="#5f574f" />
      <rect x={2} y={10} width={48} height={1} fill="#83769c" />
      <rect x={2} y={31} width={48} height={1} fill="#1d2b53" />
      {/* cab */}
      <rect x={50} y={14} width={20} height={18} fill="#7e2553" />
      <rect x={50} y={14} width={20} height={1} fill="#ff77a8" />
      <rect x={50} y={31} width={20} height={1} fill="#1d2b53" />
      {/* cab window */}
      <rect x={54} y={17} width={12} height={8} fill="#29adff" />
      <rect x={54} y={17} width={12} height={1} fill="#83bff0" />
      {/* Figma logo on cargo panel — stacked coloured squares */}
      <rect x={6} y={14} width={5} height={3} fill="#ff5630" />
      <rect x={6} y={17} width={5} height={3} fill="#a259ff" />
      <rect x={6} y={20} width={5} height={3} fill="#0acf83" />
      <rect x={6} y={23} width={5} height={3} fill="#1abcfe" />
      {/* FIGMA text — pixel font via SVG text element */}
      <text
        x={-43}
        y={24}
        fontFamily="'Press Start 2P', monospace"
        fontSize={6}
        fill="#fff1e8"
        textRendering="optimizeSpeed"
      >
        FIGMA
      </text>
      {/* wheels */}
      <rect x={6} y={32} width={8} height={6} fill="#1d2b53" />
      <rect x={7} y={33} width={6} height={4} fill="#000000" />
      <rect x={38} y={32} width={8} height={6} fill="#1d2b53" />
      <rect x={39} y={33} width={6} height={4} fill="#000000" />
      <rect x={56} y={32} width={8} height={6} fill="#1d2b53" />
      <rect x={57} y={33} width={6} height={4} fill="#000000" />
      {/* headlight */}
      <rect x={68} y={22} width={2} height={3} fill="#ffec27" />
    </svg>
  )
}
