// Two concentric pixel-art stones. The geode's interior — Scene 4
// reveals both; Scene 5 peels them apart individually.
//
// Layers (outside-in):
//   outer — Figma source name (e.g. Bg.Floating in Concept.Mode 1.json)
//   inner — the actual value (e.g. #ffffff resolved from Light.Gray.2)
//
// The CSS variable name `--eds-color-bg-floating` is NOT a layer — it
// is a sticker the build package attaches to the whole geode at build
// time so it can be shipped as CSS. See Scene 5 beat 4.
//
// The `highlight` prop is consumed by Scene 5 to brighten one layer at
// a time and dim the other.

export type StoneLayer = 'none' | 'outer' | 'inner'

export function NestedStones({
  highlight = 'none',
}: {
  highlight?: StoneLayer
}) {
  return (
    <svg
      className="nested-stones-sprite"
      viewBox="0 0 60 60"
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* outer stone — the Figma source name (purple/pink) */}
      <g
        className={`stone-layer stone-outer ${
          highlight === 'outer' ? 'is-active' : ''
        } ${highlight !== 'none' && highlight !== 'outer' ? 'is-dim' : ''}`}
      >
        <rect x={20} y={4} width={20} height={2} fill="#7e2553" />
        <rect x={14} y={6} width={32} height={2} fill="#7e2553" />
        <rect x={10} y={8} width={40} height={2} fill="#7e2553" />
        <rect x={6} y={10} width={48} height={4} fill="#7e2553" />
        <rect x={4} y={14} width={52} height={32} fill="#7e2553" />
        <rect x={6} y={46} width={48} height={4} fill="#7e2553" />
        <rect x={10} y={50} width={40} height={2} fill="#7e2553" />
        <rect x={14} y={52} width={32} height={2} fill="#7e2553" />
        <rect x={20} y={54} width={20} height={2} fill="#7e2553" />
        {/* edge highlight */}
        <rect x={20} y={4} width={20} height={1} fill="#ff77a8" />
        <rect x={14} y={6} width={2} height={2} fill="#ff77a8" />
        <rect x={10} y={8} width={2} height={2} fill="#ff77a8" />
        <rect x={6} y={10} width={2} height={4} fill="#ff77a8" />
        <rect x={4} y={14} width={2} height={32} fill="#ff77a8" />
        {/* edge shadow */}
        <rect x={44} y={6} width={2} height={2} fill="#3d122a" />
        <rect x={48} y={8} width={2} height={2} fill="#3d122a" />
        <rect x={52} y={10} width={2} height={4} fill="#3d122a" />
        <rect x={54} y={14} width={2} height={32} fill="#3d122a" />
        <rect x={20} y={55} width={20} height={1} fill="#3d122a" />
      </g>

      {/* inner core — the actual value (teal, brightest) */}
      <g
        className={`stone-layer stone-inner ${
          highlight === 'inner' ? 'is-active' : ''
        } ${highlight !== 'none' && highlight !== 'inner' ? 'is-dim' : ''}`}
      >
        <rect x={24} y={18} width={12} height={2} fill="#287a83" />
        <rect x={22} y={20} width={16} height={2} fill="#287a83" />
        <rect x={20} y={22} width={20} height={16} fill="#287a83" />
        <rect x={22} y={38} width={16} height={2} fill="#287a83" />
        <rect x={24} y={40} width={12} height={2} fill="#287a83" />
        {/* bright highlight */}
        <rect x={24} y={18} width={12} height={1} fill="#7cbac1" />
        <rect x={22} y={20} width={2} height={2} fill="#7cbac1" />
        <rect x={20} y={22} width={2} height={8} fill="#7cbac1" />
        {/* edge shadow */}
        <rect x={36} y={20} width={2} height={2} fill="#15363c" />
        <rect x={38} y={22} width={2} height={16} fill="#15363c" />
        <rect x={24} y={41} width={12} height={1} fill="#15363c" />
      </g>
    </svg>
  )
}
