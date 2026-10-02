import type { ColorAnchor } from '@/types'

export type PaletteInput = {
  /** Client-side identity for React keys; not written to the URL */
  id?: string
  name: string
  /** The palette's one colour, its anchor, usually OKLCH */
  baseColor: string
}

/**
 * One colour for a palette from an older link or file that had several
 * anchors: the anchor nearest step 9, the emphasis fill. Tokens Studio kept
 * the step 9 anchors when it took over the 2.x hues.
 */
export function colourFromAnchors(anchors: ColorAnchor[]): string {
  return anchors.reduce((nearest, anchor) =>
    Math.abs(anchor.step - 9) < Math.abs(nearest.step - 9) ? anchor : nearest,
  ).value
}

let nextPaletteId = 0

/** A fresh id for a palette row. */
export function newPaletteId(): string {
  nextPaletteId += 1
  return `palette-${nextPaletteId}`
}

/** Give every palette an id, keeping the ones it already has. */
export function withPaletteIds(palettes: PaletteInput[]): PaletteInput[] {
  return palettes.map((p) => (p.id ? p : { ...p, id: newPaletteId() }))
}

// `,` separates palettes and `:` the name. Older links also used `@` for
// anchors and `=` for an anchor's step, so all four (and `%`) are
// percent-encoded inside names and values.
function escapeSegment(value: string): string {
  return value.replace(
    /[%,:@=]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
  )
}

function unescapeSegment(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    // Links from before escaping may contain a bare `%`.
    return value
  }
}

export const THEME_BUILDER_TABS = ['system', 'examples', 'contrast'] as const

export type ThemeBuilderTab = (typeof THEME_BUILDER_TABS)[number]

/** Tab keys from before the UI was translated, still found in shared links. */
const LEGACY_TABS: Record<string, ThemeBuilderTab> = {
  fargesystem: 'system',
  eksempler: 'examples',
  kontrast: 'contrast',
}

function parseTab(value: string | null): ThemeBuilderTab | undefined {
  if (!value) return undefined
  if ((THEME_BUILDER_TABS as readonly string[]).includes(value)) {
    return value as ThemeBuilderTab
  }
  return LEGACY_TABS[value]
}

type ThemeBuilderState = {
  palettes: PaletteInput[]
  activeTab: ThemeBuilderTab
  mode: 'light' | 'dark'
  advancedMode: boolean
}

/**
 * URL format, one entry per palette:
 *
 *   Name:colour
 *   e.g. Moss+Green:oklch(0.4973+0.084851+204.553), or Gray:4a4a4a in older
 *   links
 *
 * Older links could also hold several anchors, `Name:a@6=oklch(…)@9=oklch(…)`.
 * Those are read as one colour (see `colourFromAnchors`).
 * Spaces in OKLCH are encoded as "+" (URLSearchParams handles this).
 */

function serializePalette(p: PaletteInput): string {
  const name = escapeSegment(p.name)
  return `${name}:${escapeSegment(p.baseColor.replace('#', ''))}`
}

function deserializePalette(entry: string): PaletteInput {
  const firstColon = entry.indexOf(':')
  if (firstColon === -1) {
    return { name: unescapeSegment(entry), baseColor: '808080' }
  }

  const name = unescapeSegment(entry.slice(0, firstColon))
  const rest = entry.slice(firstColon + 1)

  // Older links with several anchors: "a@6=oklch(…)@9=oklch(…)"
  if (rest.startsWith('a@')) {
    const anchorStr = rest.slice(2) // strip "a@"
    const parts = anchorStr.split('@')
    const anchors: ColorAnchor[] = parts
      .map((part) => {
        const eqIdx = part.indexOf('=')
        if (eqIdx === -1) return null
        const step = parseInt(part.slice(0, eqIdx), 10)
        const value = unescapeSegment(part.slice(eqIdx + 1).replace(/\+/g, ' '))
        if (isNaN(step)) return null
        return { step, value }
      })
      .filter((a): a is ColorAnchor => a !== null)

    if (anchors.length > 0) {
      return { name, baseColor: colourFromAnchors(anchors) }
    }
    return { name, baseColor: '808080' }
  }

  // Simple hex format
  return { name, baseColor: unescapeSegment(rest) }
}

export function serializeState(state: Partial<ThemeBuilderState>): string {
  const params = new URLSearchParams()

  if (state.palettes && state.palettes.length > 0) {
    const encoded = state.palettes.map(serializePalette).join(',')
    params.set('p', encoded)
  }

  if (state.activeTab && state.activeTab !== 'system') {
    params.set('tab', state.activeTab)
  }

  if (state.mode && state.mode !== 'light') {
    params.set('mode', state.mode)
  }

  if (state.advancedMode) {
    params.set('adv', '1')
  }

  return params.toString()
}

export function deserializeState(
  searchParams: URLSearchParams,
): Partial<ThemeBuilderState> {
  const result: Partial<ThemeBuilderState> = {}

  const p = searchParams.get('p')
  if (p) {
    const palettes = p.split(',').map(deserializePalette)
    if (palettes.length > 0) {
      result.palettes = palettes
    }
  }

  const tab = parseTab(searchParams.get('tab'))
  if (tab) {
    result.activeTab = tab
  }

  const mode = searchParams.get('mode')
  if (mode === 'light' || mode === 'dark') {
    result.mode = mode
  }

  if (searchParams.has('adv')) {
    result.advancedMode = true
  }

  return result
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null

/** Drop a pending URL update, e.g. when the page unmounts. */
export function cancelURLUpdate(): void {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = null
}

export function updateURL(state: Partial<ThemeBuilderState>): void {
  if (typeof window === 'undefined') return

  if (debounceTimer) clearTimeout(debounceTimer)

  debounceTimer = setTimeout(() => {
    const qs = serializeState(state)
    const newURL = qs
      ? `${window.location.pathname}?${qs}`
      : window.location.pathname
    window.history.replaceState(null, '', newURL)
  }, 300)
}
