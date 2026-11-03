/** The class names a stylesheet has rules for, without the comments. A
 * class starts with a letter, so 0.5px is not taken for one. */
export function classesIn(css: string) {
  const code = css.replace(/\/\*[\s\S]*?\*\//g, '')
  return new Set(
    [...code.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((match) => match[1]),
  )
}

const STYLE = `
  :host { all: initial; }
  .box {
    position: fixed;
    outline: 1px solid var(--eds-border-interactive-focus);
    outline-offset: -1px;
    pointer-events: none;
  }
  .label {
    position: fixed;
    pointer-events: none;
  }
  .label span {
    display: block;
    zoom: var(--eds-demo-zoom, 1);
    padding: var(--eds-spacing-4xs) var(--eds-spacing-3xs);
    font-family: var(--eds-font-family-mono);
    font-size: var(--eds-typography-label-sm-font-size);
    line-height: var(--eds-typography-label-sm-line-height);
    color: var(--eds-text-inverted);
    white-space: nowrap;
    background-color: var(--eds-background-inverted);
    border-radius: var(--eds-corner-radius-rounded);
  }
  [hidden] { display: none; }
`

/** Outlines the element under the pointer that has a rule in the CSS, with
 * its class names, and reports a click on it instead of letting the
 * dashboard handle it. The overlay is in a shadow root, so the CSS in the
 * editor cannot reach it; the tokens are inherited into it. */
export function startInspector(
  known: () => Set<string>,
  onPick: (classes: string[]) => void,
) {
  const host = document.createElement('eds-demo-inspector')
  host.style.cssText =
    'position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;'
  const root = host.attachShadow({ mode: 'open' })
  root.innerHTML = `<style>${STYLE}</style><div class="box" hidden></div><div class="label" hidden><span></span></div>`
  const box = root.querySelector<HTMLElement>('.box')!
  const label = root.querySelector<HTMLElement>('.label')!
  const text = label.querySelector('span')!
  document.body.append(host)

  let current: { element: Element; classes: string[] } | null = null

  const find = (target: EventTarget | null) => {
    const classes = known()
    for (
      let element = target instanceof Element ? target : null;
      element && element !== document.body;
      element = element.parentElement
    ) {
      const matching = [...element.classList].filter((name) =>
        classes.has(name),
      )
      if (matching.length > 0) return { element, classes: matching }
    }
    return null
  }

  const draw = () => {
    if (!current) {
      box.hidden = true
      label.hidden = true
      return
    }
    const rect = current.element.getBoundingClientRect()
    Object.assign(box.style, {
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    })
    text.textContent = current.classes.map((name) => `.${name}`).join('')
    box.hidden = false
    label.hidden = false
    // Above the element, or inside its top edge where there is no room.
    const height = label.offsetHeight
    const top = rect.top - height >= 0 ? rect.top - height : rect.top
    const left = Math.min(rect.left, window.innerWidth - label.offsetWidth)
    Object.assign(label.style, {
      top: `${top}px`,
      left: `${Math.max(0, left)}px`,
    })
  }

  const onMove = (event: PointerEvent) => {
    current = find(event.target)
    draw()
  }
  const onLeave = () => {
    current = null
    draw()
  }
  // The dashboard must not react while inspecting: no focus, no row
  // selection, no menu.
  const block = (event: Event) => {
    event.preventDefault()
    event.stopPropagation()
  }
  const onClick = (event: MouseEvent) => {
    block(event)
    const picked = find(event.target)
    if (picked) onPick(picked.classes)
  }

  const capture = { capture: true }
  window.addEventListener('pointermove', onMove, capture)
  document.documentElement.addEventListener('pointerleave', onLeave)
  window.addEventListener('pointerdown', block, capture)
  window.addEventListener('mousedown', block, capture)
  window.addEventListener('click', onClick, capture)
  window.addEventListener('scroll', draw, capture)

  return () => {
    window.removeEventListener('pointermove', onMove, capture)
    document.documentElement.removeEventListener('pointerleave', onLeave)
    window.removeEventListener('pointerdown', block, capture)
    window.removeEventListener('mousedown', block, capture)
    window.removeEventListener('click', onClick, capture)
    window.removeEventListener('scroll', draw, capture)
    host.remove()
  }
}
