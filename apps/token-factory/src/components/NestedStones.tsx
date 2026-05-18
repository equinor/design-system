// Three concentric pixel-art stones. The geode's interior — Scene 4
// reveals all three; Scene 5 peels them apart individually.
//
// Layers (outside-in):
//   outer  — Concept / CSS-variable name (--eds-color-bg-floating)
//   middle — scheme alias (bg-floating in Color scheme.Light.json)
//   inner  — Palette value (Light.Gray.2 = #ffffff)
//
// The `highlight` prop is consumed by Scene 5 to brighten one layer at
// a time and dim the others.

export type StoneLayer = 'none' | 'outer' | 'middle' | 'inner'

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
      {/* outer stone — Concept layer (purple) */}
      <g
        className={`stone-layer stone-outer ${
          highlight === 'outer' ? 'is-active' : ''
        } ${highlight !== 'none' && highlight !== 'outer' ? 'is-dim' : ''}`}
      >
        {/* upper half */}
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

      {/* middle stone — Scheme alias layer (green) */}
      <g
        className={`stone-layer stone-middle ${
          highlight === 'middle' ? 'is-active' : ''
        } ${highlight !== 'none' && highlight !== 'middle' ? 'is-dim' : ''}`}
      >
        <rect x={24} y={14} width={12} height={2} fill="#008751" />
        <rect x={20} y={16} width={20} height={2} fill="#008751" />
        <rect x={16} y={18} width={28} height={2} fill="#008751" />
        <rect x={14} y={20} width={32} height={20} fill="#008751" />
        <rect x={16} y={40} width={28} height={2} fill="#008751" />
        <rect x={20} y={42} width={20} height={2} fill="#008751" />
        <rect x={24} y={44} width={12} height={2} fill="#008751" />
        {/* edge highlight */}
        <rect x={24} y={14} width={12} height={1} fill="#1cc266" />
        <rect x={20} y={16} width={2} height={2} fill="#1cc266" />
        <rect x={16} y={18} width={2} height={2} fill="#1cc266" />
        <rect x={14} y={20} width={2} height={20} fill="#1cc266" />
        {/* edge shadow */}
        <rect x={38} y={16} width={2} height={2} fill="#003c25" />
        <rect x={42} y={18} width={2} height={2} fill="#003c25" />
        <rect x={44} y={20} width={2} height={20} fill="#003c25" />
        <rect x={24} y={45} width={12} height={1} fill="#003c25" />
      </g>

      {/* inner core — Palette value (teal, brightest) */}
      <g
        className={`stone-layer stone-inner ${
          highlight === 'inner' ? 'is-active' : ''
        } ${highlight !== 'none' && highlight !== 'inner' ? 'is-dim' : ''}`}
      >
        <rect x={26} y={24} width={8} height={2} fill="#287a83" />
        <rect x={24} y={26} width={12} height={2} fill="#287a83" />
        <rect x={22} y={28} width={16} height={6} fill="#287a83" />
        <rect x={24} y={34} width={12} height={2} fill="#287a83" />
        <rect x={26} y={36} width={8} height={2} fill="#287a83" />
        {/* bright highlight */}
        <rect x={26} y={24} width={8} height={1} fill="#7cbac1" />
        <rect x={24} y={26} width={2} height={2} fill="#7cbac1" />
        <rect x={22} y={28} width={2} height={4} fill="#7cbac1" />
      </g>
    </svg>
  )
}
