import './geode.css'

// Pixel-art geode sprite. 36×28 logical px.
// The "raw" form of a token — looks like a rough mineral with hints of
// glowing colour inside. Scene 3 reveals it; Scenes 4-5 crack it open
// to expose the nested stones (Concept / Scheme alias / Palette).

export function Geode() {
  return (
    <svg
      className="geode-sprite"
      viewBox="0 0 36 28"
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* outer rough rock shell — dark grey/brown */}
      <rect x={8} y={2} width={20} height={2} fill="#5f574f" />
      <rect x={6} y={4} width={24} height={2} fill="#5f574f" />
      <rect x={4} y={6} width={28} height={4} fill="#5f574f" />
      <rect x={2} y={10} width={32} height={8} fill="#5f574f" />
      <rect x={4} y={18} width={28} height={4} fill="#5f574f" />
      <rect x={6} y={22} width={24} height={2} fill="#5f574f" />
      <rect x={8} y={24} width={20} height={2} fill="#5f574f" />

      {/* highlight ridge */}
      <rect x={8} y={2} width={20} height={1} fill="#83769c" />
      <rect x={6} y={4} width={2} height={2} fill="#83769c" />
      <rect x={4} y={6} width={2} height={4} fill="#83769c" />
      <rect x={2} y={10} width={2} height={8} fill="#83769c" />

      {/* shadow ridge */}
      <rect x={28} y={4} width={2} height={2} fill="#3d3328" />
      <rect x={30} y={6} width={2} height={4} fill="#3d3328" />
      <rect x={32} y={10} width={2} height={8} fill="#3d3328" />
      <rect x={30} y={18} width={2} height={4} fill="#3d3328" />
      <rect x={8} y={26} width={20} height={1} fill="#3d3328" />

      {/* glowing colour core peeking through cracks — teal jewel inside */}
      <rect x={14} y={10} width={8} height={6} fill="#287a83" />
      <rect x={16} y={9} width={4} height={1} fill="#287a83" />
      <rect x={12} y={11} width={2} height={4} fill="#287a83" />
      <rect x={22} y={11} width={2} height={4} fill="#287a83" />
      <rect x={15} y={16} width={6} height={1} fill="#287a83" />

      {/* bright highlight on core */}
      <rect x={16} y={11} width={2} height={1} fill="#7cbac1" />
      <rect x={15} y={12} width={1} height={1} fill="#7cbac1" />
    </svg>
  )
}
