// The token source, not the built CSS.
//
// The hue angles come from the DTCG definitions rather than from the rendered page. Reading the
// page back was tried first and it does not survive the build: Docusaurus's PostCSS pass rewrites
// an out-of-gamut `oklch()` to an sRGB fallback, so `--eds-dark-moss-green-13` arrives in the
// browser as `rgb(244, 254, 255)` with its hue and lightness no longer recoverable. Reading the
// definitions also means the figure renders on the server, and it reads the same file the CSS is
// generated from, so it cannot disagree with the scale it describes.
//
// Imported by relative path for the same reason `custom.css` reaches for the 3.x bundle that way:
// the package exposes this output on the beta dist-tag only, so a workspace app cannot reach it by
// specifier. See the docs app README.
import colors from '../../../../../packages/eds-tokens/src/tokens/dtcg/colors/default.json'

export const SCHEMES = ['light', 'dark'] as const

export type Scheme = (typeof SCHEMES)[number]

type Oklch = { components: number[] }
type Entry = { $value: string | Oklch }
type Group = Record<string, Record<string, Entry>>

// Cast through `unknown`: the file also holds the deeper `dataviz` group, so its inferred shape is
// wider than the two-level lookup used here.
const HUES = colors as unknown as Record<string, Group>

/**
 * `dataviz` lives beside the hue anchors in the same file but is not one: it is the chart palette,
 * nested a level deeper as `cat` / `seq` / `div`. Excluded by shape rather than by name so a new
 * anchor appears here on its own.
 */
const isAnchor = (group: Record<string, Entry>) =>
  typeof group?.['9']?.$value === 'object'

function components(
  scheme: string,
  hue: string,
  step: number,
): number[] | null {
  const value = HUES[scheme]?.[hue]?.[String(step)]?.$value
  return value && typeof value !== 'string' ? value.components : null
}

export type Anchor = {
  /** Key in the token source, which is also the CSS custom property segment. */
  name: string
  /** OKLCH hue angle, identical at every step and in both schemes. `null` when achromatic. */
  angle: number | null
}

/**
 * The hue anchors, ordered by angle so the two that nearly coincide end up adjacent.
 *
 * `gray` is last: its chroma is zero at every step, so it has no meaningful angle.
 */
export const ANCHORS: Anchor[] = Object.entries(HUES.light ?? {})
  .filter(([, group]) => isAnchor(group))
  .map(([name]) => {
    const parts = components('light', name, 9)
    const chroma = parts?.[1] ?? 0
    return { name, angle: chroma > 0 ? (parts?.[2] ?? null) : null }
  })
  .sort((a, b) => {
    if (a.angle === null) return 1
    if (b.angle === null) return -1
    return a.angle - b.angle
  })
