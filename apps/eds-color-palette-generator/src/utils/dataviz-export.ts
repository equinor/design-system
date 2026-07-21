import { formatColorsAsTokens } from './tokenFormatter'
import type { DatavizKind, SwatchColor } from '@/config/dataviz-types'

const KIND_PREFIX: Record<DatavizKind, string> = {
  categorical: 'cat',
  sequential: 'seq',
  diverging: 'div',
}

/** A plain hex array — drop-in for Recharts / Chart.js / ECharts / Nivo. */
export function toHexArray(colors: SwatchColor[]): string {
  return JSON.stringify(
    colors.map((c) => c.hex),
    null,
    2,
  )
}

/** CSS custom properties, e.g. `--eds-dataviz-cat-1: #...;`. */
export function toCssVars(colors: SwatchColor[], kind: DatavizKind): string {
  const prefix = KIND_PREFIX[kind]
  const lines = colors.map(
    (c, i) => `  --eds-dataviz-${prefix}-${i + 1}: ${c.hex};`,
  )
  return `:root {\n${lines.join('\n')}\n}\n`
}

/**
 * W3C Design Tokens Community Group JSON, grouped under the family name.
 * Reuses the same token shape as the UI-token export (tokenFormatter) — this
 * is an ad-hoc export of whatever the user generated, not a maintained set.
 */
export function toW3CTokens(colors: SwatchColor[], kind: DatavizKind): string {
  return formatColorsAsTokens({ [kind]: colors.map((c) => c.hex) })
}

/** Trigger a browser download of `content` as `filename`. */
export function downloadText(
  filename: string,
  content: string,
  mime = 'text/plain',
): void {
  if (typeof document === 'undefined') return
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
