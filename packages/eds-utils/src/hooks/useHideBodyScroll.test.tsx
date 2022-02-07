import { render, cleanup } from '@testing-library/react'
import { useHideBodyScroll } from './useHideBodyScroll'

const TestComponent = ({ hideScroll }) => {
  useHideBodyScroll(hideScroll)
  return <div></div>
}
afterEach(cleanup)

describe('useHideBodyScroll', () => {
  it('Should add "overflow: hidden" on document.body only while input is true', () => {
    const { rerender } = render(<TestComponent hideScroll={true} />)
    expect(document.body.style.overflow).toBe('hidden')
    rerender(<TestComponent hideScroll={false} />)
    expect(document.body.style.overflow).toBe('')
  })
  it('Should restore existing overflow style on document.body', () => {
    document.body.style.overflow = 'clip'
    const { rerender } = render(<TestComponent hideScroll={true} />)
    expect(document.body.style.overflow).toBe('hidden')
    rerender(<TestComponent hideScroll={false} />)
    expect(document.body.style.overflow).toBe('clip')
  })
})
