import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { forwardRef, createRef } from 'react'
import { mergeRefs } from './mergeRefs'

const Component = forwardRef<HTMLDivElement>((props, ref) => {
  const targetRef = mergeRefs<HTMLDivElement>(ref)
  return <div {...props} ref={targetRef} />
})
Component.displayName = 'Component'

describe('useCombinedRefs', () => {
  it('calls function ref with correct payload', () => {
    const callback = vi.fn()
    render(<Component data-testid="component" ref={callback} />)

    expect(callback).toHaveBeenCalledWith(screen.getByTestId('component'))
  })

  it('assigns ref object with correct payload', () => {
    const elementRef = createRef<HTMLDivElement>()
    render(<Component data-testid="component" ref={elementRef} />)

    expect(elementRef.current).toBe(screen.getByTestId('component'))
  })
})
