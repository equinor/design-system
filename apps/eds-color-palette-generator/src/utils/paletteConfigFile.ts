import { TS_HUES, hueKey } from '@/config/tokensStudio'
import type { ColorDefinition } from '@/types'
import {
  deltaE,
  isValidColorFormat,
  toCssColor,
  toOklchString,
} from '@/utils/color'
import { colourFromAnchors, type PaletteInput } from '@/utils/urlState'

/** A palette's single colour as OKLCH (old hex values are converted). */
function singleColour(p: PaletteInput): string {
  const css = toCssColor(p.baseColor)
  return toOklchString(css) ?? css
}

/**
 * Palettes with hex single colours converted to OKLCH, so links from before
 * OKLCH display show OKLCH too. OKLCH values are kept exactly as written.
 */
export function withOklchColours(palettes: PaletteInput[]): PaletteInput[] {
  return palettes.map((p) =>
    p.baseColor.trim().startsWith('oklch(')
      ? p
      : { ...p, baseColor: singleColour(p) },
  )
}

/** Theme Builder palettes as colour definitions, in OKLCH. */
export function palettesToColors(palettes: PaletteInput[]): ColorDefinition[] {
  return palettes.map((p) => ({ name: p.name, value: singleColour(p) }))
}

/**
 * The palettes file: the palettes only, in OKLCH. Lightness and chroma are
 * left out because they always come from Tokens Studio.
 */
export function palettesFile(palettes: PaletteInput[]) {
  return { colors: palettesToColors(palettes) }
}

/**
 * The palettes in an uploaded file, or null if it has none. Reads the
 * palettes file and older palette configs; only `colors` is used. An older
 * palette with several anchors becomes one colour (see `colourFromAnchors`).
 */
export function palettesFromConfig(config: unknown): PaletteInput[] | null {
  if (typeof config !== 'object' || config === null) return null
  const colors = (config as { colors?: unknown }).colors
  if (!Array.isArray(colors) || colors.length === 0) return null

  const palettes: PaletteInput[] = []
  for (const entry of colors) {
    if (typeof entry !== 'object' || entry === null) return null
    const { name, value, anchors } = entry as {
      name?: unknown
      value?: unknown
      anchors?: unknown
    }
    if (typeof name !== 'string') return null
    if (typeof value === 'string' && isValidColorFormat(value)) {
      palettes.push({ name, baseColor: toOklchString(value) ?? value })
    } else if (Array.isArray(anchors) && anchors.length > 0) {
      const valid = anchors.every(
        (a) =>
          typeof a === 'object' &&
          a !== null &&
          typeof a.value === 'string' &&
          isValidColorFormat(a.value) &&
          typeof a.step === 'number' &&
          a.step >= 1 &&
          a.step <= 15,
      )
      if (!valid) return null
      const colour = colourFromAnchors(anchors)
      palettes.push({ name, baseColor: toOklchString(colour) ?? colour })
    } else {
      return null
    }
  }
  return palettes
}

export type AnchorStatus = 'changed' | 'new' | 'unchanged'

export type AnchorProposal = {
  name: string
  /** Tokens Studio hue key, e.g. `moss-green` */
  key: string
  status: AnchorStatus
  /** The palette's anchor in the Tokens Studio format */
  value: string
  /** The current Tokens Studio anchor, for changed hues */
  tokensStudioValue?: string
}

// Below this OKLab distance an anchor counts as unchanged (float noise).
const SAME_ANCHOR = 0.0001

/**
 * How each palette relates to the Tokens Studio anchors (`input/palette`).
 * A palette is matched to a hue by name, and its colour is the anchor.
 */
export function anchorProposals(palettes: PaletteInput[]): AnchorProposal[] {
  return palettes.map((p) => {
    const key = hueKey(p.name)
    const existing = TS_HUES.find((hue) => hue.key === key)
    const colour = singleColour(p)
    const value = toOklchString(colour, ', ') ?? colour
    if (!existing) return { name: p.name, key, status: 'new', value }
    const same = deltaE(colour, existing.anchor, 'OK', true) < SAME_ANCHOR
    return {
      name: p.name,
      key,
      status: same ? 'unchanged' : 'changed',
      value,
      tokensStudioValue:
        toOklchString(existing.anchor, ', ') ?? existing.anchor,
    }
  })
}

/**
 * The changed and new anchors as a Tokens Studio `input/palette` token set,
 * in the shape of `packages/eds-tokens/src/tokens/raw/input/palette.json`.
 */
export function tokensStudioAnchorsFile(proposals: AnchorProposal[]) {
  const palette = Object.fromEntries(
    proposals
      .filter((p) => p.status === 'changed' || p.status === 'new')
      .map((p) => [
        p.key,
        {
          anchor: {
            $value: p.value,
            $type: 'color',
            $extensions: { 'com.figma': { hiddenFromPublishing: true } },
          },
        },
      ]),
  )
  return { input: { palette } }
}
