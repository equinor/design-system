import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import type { BindableProperty, Bindings } from './bindings'
import { READOUT, boundProperties, cssName } from './bindings'

type Resolved = Partial<Record<BindableProperty, string>>

/** Attributes that change what a token resolves to. */
const WATCHED = ['data-theme', 'data-color-scheme', 'data-density']

/**
 * Reads what each bound token currently resolves to on the specimen itself.
 *
 * This is the part that keeps the diagram honest over time: the label is generated from the token
 * name and the value is read back off the rendered element, so a token whose value changes shows
 * its new value without anyone editing the page.
 *
 * Everything here touches the DOM, so it all sits inside an effect and the initial state is empty.
 * Server rendering produces the diagram without values, and they appear on hydration.
 */
export function useResolvedValues(
  ref: RefObject<HTMLElement | null>,
  bindings: Bindings,
): Resolved {
  const [values, setValues] = useState<Resolved>({})

  // Read through a ref so the effect depends on the token names rather than on object identity,
  // which changes on every render for an inline prop.
  const latest = useRef(bindings)
  latest.current = bindings

  const key = boundProperties(bindings)
    .map((prop) => `${prop}:${bindings[prop]?.token}`)
    .join('|')

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const read = () => {
      const computed = getComputedStyle(element)
      const next: Resolved = {}
      for (const prop of boundProperties(latest.current)) {
        if (!READOUT.has(prop)) continue
        const token = latest.current[prop]?.token
        if (token) next[prop] = computed.getPropertyValue(cssName(token)).trim()
      }
      setValues(next)
    }

    read()

    // Density and font loading both change the specimen's box.
    const resize = new ResizeObserver(read)
    resize.observe(element)

    const root = new MutationObserver(read)
    root.observe(document.documentElement, {
      attributes: true,
      attributeFilter: WATCHED,
    })

    // DensitySwitch sets the attribute on a wrapper rather than on the document, so the nearest
    // scoping ancestor is watched too.
    const scope = element.closest('[data-density]')
    const local =
      scope && scope !== document.documentElement
        ? new MutationObserver(read)
        : null
    if (scope && local) {
      local.observe(scope, { attributes: true, attributeFilter: WATCHED })
    }

    return () => {
      resize.disconnect()
      root.disconnect()
      local?.disconnect()
    }
  }, [ref, key])

  return values
}
