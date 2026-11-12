/** The colour scheme a layer has after the migration, which decides the colours the window shows for it. */
import { NEW, OLD } from './inventory'

export type ColorScheme = 'light' | 'dark'

/**
 * A new colour scheme mode in force, or the one the legacy `🌗 Color scheme`
 * mode becomes (Light → light, Dark → dark), or light, the default of both
 * collections. This follows the layer on the canvas, not the theme of
 * Figma's interface.
 */
export function targetScheme(modes: Record<string, string>): ColorScheme {
  const set = modes[NEW.colorScheme]?.toLowerCase()
  if (set === 'light' || set === 'dark') return set
  return modes[OLD.colorScheme]?.toLowerCase() === 'dark' ? 'dark' : 'light'
}

/** The distinct schemes of some layers, light first; light when there are none. */
export function schemesOf(items: { scheme?: ColorScheme }[]): ColorScheme[] {
  const found = new Set(items.map((item) => item.scheme ?? 'light'))
  const schemes = (['light', 'dark'] as const).filter((scheme) =>
    found.has(scheme),
  )
  return schemes.length > 0 ? schemes : ['light']
}
