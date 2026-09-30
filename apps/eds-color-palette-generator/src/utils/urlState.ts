import type { ColorAnchor } from '@/types'

export type PaletteInput = {
  /** Client-side identity for React keys; not written to the URL */
  id?: string
  name: string
  baseColor: string
  anchors?: ColorAnchor[]
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

// `,` separates palettes, `:` the name, `@` anchors and `=` an anchor's step,
// so those (and `%`) are percent-encoded inside names and values.
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
 * URL format:
 *
 * Simple palette (single color):
 *   Name:hex
 *   e.g. Gray:4a4a4a
 *
 * Anchor palette (OKLCH anchors):
 *   Name:a@step1=oklch(...)@step2=oklch(...)
 *   e.g. Moss+Green:a@6=oklch(0.5915+0.0731+184.63)@9=oklch(0.4973+0.084851+204.553)
 *
 * The "a" after the first colon signals anchor mode.
 * Spaces in OKLCH are encoded as "+" (URLSearchParams handles this).
 */

function serializePalette(p: PaletteInput): string {
  const name = escapeSegment(p.name)
  if (p.anchors && p.anchors.length > 0) {
    const anchorParts = p.anchors
      .map((a) => `${a.step}=${escapeSegment(a.value).replace(/ /g, '+')}`)
      .join('@')
    return `${name}:a@${anchorParts}`
  }
  return `${name}:${escapeSegment(p.baseColor.replace('#', ''))}`
}

function deserializePalette(entry: string): PaletteInput {
  const firstColon = entry.indexOf(':')
  if (firstColon === -1) {
    return { name: unescapeSegment(entry), baseColor: '808080' }
  }

  const name = unescapeSegment(entry.slice(0, firstColon))
  const rest = entry.slice(firstColon + 1)

  // Check for anchor format: starts with "a@"
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
      return { name, baseColor: '', anchors }
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
