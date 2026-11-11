/**
 * The shell around the prototype window: a rough Figma with pages, a canvas
 * that shows the test frame and highlights what Go to selects, and the
 * plugin window in an iframe. Messages between the window and the mock
 * plugin follow Figma's contract: `{ pluginMessage }` both ways.
 */
import frameImage from '../../assets/test-frame.png'
import boxesJson from '../mock/boxes.json'
import { originalId } from '../mock/data'
import { MockPlugin } from '../mock/plugin'
import type { PluginToUi, UiToPlugin } from '../../../src/shared/messages'
import './shell.css'

type Box = { name: string; x: number; y: number; w: number; h: number }
const { size, boxes } = boxesJson as unknown as {
  size: [number, number]
  boxes: Record<string, Box>
}

const $ = <T extends HTMLElement>(id: string) =>
  document.getElementById(id) as T

const iframe = $<HTMLIFrameElement>('plugin')
const toast = $<HTMLSpanElement>('toast')
const highlights = $<HTMLDivElement>('highlights')
const frame = $<HTMLDivElement>('canvas-frame')
const note = $<HTMLParagraphElement>('canvas-note')
const label = $<HTMLParagraphElement>('selected-label')
const pageTitle = $<HTMLDivElement>('canvas-page')
const pagesList = $<HTMLUListElement>('pages')
const selectionPicker = $<HTMLSelectElement>('selection')
const themePicker = $<HTMLSelectElement>('theme')
const image = $<HTMLImageElement>('frame-image')
image.src = frameImage

function post(message: PluginToUi) {
  iframe.contentWindow?.postMessage({ pluginMessage: message }, '*')
}

let toastTimer: ReturnType<typeof setTimeout> | undefined
function notify(message: string) {
  toast.textContent = message
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.textContent = ''), 5000)
}

function drawSelection(ids: string[], text: string) {
  label.textContent = text
  highlights.replaceChildren()
  const scale = frame.clientWidth / size[0]
  const outside: string[] = []
  for (const id of ids) {
    const box = boxes[originalId(id)]
    if (!box) {
      outside.push(id)
      continue
    }
    const element = document.createElement('div')
    element.className = 'highlight'
    element.style.left = `${box.x * scale}px`
    element.style.top = `${image.offsetTop + box.y * scale}px`
    element.style.width = `${box.w * scale}px`
    element.style.height = `${box.h * scale}px`
    highlights.append(element)
  }
  const copies = ids.filter((id) => id.includes('~')).length
  note.textContent =
    outside.length > 0
      ? `${outside.length} selected layer${outside.length === 1 ? ' is' : 's are'} in a frame the canvas does not show.`
      : copies > 0
        ? 'The selected layers are in a copy of this frame; the canvas shows where they are.'
        : ''
  highlights.firstElementChild?.scrollIntoView({
    block: 'center',
    behavior: 'smooth',
  })
}

const plugin = new MockPlugin(post, {
  onSelect: (ids, text) => {
    drawSelection(ids, text)
    syncSelectionPicker()
  },
  onPage: (pageId) => renderPages(pageId),
  onNotify: notify,
  // The plugin window's grip resizes the window, as figma.ui.resize does.
  onResize: (width) => {
    document.body.style.setProperty('--plugin-width', `${width}px`)
    drawSelection(plugin.selection, plugin.selectionLabel())
  },
})

function renderPages(current = plugin.pageId) {
  pagesList.replaceChildren(
    ...plugin.world.pages.map((page) => {
      const item = document.createElement('li')
      const button = document.createElement('button')
      button.type = 'button'
      button.textContent = page.name
      if (page.id === current) button.setAttribute('aria-current', 'page')
      button.onclick = () => {
        plugin.setPage(page.id)
        plugin.setSelection([])
      }
      item.append(button)
      return item
    }),
  )
  pageTitle.textContent =
    plugin.world.pages.find((page) => page.id === current)?.name ?? ''
}

/** Frames the reviewer can select on the canvas, as in Figma. */
function renderSelectionPicker() {
  const options = [
    { value: '', text: 'Nothing' },
    ...plugin.world.entries
      .filter((entry) => entry.kind !== 'component')
      .map((entry) => ({
        value: entry.id,
        text: `${entry.name} (${entry.pageName})`,
      })),
  ]
  selectionPicker.replaceChildren(
    ...options.map((option) => {
      const element = document.createElement('option')
      element.value = option.value
      element.textContent = option.text
      return element
    }),
  )
  syncSelectionPicker()
}

function syncSelectionPicker() {
  const [first] = plugin.selection
  const isFrame = plugin.world.entries.some((entry) => entry.id === first)
  if (plugin.selection.length === 0) selectionPicker.value = ''
  else if (isFrame && plugin.selection.length === 1)
    selectionPicker.value = first
}

selectionPicker.onchange = () => {
  const id = selectionPicker.value
  const entry = plugin.world.entries.find((candidate) => candidate.id === id)
  if (entry && entry.pageId !== plugin.pageId) plugin.setPage(entry.pageId)
  plugin.setSelection(id ? [id] : [])
}

function applyTheme() {
  iframe.contentWindow?.postMessage({ prototypeTheme: themePicker.value }, '*')
}
themePicker.onchange = applyTheme
iframe.addEventListener('load', applyTheme)

$<HTMLButtonElement>('reopen').onclick = () => {
  iframe.src = 'window.html'
}
$<HTMLButtonElement>('reset').onclick = () => {
  plugin.reset()
  renderPages()
  renderSelectionPicker()
  drawSelection(plugin.selection, plugin.selectionLabel())
  iframe.src = 'window.html'
}

window.addEventListener('message', (event) => {
  if (event.source !== iframe.contentWindow) return
  const message = (event.data as { pluginMessage?: UiToPlugin } | null)
    ?.pluginMessage
  if (message) void plugin.handle(message)
})
window.addEventListener('resize', () =>
  drawSelection(plugin.selection, plugin.selectionLabel()),
)

renderPages()
renderSelectionPicker()
drawSelection(plugin.selection, plugin.selectionLabel())
