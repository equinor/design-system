import { useState } from 'react'
import { Crate } from './Crate'
import { StationLog } from './StationLog'

// Station 1. eds-tokens-sync pulls Figma variables via REST API and
// writes one JSON file per Figma source file into tokens/{fileKey}/.
// Five source files in the real package — listed here as a "wall map."

const SOURCE_FILES = [
  '👾 Primitives',
  '🌗 Color scheme',
  '🎨 Appearance',
  '🗣️ Semantic',
  'Concept',
] as const

const JSON_SNIPPET = `{
  "bg-floating": {
    "$type": "color",
    "$value": "{Light.Gray.2}",
    "$extensions": {
      "com.figma": {
        "codeSyntax": {
          "WEB": "var(--eds-color-bg-floating)"
        }
      }
    }
  }
}`

export function SyncDock() {
  const [open, setOpen] = useState(false)

  const log = open
    ? [
        '> station 1 :: sync dock online',
        '> opening 🌗 Color scheme.Light.json',
        '> 87 tokens parsed',
        '> bg-floating :: $value = {Light.Gray.2}',
      ]
    : ['> station 1 :: sync dock online', '> crate sealed. click to open.']

  return (
    <div className="station">
      <header className="station-head">
        <span className="station-id">station 1</span>
        <span className="station-name">sync dock</span>
      </header>

      <div className="station-body sync-body">
        <div className="crate-area">
          <button
            type="button"
            className="crate-button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'close crate' : 'open crate'}
          >
            <Crate open={open} />
          </button>
          <div className="crate-label">🌗 Color scheme.Light</div>
          <div className="crate-source">eds-tokens-sync :: figma → tokens/</div>
        </div>

        <div className="json-area">
          <div className="json-dialog">
            <div className="json-dialog-title">.json</div>
            <pre className="json-snippet">{open ? JSON_SNIPPET : '· · ·'}</pre>
          </div>
          <div className="wall-map">
            <div className="wall-map-title">five source files</div>
            <ul className="source-list">
              {SOURCE_FILES.map((f) => (
                <li
                  key={f}
                  className={`source-item ${f.includes('Color scheme') ? 'is-active' : ''}`}
                >
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <StationLog lines={log} />
    </div>
  )
}
