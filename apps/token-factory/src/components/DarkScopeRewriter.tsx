import { StationLog } from './StationLog'

// Station 6. The build-dark-scope step finds every light-dark(L, D)
// declaration in the bundled variables.css and rewrites it into three
// explicit rules — :root, [data-color-scheme="light"], and
// [data-color-scheme="dark"] — plus a prefers-color-scheme: dark media
// query scoped to :root:not([data-color-scheme="light"]).
//
// Why: downstream bundlers (Vite 8 + Rolldown + lightningcss, esbuild
// with legacy targets, postcss with certain presets) polyfill the
// light-dark() function into a var() pattern that resolves at the
// :root declaration site and breaks subtree-scoped dark mode.
// Emitting explicit scope rules is robust against any downstream CSS
// pipeline regardless of how it is configured. The build asserts the
// final output contains no `light-dark(` literals.
//
// See packages/eds-tokens/CLAUDE.md "Pitfalls" + design-system README.

const INPUT_SNIPPET = `:root {
  --eds-color-bg-floating:
    light-dark(#fff, #202223);
}`

const OUTPUT_SNIPPET = `:root {
  --eds-color-bg-floating: #fff;
}
[data-color-scheme="light"] {
  --eds-color-bg-floating: #fff;
}
[data-color-scheme="dark"] {
  --eds-color-bg-floating: #202223;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-color-scheme="light"]) {
    --eds-color-bg-floating: #202223;
  }
}`

const LOG_LINES = [
  '> station 6 :: dark-scope rewriter online',
  '> scanning variables.css for light-dark(',
  '> rewriting to explicit [data-color-scheme] rules',
  '> assertion :: no light-dark( in final output ✓',
]

export function DarkScopeRewriter() {
  return (
    <div className="station">
      <header className="station-head">
        <span className="station-id">station 6</span>
        <span className="station-name">dark-scope rewriter</span>
      </header>

      <div className="station-body darkscope-body">
        <div className="darkscope-flow">
          <div className="darkscope-card darkscope-in">
            <div className="darkscope-card-label">in :: source css</div>
            <pre className="darkscope-snippet">{INPUT_SNIPPET}</pre>
          </div>

          <span className="darkscope-arrow">→</span>

          <div className="darkscope-card darkscope-out">
            <div className="darkscope-card-label">out :: published css</div>
            <pre className="darkscope-snippet">{OUTPUT_SNIPPET}</pre>
          </div>
        </div>

        <div className="darkscope-why">
          <div className="darkscope-why-title">why this exists</div>
          <p className="darkscope-why-body">
            downstream bundlers (vite 8 + rolldown, esbuild legacy targets)
            polyfill <code>light-dark()</code> into a var() pattern that
            resolves at <code>:root</code> — breaking subtree-scoped dark mode.
            emitting explicit rules is immune to any downstream pipeline.
          </p>
        </div>
      </div>

      <StationLog lines={LOG_LINES} />
    </div>
  )
}
