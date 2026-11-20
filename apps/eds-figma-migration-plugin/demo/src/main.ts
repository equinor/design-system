/**
 * The demo of the plugin window. The window, built from src/ui as for Figma,
 * runs in an iframe as it does in Figma, and DemoPlugin answers its messages
 * in place of the plugin main thread. The iframe's document is given as
 * `srcdoc`, so it has the page's origin, and the page can set Figma's theme
 * class on it and click its controls to get to a step.
 *
 * `?step=` opens the demo at a step (steps.ts), and `?theme=light|dark` sets
 * Figma's theme; without it, the demo follows the reader's colour scheme.
 * The page sets `data-state` on the window frame to `ready` when the step is
 * shown, or `failed` with the reason in `data-error`, for the image script.
 */
import { windowHtml } from 'virtual:demo-window'
import { WINDOW } from '../../src/shared/window'
import type { PluginToUi, UiToPlugin } from '../../src/shared/messages'
import { DemoPlugin } from './mock/plugin'
import type { CanvasAction } from './mock/plugin'
import { goTo, isStep } from './steps'
import './demo.css'

type Theme = 'light' | 'dark'

const params = new URLSearchParams(location.search)
const requested = params.get('step')
const step = isStep(requested) ? requested : undefined
const themeParam = params.get('theme')
const fixedTheme: Theme | undefined =
  themeParam === 'light' || themeParam === 'dark' ? themeParam : undefined
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')

const frame = document.querySelector<HTMLElement>('.demo-window')
const body = document.querySelector<HTMLElement>('.demo-body')
const note = document.querySelector<HTMLElement>('.demo-note')
if (!frame || !body || !note) throw new Error('The demo page is incomplete')

frame.style.setProperty('--demo-width', `${WINDOW.width + 2}px`)
frame.style.setProperty('--demo-height', `${WINDOW.height + 40 + 2}px`)

function theme(): Theme {
  return fixedTheme ?? (prefersDark.matches ? 'dark' : 'light')
}

/** Figma puts `figma-light` or `figma-dark` on the window's <html> before it loads, with `themeColors: true`. */
function withTheme(html: string, scheme: Theme): string {
  return html.replace(/<html\b/i, `<html class="figma-${scheme}"`)
}

const iframe = document.createElement('iframe')
iframe.title = 'EDS Variable Migration [BETA], the plugin window'
iframe.srcdoc = withTheme(windowHtml, theme())
body.append(iframe)

function applyTheme() {
  const scheme = theme()
  document.documentElement.dataset.theme = scheme
  const root = iframe.contentDocument?.documentElement
  if (!root) return
  root.classList.remove('figma-light', 'figma-dark')
  root.classList.add(`figma-${scheme}`)
}
applyTheme()
if (!fixedTheme) prefersDark.addEventListener('change', applyTheme)

// --- Notes on what a button does on Figma's canvas

/** The control the reader last pressed in the window, to tell their clicks from the window's own messages. */
let pressed: { at: number; label: string } | undefined
let hideNote: ReturnType<typeof setTimeout> | undefined

function labelOf(target: EventTarget | null): string {
  // The target is an element of the window's document, so it is not an
  // instance of this page's Element.
  const element =
    target !== null && 'closest' in target
      ? (target as Element).closest(
          'button, [role="button"], [role="tab"], a, label',
        )
      : null
  return (
    element?.getAttribute('aria-label') ??
    element?.textContent ??
    ''
  ).trim()
}

function watchPresses(window: Window) {
  window.document.addEventListener(
    'pointerdown',
    (event) => {
      pressed = { at: Date.now(), label: labelOf(event.target) }
      // The note is about the last press; a new one answers the next.
      if (note) delete note.dataset.shown
    },
    true,
  )
  window.document.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        pressed = {
          at: Date.now(),
          label: labelOf(window.document.activeElement),
        }
      }
    },
    true,
  )
}

/** The reader pressed a control just now, so a message is their doing. */
function pressedNow(): string | undefined {
  return pressed && Date.now() - pressed.at < 1500 ? pressed.label : undefined
}

const plural = (count: number, one: string, many: string) =>
  count === 1 ? one : many

const REVIEW_BUTTON =
  /^(Review|Confirm proposal|Use |Decide later|Previous|Accept the fix|Clear it|Remove anyway)/

function noteFor(action: CanvasAction): string | undefined {
  const label = pressedNow()
  switch (action.type) {
    case 'select': {
      // Review selects each layer by itself; Go to and rows do it on a click.
      if (label === undefined) return undefined
      if (REVIEW_BUTTON.test(label)) {
        return 'In Figma, Review selects each layer on the canvas as you go.'
      }
      const what = plural(
        action.count,
        'the layer',
        `the ${action.count} layers`,
      )
      const it = plural(action.count, 'it', 'them')
      return label.startsWith('Go to')
        ? `In Figma, Go to selects ${what} on the canvas and zooms to ${it}.`
        : `In Figma, this selects ${what} on the canvas.`
    }
    case 'select-old':
      return label === undefined
        ? undefined
        : `In Figma, this selects the ${plural(action.count, 'layer that uses', `${action.count} layers that use`)} this legacy variable.`
    case 'go-to-page':
      return `In Figma, this opens the page ${action.pageName}.`
    case 'scan-page-of':
      return `In Figma, this opens the page ${action.pageName} and selects the main component before the scan.`
    case 'notify':
      return action.message
    case 'resize':
      return 'In Figma, the grip resizes the plugin window. The demo keeps its size.'
    case 'reset-window-size':
      return 'In Figma, this puts the plugin window back to its first size.'
  }
}

function showNote(action: CanvasAction) {
  const text = noteFor(action)
  if (!text || !note) return
  // Above the Apply footer, which the window keeps at its bottom edge.
  const footer = iframe.contentDocument?.documentElement.style.getPropertyValue(
    '--apply-footer-height',
  )
  note.style.setProperty(
    '--demo-note-offset',
    `${(Number.parseFloat(footer ?? '') || 0) + 16}px`,
  )
  note.textContent = text
  note.dataset.shown = ''
  clearTimeout(hideNote)
  hideNote = setTimeout(() => delete note.dataset.shown, 5000)
}

// --- The stand-in for the main thread

const plugin = new DemoPlugin({
  post: (message: PluginToUi) =>
    iframe.contentWindow?.postMessage({ pluginMessage: message }, '*'),
  onCanvas: showNote,
  introSeen: step !== 'intro',
})

window.addEventListener(
  'message',
  (event: MessageEvent<{ pluginMessage?: UiToPlugin }>) => {
    if (event.source !== iframe.contentWindow) return
    const message = event.data?.pluginMessage
    if (message) void plugin.handle(message)
  },
)

function show(state: 'ready' | 'failed', error?: string) {
  if (!frame) return
  frame.dataset.state = state
  if (error) frame.dataset.error = error
}

iframe.addEventListener('load', () => {
  const inner = iframe.contentWindow
  const document = iframe.contentDocument
  if (!inner || !document) return
  applyTheme()
  watchPresses(inner)
  if (!step) {
    show('ready')
    return
  }
  plugin.setPace('fast')
  goTo(step, document)
    .then(() => show('ready'))
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error)
      console.error(`The demo could not open the step ${step}:`, message)
      show('failed', message.split('\n')[0])
    })
    .finally(() => plugin.setPace('live'))
})
