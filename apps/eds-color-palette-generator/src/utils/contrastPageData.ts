import Color from 'colorjs.io'
import {
  STEP_ROLES,
  PALETTES,
  calcContrast,
  type ContrastResult,
} from '@/utils/palette'

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
/*  Combined view — real cross-palette interaction patterns            */
/* ------------------------------------------------------------------ */

export type Pairing = {
  state: string
  type: 'text' | 'border' | 'fill'
  fg: { label: string; hex: string }
  bg: { label: string; hex: string }
  contrast: ContrastResult
}

export type PatternGroup = {
  title: string
  description: string
  pairings: Pairing[]
}

export function buildPatternGroups(): PatternGroup[] {
  const g = PALETTES[1].steps // Gray
  const a = PALETTES[0].steps // Moss Green (Accent)

  function p(
    state: string,
    fgLabel: string,
    fgHex: string,
    bgLabel: string,
    bgHex: string,
    type: 'text' | 'border' | 'fill' = 'text',
  ): Pairing {
    return {
      state,
      type,
      fg: { label: fgLabel, hex: fgHex },
      bg: { label: bgLabel, hex: bgHex },
      contrast: calcContrast(fgHex, bgHex),
    }
  }

  return [
    {
      title: 'Border: Neutral → Accent on selection',
      description: 'Border starts Gray, switches to Accent on focus/selected',
      pairings: [
        p('Default', `Gray/6 border-subtle`, g[5], `Gray/1 bg-canvas`, g[0], 'border'),
        p('Hover', `Gray/7 border-medium`, g[6], `Gray/1 bg-canvas`, g[0], 'border'),
        p('Selected', `Accent/8 border-strong`, a[7], `Gray/1 bg-canvas`, g[0], 'border'),
        p('Default', `Gray/6 border-subtle`, g[5], `Gray/2 bg-surface`, g[1], 'border'),
        p('Hover', `Gray/7 border-medium`, g[6], `Gray/2 bg-surface`, g[1], 'border'),
        p('Selected', `Accent/8 border-strong`, a[7], `Gray/2 bg-surface`, g[1], 'border'),
      ],
    },
    {
      title: 'Accent text on Neutral backgrounds',
      description: 'Accent-colored text and icons on Gray surfaces',
      pairings: [
        p('Subtle', `Accent/12 text-subtle`, a[11], `Gray/1 bg-canvas`, g[0]),
        p('Strong', `Accent/13 text-strong`, a[12], `Gray/1 bg-canvas`, g[0]),
        p('Subtle', `Accent/12 text-subtle`, a[11], `Gray/2 bg-surface`, g[1]),
        p('Strong', `Accent/13 text-strong`, a[12], `Gray/2 bg-surface`, g[1]),
        p('Subtle', `Accent/12 text-subtle`, a[11], `Gray/3 bg-fill-muted`, g[2]),
        p('Strong', `Accent/13 text-strong`, a[12], `Gray/3 bg-fill-muted`, g[2]),
      ],
    },
    {
      title: 'Accent fills on Neutral canvas',
      description: 'Accent muted/emphasis fills visible on Gray backgrounds',
      pairings: [
        p('Muted', `Accent/3 fill-muted`, a[2], `Gray/1 bg-canvas`, g[0], 'fill'),
        p('Muted', `Accent/3 fill-muted`, a[2], `Gray/2 bg-surface`, g[1], 'fill'),
        p('Emphasis', `Accent/9 fill-emphasis`, a[8], `Gray/1 bg-canvas`, g[0], 'fill'),
        p('Emphasis', `Accent/9 fill-emphasis`, a[8], `Gray/2 bg-surface`, g[1], 'fill'),
      ],
    },
    {
      title: 'Text on Accent emphasis fills',
      description: 'Readable text on Accent dark backgrounds',
      pairings: [
        p('White', `White`, '#ffffff', `Accent/9 emphasis-default`, a[8]),
        p('On-emphasis', `Accent/15 strong-on-emphasis`, a[14], `Accent/9 emphasis-default`, a[8]),
        p('On-emphasis', `Accent/14 subtle-on-emphasis`, a[13], `Accent/9 emphasis-default`, a[8]),
        p('Gray strong', `Gray/13 text-strong`, g[12], `Accent/9 emphasis-default`, a[8]),
      ],
    },
    {
      title: 'Neutral text on Accent muted fills',
      description: 'Text readability on light Accent backgrounds',
      pairings: [
        p('Gray strong', `Gray/13 text-strong`, g[12], `Accent/3 fill-muted-default`, a[2]),
        p('Accent strong', `Accent/13 text-strong`, a[12], `Accent/3 fill-muted-default`, a[2]),
        p('Gray strong', `Gray/13 text-strong`, g[12], `Accent/5 fill-muted-active`, a[4]),
        p('Accent strong', `Accent/13 text-strong`, a[12], `Accent/5 fill-muted-active`, a[4]),
      ],
    },
  ]
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

export function findBestPaletteText(bgIndex: number, steps: string[]): TextChoice {
  const textStepIndices = [11, 12, 13, 14]
  const candidates = steps
    .map((hex, idx) => {
      if (idx === bgIndex) return null
      const result = calcContrast(hex, steps[bgIndex])
      return {
        idx,
        hex,
        result,
        wcagNum: parseFloat(result.wcag),
        isTextStep: textStepIndices.includes(idx),
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
    label: `Step ${pick.idx + 1} · ${STEP_ROLES[pick.idx]} (${pick.hex})`,
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
      role: mode === 'semantic' ? STEP_ROLES[index] : '',
      hex,
      recommended,
      paletteText,
    }
  })
}
