/**
 * The size of the plugin window. Figma does not let people resize a plugin
 * window, so the window has a grip in its corner that asks the main thread
 * to resize it, and the size is kept for the next time.
 */
export const WINDOW = {
  width: 480,
  height: 720,
  minWidth: 380,
  minHeight: 480,
  maxWidth: 1600,
  maxHeight: 1400,
} as const

/** The key of the window size in figma.clientStorage, kept per person. */
export const WINDOW_SIZE_KEY = 'window-size'

export function clampSize(
  width: number,
  height: number,
): { width: number; height: number } {
  return {
    width: Math.round(
      Math.min(WINDOW.maxWidth, Math.max(WINDOW.minWidth, width)),
    ),
    height: Math.round(
      Math.min(WINDOW.maxHeight, Math.max(WINDOW.minHeight, height)),
    ),
  }
}

/**
 * The introduction is shown once per person, on the first open. The key in
 * figma.clientStorage holds the version that was seen; raise INTRO_VERSION
 * to show it again after a large change.
 */
export const INTRO_KEY = 'intro-seen'
export const INTRO_VERSION = 1

/** The display settings, kept per person in figma.clientStorage. */
export const SETTINGS_KEY = 'settings'

/** The window's own theme: Figma's, or one the person chose in Settings. */
export type WindowTheme = 'figma' | 'light' | 'dark'

export type DisplaySettings = {
  /** The number of layers in each Changes row */
  showCounts: boolean
  /** Frames that use no EDS variables, in the Frames list */
  showEmpty: boolean
  theme: WindowTheme
}

export const DEFAULT_SETTINGS: DisplaySettings = {
  showCounts: true,
  showEmpty: false,
  theme: 'figma',
}

/** Settings read from storage, with the defaults for anything missing or of the wrong type. */
export function readSettings(saved: unknown): DisplaySettings {
  const value = (saved ?? {}) as Partial<Record<keyof DisplaySettings, unknown>>
  return {
    showCounts:
      typeof value.showCounts === 'boolean'
        ? value.showCounts
        : DEFAULT_SETTINGS.showCounts,
    showEmpty:
      typeof value.showEmpty === 'boolean'
        ? value.showEmpty
        : DEFAULT_SETTINGS.showEmpty,
    theme:
      value.theme === 'light' || value.theme === 'dark'
        ? value.theme
        : DEFAULT_SETTINGS.theme,
  }
}
