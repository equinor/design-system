import type { ColorScheme, Density } from './preferences'

/** Messages between the editor app and the preview in its iframe. Both are
 * served from the same origin. */
export type ToPreview =
  | { type: 'eds-demo:css'; css: string }
  | {
      type: 'eds-demo:settings'
      colorScheme: ColorScheme
      density: Density
      /** Shows the class names under the pointer, and picks one on click */
      inspect: boolean
      /** How much the frame is scaled down, so the inspector's label can be
       * drawn at full size */
      scale: number
    }

export type FromPreview =
  | { type: 'eds-demo:ready' }
  | { type: 'eds-demo:applied' }
  | { type: 'eds-demo:toggle-mode' }
  /** The class names of the element that was clicked while inspecting */
  | { type: 'eds-demo:inspect-pick'; classes: string[] }

export function isMessage<T extends { type: string }>(
  data: unknown,
): data is T {
  return (
    typeof data === 'object' &&
    data !== null &&
    'type' in data &&
    typeof data.type === 'string' &&
    data.type.startsWith('eds-demo:')
  )
}

/** Ctrl + Shift + S, or ⌘ + Shift + S on macOS: switch between the exercise
 * and the solution. */
export function isToggleShortcut(event: KeyboardEvent) {
  return (
    (event.ctrlKey || event.metaKey) &&
    event.shiftKey &&
    !event.altKey &&
    event.key.toLowerCase() === 's'
  )
}
