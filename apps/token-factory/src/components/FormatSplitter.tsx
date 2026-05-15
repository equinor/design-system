import { StationLog } from './StationLog'

// Station 4. Style Dictionary emits the same abstract source token in
// four target syntaxes. Each target applies its OWN name transform on
// top of the source path:
//   css   → kebab + --eds-color- prefix
//   js/ts → SCREAMING_SNAKE constant
//   json  → preserves the source path verbatim
//
// The CSS output keeps `var(...)` references; the JSON-flat output
// flattens them to literals. We don't model that nuance here —
// lightweight slice just shows that one source → four syntaxes,
// each with the target's own naming convention.

type Output = {
  format: 'css' | 'js' | 'ts' | 'json'
  snippet: string
}

// Abstract source — the JSON token name + resolved value entering the
// splitter. Not yet shaped for any specific target.
const SOURCE_PATH = 'bg-floating'
const SOURCE_VALUE = '#ffffff'

const OUTPUTS: Output[] = [
  {
    format: 'css',
    snippet: `--eds-color-bg-floating:\n  ${SOURCE_VALUE};`,
  },
  {
    format: 'js',
    snippet: `export const BG_FLOATING\n  = '${SOURCE_VALUE}'`,
  },
  {
    format: 'ts',
    snippet: `export const BG_FLOATING:\n  string = '${SOURCE_VALUE}'`,
  },
  {
    format: 'json',
    snippet: `"bg-floating":\n  "${SOURCE_VALUE}"`,
  },
]

const LOG_LINES = [
  '> station 4 :: format splitter online',
  `> source :: ${SOURCE_PATH} = ${SOURCE_VALUE}`,
  '> each target applies its own name transform',
  '> emit :: css | js | ts | json',
]

function Manifold() {
  // 1-in / 4-out pixel manifold. 24×80 logical px.
  return (
    <svg
      className="manifold-sprite"
      viewBox="0 0 24 80"
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* input pipe */}
      <rect x={0} y={37} width={10} height={6} fill="#5f574f" />
      <rect x={0} y={37} width={10} height={1} fill="#83769c" />
      <rect x={0} y={42} width={10} height={1} fill="#1d2b53" />
      {/* spine */}
      <rect x={10} y={6} width={4} height={70} fill="#5f574f" />
      <rect x={10} y={6} width={4} height={1} fill="#83769c" />
      <rect x={10} y={75} width={4} height={1} fill="#1d2b53" />
      {/* four out branches */}
      {[10, 30, 50, 70].map((y) => (
        <g key={y}>
          <rect x={14} y={y - 2} width={10} height={5} fill="#5f574f" />
          <rect x={14} y={y - 2} width={10} height={1} fill="#83769c" />
          <rect x={14} y={y + 2} width={10} height={1} fill="#1d2b53" />
        </g>
      ))}
    </svg>
  )
}

export function FormatSplitter() {
  return (
    <div className="station">
      <header className="station-head">
        <span className="station-id">station 4</span>
        <span className="station-name">format splitter</span>
      </header>

      <div className="station-body splitter-body">
        <div className="splitter-source">
          <div className="bench-card">
            <div className="bench-card-label">source</div>
            <div className="bench-card-value">{SOURCE_PATH}</div>
            <div className="splitter-source-value">{SOURCE_VALUE}</div>
          </div>
        </div>

        <Manifold />

        <div className="splitter-outputs">
          {OUTPUTS.map((out) => (
            <div
              key={out.format}
              className={`output-card output-${out.format}`}
            >
              <div className="output-badge">{out.format}</div>
              <pre className="output-snippet">{out.snippet}</pre>
            </div>
          ))}
        </div>
      </div>

      <StationLog lines={LOG_LINES} />
    </div>
  )
}
