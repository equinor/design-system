/**
 * What the plugin keeps in the document between sessions, in the shared
 * plugin data of the document root: the latest scan summary, shown when the
 * plugin opens, and the designer's choices, so a review can continue
 * another day.
 */
import type { Overrides } from '../scan/mapping'
import { emptyCounts } from '../scan/summary'
import type { ScanSummary } from '../scan/types'
import { NAMESPACE } from '../shared/changelog'
import type { SavedHealth } from '../shared/messages'

const HEALTH_KEY = 'health'
const CHOICES_KEY = 'choices'
/** Figma limits how much plugin data a node holds; past this the choices are not saved. */
const MAX_CHOICES_LENGTH = 90_000

function read<T>(key: string): T | undefined {
  try {
    const raw = figma.root.getSharedPluginData(NAMESPACE, key)
    return raw ? (JSON.parse(raw) as T) : undefined
  } catch {
    return undefined
  }
}

function write(key: string, value: unknown): boolean {
  try {
    figma.root.setSharedPluginData(NAMESPACE, key, JSON.stringify(value))
    return true
  } catch {
    // A file opened for viewing only cannot store anything.
    return false
  }
}

export function saveHealth(summary: ScanSummary): void {
  const place =
    summary.scope === 'file'
      ? 'The whole file'
      : summary.scope === 'page'
        ? `Page ${summary.pages[0]?.name ?? ''}`
        : `Selection on ${summary.pages[0]?.name ?? ''}`
  const saved: SavedHealth = {
    scannedAt: summary.scannedAt,
    place,
    nodesScanned: summary.nodesScanned,
    totals: summary.totals,
    health: summary.health,
    frames: summary.entries
      .filter((entry) => entry.kind !== 'component' && entry.health !== null)
      .sort((a, b) => (a.health ?? 0) - (b.health ?? 0))
      .slice(0, 20)
      .map((entry) => ({
        name: entry.name,
        pageName: entry.pageName,
        health: entry.health,
      })),
  }
  write(HEALTH_KEY, saved)
}

export function loadHealth(): SavedHealth | undefined {
  const saved = read<SavedHealth>(HEALTH_KEY)
  // Saved before Excluded was counted on its own
  return saved && { ...saved, totals: { ...emptyCounts(), ...saved.totals } }
}

/** Saves the choices; false when there are too many to keep in the file. */
export function saveChoices(overrides: Overrides): boolean {
  const json = JSON.stringify(overrides)
  if (json.length > MAX_CHOICES_LENGTH) return false
  return write(CHOICES_KEY, overrides)
}

export function loadChoices(): Overrides {
  const saved = read<Overrides>(CHOICES_KEY)
  return saved && typeof saved === 'object' && saved.records && saved.rows
    ? saved
    : { records: {}, rows: {} }
}
