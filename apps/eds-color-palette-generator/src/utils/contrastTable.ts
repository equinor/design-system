/**
 * The Theme Builder's contrast table, in Tokens Studio roles (ADR 0016).
 *
 * Columns are backgrounds, rows are foregrounds. The active palette plays the
 * `<tone>` in every per-tone role, so the table shows how that palette works
 * as, say, the accent. Neutral and info roles come from the palettes named
 * after those tones' Tokens Studio hues, or from the Tokens Studio defaults.
 *
 * Contrast is APCA (ADR 0016 Confirmation 5); WCAG ratios are kept as
 * secondary information.
 */
import { APCA_CONTRAST_LEVELS } from '@/config/APCA_CONTRAST_LEVELS'
import { collapseTone, type Scheme, type Tone } from '@/config/tokensStudio'
import { calcContrast } from '@/utils/palette'
import {
  paletteForTone,
  resolveToken,
  tokenStep,
  tokenTone,
  toneRamps,
  type NamedRamp,
} from '@/utils/semanticTokens'

/**
 * The tone the active palette stands in for. Per-tone paths below are
 * written with this tone and displayed with `<tone>`.
 */
const ACTIVE_TONE = 'accent' satisfies Tone

type Entry = { label: string; path: string }

/** Background columns, grouped for the header row. */
export const CONTRAST_COLUMN_GROUPS: { group: string; columns: Entry[] }[] = [
  {
    group: 'background',
    columns: [
      { label: 'canvas', path: 'background.canvas' },
      { label: 'surface', path: 'background.surface' },
    ],
  },
  {
    group: 'background.interactive.<tone>.muted',
    columns: [
      { label: 'default', path: 'background.interactive.accent.muted.default' },
      { label: 'hover', path: 'background.interactive.accent.muted.hover' },
      { label: 'pressed', path: 'background.interactive.accent.muted.pressed' },
    ],
  },
  {
    group: 'background.interactive.<tone>.emphasis',
    columns: [
      {
        label: 'default',
        path: 'background.interactive.accent.emphasis.default',
      },
      { label: 'hover', path: 'background.interactive.accent.emphasis.hover' },
      {
        label: 'pressed',
        path: 'background.interactive.accent.emphasis.pressed',
      },
    ],
  },
]

/** Foreground rows. */
export const CONTRAST_ROW_PATHS: string[] = [
  'text.primary',
  'text.secondary',
  'text.tertiary',
  'text.on-default.accent',
  'text.on-muted.accent',
  'text.on-emphasis.accent',
  'text.interactive.link.default',
]

/** The pairs ADR 0016 Confirmation 5 checks, with their APCA targets. */
export const ADR_CHECKS: { fg: string; bg: string; lc: number }[] = [
  {
    fg: 'text.primary',
    bg: 'background.surface',
    lc: APCA_CONTRAST_LEVELS.LC_90.value,
  },
  {
    fg: 'text.secondary',
    bg: 'background.surface',
    lc: APCA_CONTRAST_LEVELS.LC_60.value,
  },
  {
    fg: 'text.on-emphasis.accent',
    bg: 'background.interactive.accent.emphasis.default',
    lc: APCA_CONTRAST_LEVELS.LC_60.value,
  },
]

/** APCA badge thresholds, highest first. */
const APCA_BADGE_LEVELS = [
  APCA_CONTRAST_LEVELS.LC_90.value,
  APCA_CONTRAST_LEVELS.LC_75.value,
  APCA_CONTRAST_LEVELS.LC_60.value,
  APCA_CONTRAST_LEVELS.LC_45.value,
  APCA_CONTRAST_LEVELS.LC_30.value,
]

export type ApcaLevel = {
  /** Badge text, e.g. `90+` or `FAIL` */
  label: string
  /** ≥ Lc 60 passes, Lc 30–59 is limited use, below Lc 30 fails */
  kind: 'pass' | 'level' | 'fail'
}

/** The APCA level an Lc value reaches: 90, 75, 60, 45, 30, or fail. */
export function apcaLevel(lc: number): ApcaLevel {
  const abs = Math.abs(lc)
  const level = APCA_BADGE_LEVELS.find((min) => abs >= min)
  if (level === undefined) return { label: 'FAIL', kind: 'fail' }
  return {
    label: `${level}+`,
    kind: level >= APCA_CONTRAST_LEVELS.LC_60.value ? 'pass' : 'level',
  }
}

export type ResolvedEntry = {
  /** Short label, e.g. `canvas`, or the role for rows */
  label: string
  /** Tokens Studio path used to resolve the colour */
  path: string
  /** Display role with `<tone>` for per-tone roles */
  role: string
  step: number
  /** Name of the palette the colour comes from */
  paletteName: string
  /** True when the colour comes from the active palette */
  fromActive: boolean
  hex: string
}

export type ResolvedColumn = ResolvedEntry & {
  group: string
  /** First column of its group, for the group separator */
  firstInGroup: boolean
}

export type ContrastGridCell = {
  column: ResolvedColumn
  lc: number
  wcag: string
  level: ApcaLevel
  /** Set for the pairs ADR 0016 checks */
  check?: { target: number; pass: boolean }
}

export type ContrastGridRow = ResolvedEntry & { cells: ContrastGridCell[] }

export type ContrastGrid = {
  columns: ResolvedColumn[]
  rows: ContrastGridRow[]
}

/**
 * Resolve the table for one active palette. Entries whose token is missing
 * from Tokens Studio are left out rather than shown with a wrong colour.
 */
export function buildContrastGrid(
  palettes: NamedRamp[],
  active: NamedRamp,
  scheme: Scheme,
): ContrastGrid {
  const ramps = toneRamps(scheme, palettes, { [ACTIVE_TONE]: active.steps })

  const resolve = (entry: Entry): ResolvedEntry | undefined => {
    const hex = resolveToken(entry.path, ramps, scheme)
    const step = tokenStep(entry.path)
    const tone = tokenTone(entry.path)
    if (!hex || step === undefined || tone === undefined) return undefined
    const fromActive = tone === ACTIVE_TONE
    return {
      label: entry.label,
      path: entry.path,
      role: fromActive ? collapseTone(entry.path) : entry.path,
      step,
      paletteName: fromActive
        ? active.name
        : paletteForTone(palettes, tone, scheme).name,
      fromActive,
      hex,
    }
  }

  const columns = CONTRAST_COLUMN_GROUPS.flatMap(({ group, columns }) =>
    columns.flatMap((entry, i) => {
      const resolved = resolve(entry)
      return resolved ? [{ ...resolved, group, firstInGroup: i === 0 }] : []
    }),
  )

  const rows = CONTRAST_ROW_PATHS.flatMap((path) => {
    const row = resolve({ label: path, path })
    if (!row) return []
    const cells = columns.map((column): ContrastGridCell => {
      const result = calcContrast(row.hex, column.hex)
      const lc = parseFloat(result.apca)
      const adr = ADR_CHECKS.find(
        (c) => c.fg === row.path && c.bg === column.path,
      )
      return {
        column,
        lc,
        wcag: result.wcag,
        level: apcaLevel(lc),
        check: adr ? { target: adr.lc, pass: lc >= adr.lc } : undefined,
      }
    })
    return [{ ...row, label: row.role, cells }]
  })

  return { columns, rows }
}
