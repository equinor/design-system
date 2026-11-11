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
