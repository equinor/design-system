import './crate.css'

// Pixel-art Figma crate sprite. 48×40 logical px.

export function Crate({ open = false }: { open?: boolean }) {
  return (
    <svg
      className="crate-sprite"
      viewBox="0 0 48 40"
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* base/floor of crate */}
      <rect x={4} y={32} width={40} height={6} fill="#5f3110" />
      {/* main body */}
      <rect x={4} y={10} width={40} height={22} fill="#8a4a17" />
      <rect x={4} y={10} width={40} height={1} fill="#a86120" />
      <rect x={4} y={31} width={40} height={1} fill="#3d1e08" />
      {/* plank seams */}
      <rect x={14} y={10} width={1} height={22} fill="#5f3110" />
      <rect x={24} y={10} width={1} height={22} fill="#5f3110" />
      <rect x={34} y={10} width={1} height={22} fill="#5f3110" />
      {/* metal corners */}
      <rect x={4} y={10} width={3} height={3} fill="#c2c3c7" />
      <rect x={41} y={10} width={3} height={3} fill="#c2c3c7" />
      <rect x={4} y={29} width={3} height={3} fill="#c2c3c7" />
      <rect x={41} y={29} width={3} height={3} fill="#c2c3c7" />
      {/* lid */}
      {open ? (
        <>
          {/* lid tilted back */}
          <rect x={2} y={2} width={44} height={3} fill="#a86120" />
          <rect x={2} y={5} width={44} height={3} fill="#8a4a17" />
          {/* tokens leaking out */}
          <rect x={20} y={6} width={3} height={3} fill="#ffec27" />
          <rect x={26} y={4} width={3} height={3} fill="#ffec27" />
          <rect x={14} y={6} width={2} height={2} fill="#29adff" />
        </>
      ) : (
        <>
          {/* closed lid */}
          <rect x={2} y={6} width={44} height={5} fill="#a86120" />
          <rect x={2} y={6} width={44} height={1} fill="#c87a30" />
          <rect x={2} y={10} width={44} height={1} fill="#5f3110" />
          {/* latch */}
          <rect x={22} y={8} width={4} height={4} fill="#c2c3c7" />
          <rect x={23} y={9} width={2} height={2} fill="#5f574f" />
        </>
      )}
    </svg>
  )
}
