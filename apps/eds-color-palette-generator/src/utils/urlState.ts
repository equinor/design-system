import type { ColorAnchor } from '@/types'

export type PaletteInput = {
  name: string
  baseColor: string
  anchors?: ColorAnchor[]
}

type ThemeBuilderState = {
  palettes: PaletteInput[]
  activeTab: 'fargesystem' | 'eksempler' | 'kontrast'
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
  if (p.anchors && p.anchors.length > 0) {
    const anchorParts = p.anchors
      .map((a) => `${a.step}=${a.value.replace(/ /g, '+')}`)
      .join('@')
    return `${p.name}:a@${anchorParts}`
  }
  return `${p.name}:${p.baseColor.replace('#', '')}`
}

function deserializePalette(entry: string): PaletteInput {
  const firstColon = entry.indexOf(':')
  if (firstColon === -1) {
    return { name: entry, baseColor: '808080' }
  }

  const name = decodeURIComponent(entry.slice(0, firstColon))
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
        const value = part.slice(eqIdx + 1).replace(/\+/g, ' ')
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
  return { name, baseColor: rest }
}

export function serializeState(state: Partial<ThemeBuilderState>): string {
  const params = new URLSearchParams()

  if (state.palettes && state.palettes.length > 0) {
    const encoded = state.palettes.map(serializePalette).join(',')
    params.set('p', encoded)
  }

  if (state.activeTab && state.activeTab !== 'fargesystem') {
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

  const tab = searchParams.get('tab')
  if (tab === 'fargesystem' || tab === 'eksempler' || tab === 'kontrast') {
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
