/**
 * Observes a field container and automatically wires up accessibility attributes
 * between labels, descriptions, validation messages, and form controls.
 *
 */
export function fieldObserver(fieldElement: HTMLElement | null) {
  if (!fieldElement) return

  const elements = new Map<Element, string | null>()
  const typeCounter = new Map<string, number>()
  const uuid = `:${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`
  let input: Element | null = null
  let describedby = ''

  const process = (mutations: Partial<MutationRecord>[]) => {
    const changed: Node[] = []
    const removed: Node[] = []

    // Merge MutationRecords
    for (const mutation of mutations) {
      if (mutation.attributeName) changed.push(mutation.target ?? fieldElement)
      changed.push(...Array.from(mutation.addedNodes || []))
      removed.push(...Array.from(mutation.removedNodes || []))
    }

    // Register elements
    for (const el of changed) {
      if (!isElement(el)) continue

      if (isLabel(el)) elements.set(el, el.htmlFor)
      else if (el.hasAttribute('data-field')) elements.set(el, el.id)
      else if (isInputLike(el) && !el.hidden) {
        input = el
        describedby = el.getAttribute('aria-describedby') || ''
      }
    }

    // Reset removed elements
    for (const el of removed) {
      if (!isElement(el)) continue

      if (input === el) input = null
      if (elements.has(el)) {
        setAttr(el, isLabel(el) ? 'for' : 'id', elements.get(el))
        elements.delete(el)
      }
    }

    // Connect elements
    const describedbyIds = describedby ? describedby.split(' ') : []
    const inputId = input?.id || uuid

    // Reset type counters since we reprocess all elements
    typeCounter.clear()

    for (const [el, value] of elements) {
      const descriptionType = el.getAttribute('data-field')
      let id: string

      if (descriptionType) {
        const count = (typeCounter.get(descriptionType) || 0) + 1
        typeCounter.set(descriptionType, count)
        id = `${inputId}:${descriptionType}:${count}`
      } else {
        id = inputId
      }

      if (!value) setAttr(el, isLabel(el) ? 'for' : 'id', id)
      if (!describedbyIds.includes(el.id)) {
        if (descriptionType === 'validation') {
          describedbyIds.unshift(el.id) // Validations to the front
          // Set aria-invalid for danger validation
          if (el.getAttribute('data-color-appearance') === 'danger') {
            setAttr(input, 'aria-invalid', 'true')
          }
        } else if (descriptionType) {
          describedbyIds.push(el.id)
        }
      }
    }

    setAttr(input, 'id', inputId)
    setAttr(input, 'aria-describedby', describedbyIds.join(' ').trim())
  }

  const observer = createOptimizedMutationObserver(process)
  observer.observe(fieldElement, {
    attributeFilter: ['id', 'for', 'aria-describedby', 'data-color-appearance'],
    attributes: true,
    childList: true,
    subtree: true,
  })

  process([{ addedNodes: fieldElement.querySelectorAll('*') }])
  observer.takeRecords()
  return () => observer.disconnect()
}

// Utilities
const isElement = (node: Node): node is Element => node instanceof Element
const isLabel = (node: Node): node is HTMLLabelElement =>
  node instanceof HTMLLabelElement
const isInputLike = (node: unknown): node is HTMLInputElement =>
  node instanceof HTMLElement &&
  'validity' in node &&
  !(node instanceof HTMLButtonElement)

const setAttr = (el: Element | null, name: string, value?: string | null) =>
  value ? el?.setAttribute(name, value) : el?.removeAttribute(name)

// Speed up MutationObserver by debouncing and only running when needed
function createOptimizedMutationObserver(callback: MutationCallback) {
  const queue: MutationRecord[] = []
  const observer = new MutationObserver((mutations) => {
    if (!queue.length) requestAnimationFrame(process)
    queue.push(...mutations)
  })

  const process = () => {
    callback(queue, observer)
    queue.length = 0
    observer.takeRecords()
  }

  return observer
}
