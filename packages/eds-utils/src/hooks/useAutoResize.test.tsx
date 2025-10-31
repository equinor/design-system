import { render, screen } from '@testing-library/react'
import { useState } from 'react'
import { useAutoResize } from './useAutoResize'

const TestComponent = ({ ...rest }) => {
  const [textareaEl, setTextareaEl] = useState<HTMLTextAreaElement>(null)
  useAutoResize(textareaEl, 100)
  return (
    <textarea
      ref={setTextareaEl}
      style={{ resize: 'none' }}
      {...rest}
    ></textarea>
  )
}

describe('useAutoResize', () => {
  it('Should add height: auto and overflow: hidden to target element', () => {
    render(<TestComponent data-testid="node" />)
    const node = screen.getByTestId('node')
    expect(node.style.height).toBe('auto')
    expect(node.style.overflow).toBe('hidden')
  })
})
