import { render, fireEvent, cleanup, screen } from '@testing-library/react'
import { useOutsideClick } from './useOutsideClick'
import { useState } from 'react'

const TestComponent = ({ onClickOutside }) => {
  const [btnEl, setBtnEl] = useState<HTMLElement>(null)
  useOutsideClick(btnEl, onClickOutside)
  return <button ref={setBtnEl}>Click</button>
}
afterEach(cleanup)

describe('useClickOutside', () => {
  it('should call the callback when clicking outside the element', () => {
    const callback = jest.fn()
    render(<TestComponent onClickOutside={callback} />)
    fireEvent.click(document.body)

    expect(callback).toHaveBeenCalled()
  })

  it('should not call the callback when clicking the element', () => {
    const callback = jest.fn()
    render(<TestComponent onClickOutside={callback} />)
    fireEvent.click(screen.getByRole('button'))

    expect(callback).not.toHaveBeenCalled()
  })
})
