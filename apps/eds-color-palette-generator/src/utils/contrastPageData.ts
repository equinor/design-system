import Color from 'colorjs.io'
import { PALETTE_STEPS, stepLabel, stepsWithRole } from '@/config/config'
import type { Scheme } from '@/config/tokensStudio'
import { calcContrast, type ContrastResult } from '@/utils/palette'
import { resolveToken, tokenTarget, toneRamps } from '@/utils/semanticTokens'

export function getLightness(hex: string): number {
  try {
    return new Color(hex).to('oklch').l ?? 0
  } catch {
    return 0
  }
}

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type TextChoice = ContrastResult & { color: string; label: string }

export type StepData = {
  step: number
  role: string
  hex: string
  recommended: TextChoice
  paletteText: TextChoice
}

export type SortOrder = 'semantic' | 'gradient'

export type ViewMode = 'semantic' | 'gradient' | 'combined'

/* ------------------------------------------------------------------ */
/*  Combined view — Tokens Studio token pairs across tones             */
/* ------------------------------------------------------------------ */

export type PairingType = 'text' | 'border' | 'fill'

export type Pairing = {
  state: string
  type: PairingType
  fg: { label: string; hex: string }
  bg: { label: string; hex: string }
  contrast: ContrastResult
}

export type PatternGroup = {
  title: string
  description: string
  pairings: Pairing[]
}

/** A pair of Tokens Studio semantic tokens, foreground on background. */
type TokenPair = { state: string; fg: string; bg: string; type?: PairingType }

type PatternGroupSpec = {
  title: string
  description: string
  pairs: TokenPair[]
}

const onEach = (
  fgs: { state: string; path: string }[],
  bgs: string[],
  type?: PairingType,
): TokenPair[] =>
  bgs.flatMap((bg) =>
    fgs.map(({ state, path }) => ({ state, fg: path, bg, type })),
  )

const CANVAS_AND_SURFACE = ['background.canvas', 'background.surface']

const STATUS_TONES = ['success', 'info', 'warning', 'danger'] as const

/**
 * The token pairs the combined view checks. Every pair is two Tokens Studio
 * semantic tokens, so the view shows the same combinations the design system
 * uses. Borders are shown for reference only: ADR 0016 leaves border contrast
 * out of scope.
 */
export const PATTERN_GROUP_SPECS: PatternGroupSpec[] = [
  {
    title: 'Text on canvas and surface',
    description:
      'text.primary, text.secondary and text.tertiary on background.canvas and background.surface. ADR 0016 measures text against background.surface.',
    pairs: onEach(
      [
        { state: 'Primary', path: 'text.primary' },
        { state: 'Secondary', path: 'text.secondary' },
        { state: 'Tertiary', path: 'text.tertiary' },
      ],
      CANVAS_AND_SURFACE,
    ),
  },
  {
    title: 'Neutral borders on canvas and surface',
    description:
      'border.non-interactive.neutral muted, default and emphasis. For reference: ADR 0016 has no contrast requirement for borders.',
    pairs: onEach(
      [
        { state: 'Muted', path: 'border.non-interactive.neutral.muted' },
        { state: 'Default', path: 'border.non-interactive.neutral.default' },
        { state: 'Emphasis', path: 'border.non-interactive.neutral.emphasis' },
      ],
      CANVAS_AND_SURFACE,
      'border',
    ),
  },
  {
    title: 'Accent fills on canvas and surface',
    description:
      'The accent muted and emphasis default fills against the neutral backgrounds they sit on.',
    pairs: onEach(
      [
        { state: 'Muted', path: 'background.interactive.accent.muted.default' },
        {
          state: 'Emphasis',
          path: 'background.interactive.accent.emphasis.default',
        },
      ],
      CANVAS_AND_SURFACE,
      'fill',
    ),
  },
  {
    title: 'text.on-emphasis on accent emphasis fills',
    description:
      'text.on-emphasis.accent on the accent emphasis fill in each state. ADR 0016 requires Lc 60 on the default fill.',
    pairs: (['default', 'hover', 'pressed'] as const).map((state) => ({
      state: state.charAt(0).toUpperCase() + state.slice(1),
      fg: 'text.on-emphasis.accent',
      bg: `background.interactive.accent.emphasis.${state}`,
    })),
  },
  {
    title: 'Text on accent muted fills',
    description:
      'text.on-muted.accent and text.primary on the accent muted fill in each state.',
    pairs: (['default', 'hover', 'pressed'] as const).flatMap((state) => {
      const bg = `background.interactive.accent.muted.${state}`
      const label = state.charAt(0).toUpperCase() + state.slice(1)
      return [
        { state: `${label} · on-muted`, fg: 'text.on-muted.accent', bg },
        { state: `${label} · primary`, fg: 'text.primary', bg },
      ]
    }),
  },
  {
    title: 'Links and focus on surface',
    description:
      'text.interactive.link in each state and border.interactive.focus on background.surface.',
    pairs: [
      ...(['default', 'hover', 'pressed'] as const).map((state) => ({
        state: `Link ${state}`,
        fg: `text.interactive.link.${state}`,
        bg: 'background.surface',
      })),
      {
        state: 'Focus',
        fg: 'border.interactive.focus',
        bg: 'background.surface',
        type: 'border' as const,
      },
    ],
  },
  {
    title: 'text.on-emphasis on status emphasis fills',
    description:
      'text.on-emphasis on the default emphasis fill of each status tone.',
    pairs: STATUS_TONES.map((tone) => ({
      state: tone.charAt(0).toUpperCase() + tone.slice(1),
      fg: `text.on-emphasis.${tone}`,
      bg: `background.interactive.${tone}.emphasis.default`,
    })),
  },
]

