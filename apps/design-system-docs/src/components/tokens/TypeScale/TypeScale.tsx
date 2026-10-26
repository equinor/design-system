import React, { useEffect, useRef, useState } from 'react'
import { cssVar } from '../TokenAnatomy/bindings'
import './type-scale.css'

export type TypeRole = 'header' | 'label' | 'body'

export type TypeScaleProps = {
  /** Which role's steps to set. */
  role: TypeRole
  /**
   * The steps the role has, in scale order. The typography generator writes this list from the
   * token source, so the specimen cannot show a step that does not exist or miss one that does.
   */
  steps: string[]
}

/** Family and default weight per role, as ADR-0027 composes the text styles. */
const FAMILY: Record<TypeRole, string> = {
  header: 'font-family.header',
  label: 'font-family.ui',
  body: 'font-family.ui',
}

const WEIGHT: Record<TypeRole, string> = {
  header: 'font-weight.medium',
  label: 'font-weight.normal',
  body: 'font-weight.normal',
}

/** Body text gets two sentences, so the line-height has more than one line to show itself on. */
const SAMPLE: Record<TypeRole, string> = {
  header: 'Well integrity review',
  label: 'Pipeline pressure',
  body: 'The north manifold is due for inspection. Two valves showed wear at the last visit, so they are first on the list.',
}

/** Attributes that change what a token resolves to. */
const WATCHED = ['data-theme', 'data-color-scheme', 'data-density']

/**
 * Reads the size and line-height the browser applied to a sample. Read back rather than printed
 * from a table, so the readout follows the density the specimen sits in, and a token whose value
 * changes shows the new value without anyone editing the page.
 */
function useApplied(ref: React.RefObject<HTMLElement | null>) {
  const [applied, setApplied] = useState('')

  useEffect(() => {
    const element = ref.current
    if (!element) return
    let previous = ''

    const read = () => {
      const computed = getComputedStyle(element)
      const next = `${Number.parseFloat(computed.fontSize)} / ${Number.parseFloat(computed.lineHeight)}`
      if (next === previous) return
      previous = next
      setApplied(next)
    }
    read()

    const root = new MutationObserver(read)
    root.observe(document.documentElement, {
      attributes: true,
      attributeFilter: WATCHED,
    })

    // DensitySwitch sets the attribute on a wrapper rather than on the document.
    const scope = element.closest('[data-density]')
    const local =
      scope && scope !== document.documentElement
        ? new MutationObserver(read)
        : null
    if (scope && local) {
      local.observe(scope, { attributes: true, attributeFilter: WATCHED })
    }

    return () => {
      root.disconnect()
      local?.disconnect()
    }
  }, [ref])

  return applied
}

function Step({ role, step }: { role: TypeRole; step: string }) {
  const sample = useRef<HTMLSpanElement>(null)
  const applied = useApplied(sample)
  const name = `typography.${role}.${step}`

  return (
    <div className="docs-type-scale__row">
      <div className="docs-type-scale__meta">
        <code className="docs-type-scale__name">{name}</code>
        <span className="docs-type-scale__value">
          {applied ? `${applied} px` : ' '}
        </span>
      </div>
      <span
        ref={sample}
        className="docs-type-scale__sample"
        style={{
          fontFamily: cssVar(FAMILY[role]),
          fontWeight: cssVar(WEIGHT[role]),
          fontSize: cssVar(`${name}.font-size`),
          lineHeight: cssVar(`${name}.line-height`),
        }}
      >
        {SAMPLE[role]}
      </span>
    </div>
  )
}

/**
 * Every step of one typography role, each set in its own style, with the size and line-height the
 * browser applied beside it.
 *
 * The 2.0.0-beta `TypeSpecimen` stays as it is, because the frozen 2.0.0-beta typography page
 * imports it and its token names no longer exist in the current set.
 */
export function TypeScale({ role, steps }: TypeScaleProps) {
  return (
    <div className="docs-type-scale" data-role={role}>
      {steps.map((step) => (
        <Step key={step} role={role} step={step} />
      ))}
    </div>
  )
}
