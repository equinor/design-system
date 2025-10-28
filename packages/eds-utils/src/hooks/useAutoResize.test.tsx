import { render, screen, fireEvent, act } from '@testing-library/react'
import { useRef } from 'react'
import { useAutoResize } from './useAutoResize'

const TestComponent = ({ maxHeight, ...rest }: { maxHeight?: number }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  useAutoResize(textareaRef, maxHeight)
  return <textarea ref={textareaRef} style={{ resize: 'none' }} {...rest} />
}

describe('useAutoResize', () => {
  it('Should set height to auto initially and add keyup listener', () => {
    render(<TestComponent data-testid="textarea" maxHeight={200} />)
    const textarea = screen.getByTestId('textarea')

    // The hook should set initial styles
    expect(textarea.style.height).toBe('auto')
    expect(textarea.style.overflow).toBe('hidden')
  })

  it('Should handle resize logic when content exceeds maxHeight', () => {
    render(<TestComponent data-testid="textarea" maxHeight={200} />)
    const textarea = screen.getByTestId('textarea')

    // Mock realistic scrollHeight and clientHeight values
    // This simulates what would happen in a real browser
    Object.defineProperty(textarea, 'scrollHeight', {
      writable: true,
      value: 300, // Content height exceeds maxHeight
    })
    Object.defineProperty(textarea, 'clientHeight', {
      writable: true,
      value: 50, // Initial height
    })

    // Trigger resize
    act(() => {
      fireEvent.keyUp(textarea, { key: 'Enter' })
    })

    // Should cap at maxHeight and show scroll
    expect(textarea.style.height).toBe('200px')
    expect(textarea.style.overflow).toBe('auto')
  })

  it('Should resize to fit content when within maxHeight', () => {
    render(<TestComponent data-testid="textarea" maxHeight={300} />)
    const textarea = screen.getByTestId('textarea')

    // Mock content that fits within maxHeight
    Object.defineProperty(textarea, 'scrollHeight', {
      writable: true,
      value: 150, // Content height within maxHeight
    })
    Object.defineProperty(textarea, 'clientHeight', {
      writable: true,
      value: 50, // Initial height
    })

    // Trigger resize
    act(() => {
      fireEvent.keyUp(textarea, { key: 'Enter' })
    })

    // Should resize to fit content
    expect(textarea.style.height).toBe('150px')
    expect(textarea.style.overflow).toBe('hidden')
  })

  it('Should not modify textarea when no maxHeight is provided', () => {
    render(<TestComponent data-testid="textarea" />)
    const textarea = screen.getByTestId('textarea')

    // Trigger resize attempt
    act(() => {
      fireEvent.keyUp(textarea, { key: 'Enter' })
    })

    // Should remain unchanged when no maxHeight
    expect(textarea.style.height).toBe('')
    expect(textarea.style.overflow).toBe('')
  })
})
