import { StationLog } from './StationLog'

// Station 4. Style Dictionary emits the same abstract source token in
// four target syntaxes, each applying its own name transform + shape.
// Verified against build/{css,js,ts,json}/color/color-scheme/*:
//   css   → kebab + --eds-color- prefix, flat declarations
//   js    → SCREAMING_SNAKE flat constants
//   ts    → nested camelCase object tree on a single `color` export
//   json  → kebab keys in flat form (nested form preserves PascalCase)
//
// The TS rework that landed for mobile (PR #4915) was specifically the
// typography matrices — colors already shipped as a nested TS object.

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
    snippet: `export const\n  BG_FLOATING =\n  "${SOURCE_VALUE}"`,
  },
  {
    format: 'ts',
    snippet: `color = {\n  bg: {\n    floating:\n      '${SOURCE_VALUE}'\n  }\n}`,
  },
  {
    format: 'json',
    snippet: `"bg-floating":\n  "${SOURCE_VALUE}"`,
  },
]

const LOG_LINES = [
  '> station 4 :: format splitter online',
  '> NOTE :: color scheme lane only emits to color-scheme.css',
  '> below shows the 4-target fanout from the SEMANTIC lane (reference)',
  `> source :: ${SOURCE_PATH} = ${SOURCE_VALUE}`,
  '> each target applies its own name transform + shape',
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
              className={`output-card output-${out.format.replace(/\s+/g, '-')}`}
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
