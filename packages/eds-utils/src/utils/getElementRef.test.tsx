import { describe, it, expect } from 'vitest'
import { createRef, type ReactElement } from 'react'
import { getElementRef } from './getElementRef'

describe('getElementRef', () => {
  it('reads ref from props (React 19 shape)', () => {
    const ref = createRef<HTMLDivElement>()
    const element = {
      type: 'div',
      props: { ref },
      ref: null,
    } as unknown as ReactElement

    expect(getElementRef(element)).toBe(ref)
  })

  it('falls back to element.ref (React 18 shape)', () => {
    const ref = createRef<HTMLDivElement>()
    const element = {
      type: 'div',
      props: {},
      ref,
    } as unknown as ReactElement

    expect(getElementRef(element)).toBe(ref)
  })

  it('returns null when no ref is set', () => {
    const element = {
      type: 'div',
      props: {},
    } as unknown as ReactElement

    expect(getElementRef(element)).toBeNull()
  })

  it('prefers props.ref over element.ref when both are present', () => {
    const propsRef = createRef<HTMLDivElement>()
    const elementRef = createRef<HTMLDivElement>()
    const element = {
      type: 'div',
      props: { ref: propsRef },
      ref: elementRef,
    } as unknown as ReactElement

    expect(getElementRef(element)).toBe(propsRef)
  })
})
