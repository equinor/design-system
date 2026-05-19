import './gemstone.css'

// Two-facet pixel-art gemstone. 36×36 logical px.
// Top half = light value. Bottom half = dark value.
// The seam between them is the visible result of the `light-dark()`
// fusion: one stone, two facets.

export type GemstoneColors = {
  light: string
  lightHighlight: string
  lightShadow: string
  dark: string
  darkHighlight: string
  darkShadow: string
}

// The hero gemstone — bg-floating. Colours from the EDS concept token.
export const HERO_GEM: GemstoneColors = {
  light: '#ffffff',
  lightHighlight: '#fff1e8',
  lightShadow: '#c2c3c7',
  dark: '#202223',
  darkHighlight: '#3d3d3f',
  darkShadow: '#0a0a0b',
}

type Props = {
  colors?: GemstoneColors
}

export function Gemstone({ colors = HERO_GEM }: Props) {
  const {
    light,
    lightHighlight,
    lightShadow,
    dark,
    darkHighlight,
    darkShadow,
  } = colors

  return (
    <svg
      className="gemstone-sprite"
      viewBox="0 0 36 36"
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Light half (top) — diamond top */}
      <rect x={14} y={2} width={8} height={2} fill={light} />
      <rect x={12} y={4} width={12} height={2} fill={light} />
      <rect x={10} y={6} width={16} height={2} fill={light} />
      <rect x={8} y={8} width={20} height={2} fill={light} />
      <rect x={6} y={10} width={24} height={2} fill={light} />
      <rect x={4} y={12} width={28} height={2} fill={light} />
      <rect x={2} y={14} width={32} height={2} fill={light} />

      {/* light highlight (top-left edges) */}
      <rect x={14} y={2} width={8} height={1} fill={lightHighlight} />
      <rect x={12} y={4} width={2} height={2} fill={lightHighlight} />
      <rect x={10} y={6} width={2} height={2} fill={lightHighlight} />
      <rect x={8} y={8} width={2} height={2} fill={lightHighlight} />
      <rect x={6} y={10} width={2} height={2} fill={lightHighlight} />
      <rect x={4} y={12} width={2} height={2} fill={lightHighlight} />
      <rect x={2} y={14} width={2} height={2} fill={lightHighlight} />
      {/* light shadow (right edges) */}
      <rect x={22} y={4} width={2} height={2} fill={lightShadow} />
      <rect x={24} y={6} width={2} height={2} fill={lightShadow} />
      <rect x={26} y={8} width={2} height={2} fill={lightShadow} />
      <rect x={28} y={10} width={2} height={2} fill={lightShadow} />
      <rect x={30} y={12} width={2} height={2} fill={lightShadow} />
      <rect x={32} y={14} width={2} height={2} fill={lightShadow} />

      {/* Cut seam — yellow glint between the two facets */}
      <rect x={2} y={16} width={32} height={2} fill="#ffec27" />
      <rect x={2} y={17} width={32} height={1} fill="#ffa300" />

      {/* Dark half (bottom) — inverted diamond */}
      <rect x={2} y={18} width={32} height={2} fill={dark} />
      <rect x={4} y={20} width={28} height={2} fill={dark} />
      <rect x={6} y={22} width={24} height={2} fill={dark} />
      <rect x={8} y={24} width={20} height={2} fill={dark} />
      <rect x={10} y={26} width={16} height={2} fill={dark} />
      <rect x={12} y={28} width={12} height={2} fill={dark} />
      <rect x={14} y={30} width={8} height={2} fill={dark} />

      {/* dark highlight on right side (catches the light) */}
      <rect x={32} y={18} width={2} height={2} fill={darkHighlight} />
      <rect x={30} y={20} width={2} height={2} fill={darkHighlight} />
      <rect x={28} y={22} width={2} height={2} fill={darkHighlight} />
      <rect x={26} y={24} width={2} height={2} fill={darkHighlight} />
      <rect x={24} y={26} width={2} height={2} fill={darkHighlight} />
      <rect x={22} y={28} width={2} height={2} fill={darkHighlight} />
      {/* dark shadow on left */}
      <rect x={2} y={18} width={2} height={2} fill={darkShadow} />
      <rect x={4} y={20} width={2} height={2} fill={darkShadow} />
      <rect x={6} y={22} width={2} height={2} fill={darkShadow} />
      <rect x={8} y={24} width={2} height={2} fill={darkShadow} />
    </svg>
  )
}
