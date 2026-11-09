export const modes = ['exercise', 'solution'] as const
/** The CSS of each mode, one file per part of the screen, in the order the
 * frame loads them. */
export const cssFiles = ['page', 'top-bar', 'navigation', 'table'] as const
export const views = ['row', 'column', 'fullscreen'] as const
export const colorSchemes = ['light', 'dark'] as const
export const densities = ['compact', 'comfortable', 'relaxed'] as const

export type Mode = (typeof modes)[number]
export type CssFile = (typeof cssFiles)[number]
/** The CSS of every file in both modes */
export type Sources = Record<Mode, Record<CssFile, string>>
export type View = (typeof views)[number]
export type ColorScheme = (typeof colorSchemes)[number]
export type Density = (typeof densities)[number]

/** Returns value if it is one of values, otherwise fallback. */
export function pick<T extends string>(
  values: readonly T[],
  value: string | null | undefined,
  fallback: T,
): T {
  return values.find((option) => option === value) ?? fallback
}

const PREFIX = 'eds-demo:'

export const storageKeys = {
  css: (mode: Mode, file: CssFile) => `${PREFIX}css:${mode}:${file}`,
  file: `${PREFIX}file`,
  mode: `${PREFIX}mode`,
  view: `${PREFIX}view`,
  colorScheme: `${PREFIX}color-scheme`,
  density: `${PREFIX}density`,
  /** Whether the token reference is open */
  tokens: `${PREFIX}tokens`,
  /** The position of a splitter: between the frame and the editor in Row
   * and Column, and between the editor and the token reference */
  split: (name: 'row' | 'column' | 'tokens') => `${PREFIX}split-${name}`,
}

/** localStorage can throw (private windows, blocked storage), and the demo
 * should still work without it. */
export function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Saving is a convenience; the demo works without it.
  }
}

export function removeStorage(key: string) {
  try {
    window.localStorage.removeItem(key)
  } catch {
    // See writeStorage.
  }
}
