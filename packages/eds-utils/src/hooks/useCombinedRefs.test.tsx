import { render, cleanup, screen } from '@testing-library/react'
import { forwardRef, createRef } from 'react'
import { useCombinedRefs } from './useCombinedRefs'

const Component = forwardRef<HTMLDivElement>((props, ref) => {
  const targetRef = useCombinedRefs(ref)
  return <div {...props} ref={targetRef} />
})
Component.displayName = 'Component'
afterEach(cleanup)

describe('useCombinedRefs', () => {
  it('calls function ref with correct payload', () => {
    const callback = jest.fn()
    render(<Component data-testid="component" ref={callback} />)

    expect(callback).toHaveBeenCalledWith(screen.getByTestId('component'))
  })

  it('assigns ref object with correct payload', () => {
    const elementRef = createRef<HTMLDivElement>()
    render(<Component data-testid="component" ref={elementRef} />)

    expect(elementRef.current).toBe(screen.getByTestId('component'))
  })
})
