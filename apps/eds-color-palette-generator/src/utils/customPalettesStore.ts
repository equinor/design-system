import { useSyncExternalStore } from 'react'
import { getSimulationPalettes, type TokenPalette } from '@/utils/palette'

/* ------------------------------------------------------------------ */
/*  Custom-palette store — SSR-safe mirror of the localStorage bridge   */
/*  filled by the Palette Editor. useSyncExternalStore renders [] on    */
/*  the server + first client paint, then the stored value after        */
/*  hydration; refreshCustomPalettes() re-reads on demand.              */
/* ------------------------------------------------------------------ */

const SIMULATION_REFRESH_EVENT = 'eds-simulation-palettes-refresh'
const EMPTY_PALETTES: TokenPalette[] = []
let cachedRaw: string | null = null
let cachedPalettes: TokenPalette[] = EMPTY_PALETTES

function getSnapshot(): TokenPalette[] {
  const next = getSimulationPalettes() // [] during SSR (window guard)
  const raw = JSON.stringify(next) // stable ref unless content changed
  if (raw === cachedRaw) return cachedPalettes
  cachedRaw = raw
  cachedPalettes = next
  return cachedPalettes
}

function getServerSnapshot(): TokenPalette[] {
  return EMPTY_PALETTES
}

function subscribe(callback: () => void): () => void {
  window.addEventListener(SIMULATION_REFRESH_EVENT, callback)
  return () => window.removeEventListener(SIMULATION_REFRESH_EVENT, callback)
}

/** Subscribe to the custom palettes saved by the Palette Editor. */
export function useCustomPalettes(): TokenPalette[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/** Re-read the stored custom palettes on demand (e.g. a Refresh button). */
export function refreshCustomPalettes(): void {
  window.dispatchEvent(new Event(SIMULATION_REFRESH_EVENT))
}
