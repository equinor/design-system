import type { StageViz } from '../data/lanes/types'

// Pixel-art icons used inside LaneMapDialog cells.
// Each icon renders at 20×20 logical pixels (scaled by --px in CSS).
// Inline SVG, shape-rendering crispEdges for sharp pixel boundaries.

type Props = { viz: StageViz }

export function StageViz({ viz }: Props) {
  switch (viz) {
    case 'figma':
      return <FigmaIcon />
    case 'sync':
      return <SyncIcon />
    case 'json':
      return <JsonIcon />
    case 'crack':
      return <CrackIcon />
    case 'layers':
      return <LayersIcon />
    case 'cut':
      return <CutIcon />
    case 'file':
      return <FileIcon />
    case 'bundle':
      return <BundleIcon />
    case 'ship':
      return <ShipIcon />
  }
}

const ICON_PROPS = {
  width: '100%',
  height: '100%',
  viewBox: '0 0 20 20',
  shapeRendering: 'crispEdges' as const,
}

function FigmaIcon() {
  // Stack of 4 Figma-coloured rectangles
  return (
    <svg {...ICON_PROPS}>
      <rect x="6" y="3" width="8" height="3" fill="#f24e1e" />
      <rect x="6" y="6" width="8" height="3" fill="#a259ff" />
      <rect x="6" y="9" width="8" height="3" fill="#0acf83" />
      <rect x="6" y="12" width="8" height="3" fill="#1abcfe" />
      <rect x="6" y="15" width="8" height="2" fill="#ff7262" />
    </svg>
  )
}

function SyncIcon() {
  // Lorry silhouette pointing right
  return (
    <svg {...ICON_PROPS}>
      <rect x="2" y="8" width="9" height="6" fill="#7e2553" />
      <rect x="11" y="10" width="5" height="4" fill="#5f574f" />
      <rect x="12" y="11" width="2" height="2" fill="#29adff" />
      <rect x="4" y="15" width="2" height="2" fill="#000" />
      <rect x="13" y="15" width="2" height="2" fill="#000" />
      <rect x="3" y="10" width="2" height="1" fill="#ffec27" />
    </svg>
  )
}

function JsonIcon() {
  // Document with { } symbols
  return (
    <svg {...ICON_PROPS}>
      <rect x="4" y="3" width="12" height="14" fill="#fff1e8" />
      <rect x="4" y="3" width="12" height="1" fill="#000" />
      <rect x="4" y="16" width="12" height="1" fill="#000" />
      <rect x="4" y="3" width="1" height="14" fill="#000" />
      <rect x="15" y="3" width="1" height="14" fill="#000" />
      {/* { */}
      <rect x="7" y="6" width="1" height="1" fill="#000" />
      <rect x="6" y="7" width="1" height="6" fill="#000" />
      <rect x="7" y="13" width="1" height="1" fill="#000" />
      {/* } */}
      <rect x="12" y="6" width="1" height="1" fill="#000" />
      <rect x="13" y="7" width="1" height="6" fill="#000" />
      <rect x="12" y="13" width="1" height="1" fill="#000" />
      {/* dots */}
      <rect x="9" y="9" width="1" height="1" fill="#7e2553" />
      <rect x="10" y="10" width="1" height="1" fill="#7e2553" />
    </svg>
  )
}

function CrackIcon() {
  // Crate with crack down the middle + spark
  return (
    <svg {...ICON_PROPS}>
      <rect x="3" y="5" width="14" height="11" fill="#7e2553" />
      <rect x="3" y="5" width="14" height="1" fill="#ffa300" />
      <rect x="3" y="15" width="14" height="1" fill="#ffa300" />
      <rect x="3" y="5" width="1" height="11" fill="#ffa300" />
      <rect x="16" y="5" width="1" height="11" fill="#ffa300" />
      {/* crack */}
      <rect x="9" y="6" width="2" height="2" fill="#ffec27" />
      <rect x="10" y="8" width="1" height="2" fill="#ffec27" />
      <rect x="9" y="10" width="2" height="2" fill="#ffec27" />
      <rect x="10" y="12" width="1" height="3" fill="#ffec27" />
    </svg>
  )
}

function LayersIcon() {
  // 3 concentric stones
  return (
    <svg {...ICON_PROPS}>
      <rect x="2" y="5" width="16" height="10" fill="#7e2553" />
      <rect x="4" y="6" width="12" height="8" fill="#ff77a8" />
      <rect x="7" y="7" width="6" height="6" fill="#fff1e8" />
    </svg>
  )
}

function CutIcon() {
  // Two-facet gemstone: light + dark halves with yellow seam
  return (
    <svg {...ICON_PROPS}>
      <rect x="4" y="4" width="12" height="6" fill="#fff1e8" />
      <rect x="4" y="11" width="12" height="6" fill="#202223" />
      <rect x="4" y="10" width="12" height="1" fill="#ffec27" />
      <rect x="3" y="4" width="1" height="13" fill="#5f574f" />
      <rect x="16" y="4" width="1" height="13" fill="#5f574f" />
    </svg>
  )
}

function FileIcon() {
  // CSS file with .CSS tag
  return (
    <svg {...ICON_PROPS}>
      <rect x="4" y="2" width="11" height="16" fill="#fff1e8" />
      <rect x="4" y="2" width="11" height="1" fill="#000" />
      <rect x="4" y="17" width="11" height="1" fill="#000" />
      <rect x="4" y="2" width="1" height="16" fill="#000" />
      <rect x="14" y="2" width="1" height="16" fill="#000" />
      {/* fold corner */}
      <rect x="11" y="2" width="4" height="3" fill="#c2c3c7" />
      <rect x="11" y="2" width="1" height="3" fill="#000" />
      {/* CSS text strip */}
      <rect x="5" y="10" width="9" height="4" fill="#29adff" />
      <rect x="6" y="11" width="1" height="2" fill="#fff1e8" />
      <rect x="8" y="11" width="1" height="2" fill="#fff1e8" />
      <rect x="10" y="11" width="1" height="2" fill="#fff1e8" />
      <rect x="12" y="11" width="1" height="2" fill="#fff1e8" />
    </svg>
  )
}

function BundleIcon() {
  // Sealed shipping box
  return (
    <svg {...ICON_PROPS}>
      <rect x="2" y="6" width="16" height="11" fill="#7e2553" />
      <rect x="2" y="5" width="16" height="2" fill="#ffec27" />
      <rect x="9" y="6" width="2" height="11" fill="#ffa300" />
      <rect x="2" y="10" width="16" height="1" fill="#000" />
      <rect x="4" y="13" width="3" height="2" fill="#fff1e8" />
    </svg>
  )
}

function ShipIcon() {
  // Button-ish rounded rect = component
  return (
    <svg {...ICON_PROPS}>
      <rect x="2" y="7" width="16" height="6" fill="#29adff" />
      <rect x="3" y="6" width="14" height="8" fill="#29adff" />
      <rect x="4" y="9" width="2" height="2" fill="#fff1e8" />
      <rect x="7" y="9" width="2" height="2" fill="#fff1e8" />
      <rect x="10" y="9" width="2" height="2" fill="#fff1e8" />
      <rect x="13" y="9" width="3" height="2" fill="#fff1e8" />
    </svg>
  )
}
