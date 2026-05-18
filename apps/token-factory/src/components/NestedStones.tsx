// Three concentric pixel-art stones — the geode's interior.
// Scene 4 reveals all three; Scene 5 peels them apart individually.
//
// Layers (outside-in) for bg-floating:
//   outer  — Concept layer: Bg.Floating in Concept.Mode 1.json
//            (the stable name product code asks for)
//   middle — Scheme layer: bg-floating in 🌗 Color scheme.Light.json
//            (the swap point — routes the concept to a palette token
//            per scheme; this is where light/dark theming happens)
//   inner  — Palette layer: Light.Gray.2 in Color Light.Mode 1.json
//            (the actual hex value, e.g. #ffffff)
//
// The CSS variable name `--eds-color-bg-floating` is NOT a layer —
// it is a sticker the build package attaches to the whole geode at
// build time so it can be shipped as CSS. See Scene 5 beats 6–7.
//
// The `highlight` prop is consumed by Scene 5 to brighten one layer
// at a time and dim the others.

export type StoneLayer = 'none' | 'outer' | 'middle' | 'inner'

export function NestedStones({
  highlight = 'none',
}: {
  highlight?: StoneLayer
}) {
  const isDim = (layer: Exclude<StoneLayer, 'none'>) =>
    highlight !== 'none' && highlight !== layer
  const isActive = (layer: Exclude<StoneLayer, 'none'>) => highlight === layer

  return (
    <svg
      className="nested-stones-sprite"
      viewBox="0 0 60 60"
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* OUTER — Concept layer (purple/pink) */}
      <g
        className={`stone-layer stone-outer ${
          isActive('outer') ? 'is-active' : ''
        } ${isDim('outer') ? 'is-dim' : ''}`}
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

      {/* MIDDLE — Scheme layer (orange/yellow — the swap point) */}
      <g
        className={`stone-layer stone-middle ${
          isActive('middle') ? 'is-active' : ''
        } ${isDim('middle') ? 'is-dim' : ''}`}
      >
        <rect x={22} y={14} width={16} height={2} fill="#ffa300" />
        <rect x={18} y={16} width={24} height={2} fill="#ffa300" />
        <rect x={16} y={18} width={28} height={2} fill="#ffa300" />
        <rect x={14} y={20} width={32} height={20} fill="#ffa300" />
        <rect x={16} y={40} width={28} height={2} fill="#ffa300" />
        <rect x={18} y={42} width={24} height={2} fill="#ffa300" />
        <rect x={22} y={44} width={16} height={2} fill="#ffa300" />
        {/* edge highlight (top-left) */}
        <rect x={22} y={14} width={16} height={1} fill="#ffec27" />
        <rect x={18} y={16} width={2} height={2} fill="#ffec27" />
        <rect x={16} y={18} width={2} height={2} fill="#ffec27" />
        <rect x={14} y={20} width={2} height={20} fill="#ffec27" />
        {/* edge shadow (bottom-right) */}
        <rect x={40} y={16} width={2} height={2} fill="#742f00" />
        <rect x={42} y={18} width={2} height={2} fill="#742f00" />
        <rect x={44} y={20} width={2} height={20} fill="#742f00" />
        <rect x={22} y={45} width={16} height={1} fill="#742f00" />
      </g>

      {/* INNER — Palette layer (teal) */}
      <g
        className={`stone-layer stone-inner ${
          isActive('inner') ? 'is-active' : ''
        } ${isDim('inner') ? 'is-dim' : ''}`}
      >
        <rect x={26} y={22} width={8} height={2} fill="#287a83" />
        <rect x={24} y={24} width={12} height={2} fill="#287a83" />
        <rect x={22} y={26} width={16} height={10} fill="#287a83" />
        <rect x={24} y={36} width={12} height={2} fill="#287a83" />
        <rect x={26} y={38} width={8} height={2} fill="#287a83" />
        {/* bright highlight */}
        <rect x={26} y={22} width={8} height={1} fill="#7cbac1" />
        <rect x={24} y={24} width={2} height={2} fill="#7cbac1" />
        <rect x={22} y={26} width={2} height={6} fill="#7cbac1" />
        {/* edge shadow */}
        <rect x={34} y={24} width={2} height={2} fill="#15363c" />
        <rect x={36} y={26} width={2} height={10} fill="#15363c" />
        <rect x={26} y={39} width={8} height={1} fill="#15363c" />
      </g>
    </svg>
  )
}