/** `text.primary · neutral.13` */
export const tokenLabel = (path: string) => `${path} · ${tokenTarget(path)}`

/**
 * Resolve the pattern groups against the Tokens Studio palettes of a scheme.
 * A pair whose token is missing from Tokens Studio is left out.
 */
export function buildPatternGroups(scheme: Scheme): PatternGroup[] {
  const ramps = toneRamps(scheme)
  return PATTERN_GROUP_SPECS.map(({ title, description, pairs }) => ({
    title,
    description,
    pairings: pairs.flatMap(({ state, fg, bg, type = 'text' }) => {
      const fgHex = resolveToken(fg, ramps, scheme)
      const bgHex = resolveToken(bg, ramps, scheme)
      if (!fgHex || !bgHex) return []
      return [
        {
          state,
          type,
          fg: { label: tokenLabel(fg), hex: fgHex },
          bg: { label: tokenLabel(bg), hex: bgHex },
          contrast: calcContrast(fgHex, bgHex),
        },
      ]
    }),
  }))
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** 0-based indices of the steps a Tokens Studio `text.*` or `icon.*` role uses. */
const TEXT_STEP_INDICES = stepsWithRole('text').map((step) => step.step - 1)

export function findBestPaletteText(
  bgIndex: number,
  steps: string[],
): TextChoice {
  const candidates = steps
    .map((hex, idx) => {
      if (idx === bgIndex) return null
      const result = calcContrast(hex, steps[bgIndex])
      return {
        idx,
        hex,
        result,
        wcagNum: parseFloat(result.wcag),
        isTextStep: TEXT_STEP_INDICES.includes(idx),
      }
    })
    .filter((c): c is NonNullable<typeof c> => c !== null)

  const find = (filter: (c: (typeof candidates)[0]) => boolean) =>
    candidates.filter(filter).sort((a, b) => b.wcagNum - a.wcagNum)[0]

  const pick =
    find((c) => c.isTextStep && c.wcagNum >= 7) ??
    find((c) => c.wcagNum >= 7) ??
    find((c) => c.isTextStep && c.wcagNum >= 4.5) ??
    find((c) => c.wcagNum >= 4.5) ??
    [...candidates].sort((a, b) => b.wcagNum - a.wcagNum)[0]

  return {
    ...pick.result,
    color: pick.hex,
    label: `Step ${stepLabel(pick.idx + 1)} (${pick.hex})`,
  }
}

export function buildStepData(
  steps: string[],
  mode: SortOrder,
  primitiveIndices?: number[],
): StepData[] {
  return steps.map((hex, index) => {
    const white = calcContrast('#ffffff', hex)
    const black = calcContrast('#000000', hex)
    const useWhite = parseFloat(white.wcag) >= parseFloat(black.wcag)
    const recommended: TextChoice = useWhite
      ? { ...white, color: '#ffffff', label: 'White (#ffffff)' }
      : { ...black, color: '#000000', label: 'Black (#000000)' }

    const paletteText = findBestPaletteText(index, steps)
    const stepNumber = primitiveIndices ? primitiveIndices[index] : index + 1

    return {
      step: stepNumber,
      role: mode === 'semantic' ? (PALETTE_STEPS[index]?.label ?? '') : '',
      hex,
      recommended,
      paletteText,
    }
  })
}
