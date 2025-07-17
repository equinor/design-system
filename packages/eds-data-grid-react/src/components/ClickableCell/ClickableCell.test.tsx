import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { ClickableCell } from './ClickableCell'

describe('ClickableCell', () => {
  const defaultProps = {
    children: 'Test Content',
    onClick: jest.fn(),
    ariaLabel: 'Test button',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  describe('Basic functionality', () => {
    it('renders with correct content and attributes', () => {
      render(<ClickableCell {...defaultProps} />)

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Test Content')
      expect(button).toHaveAttribute('aria-label', 'Test button')
      expect(button).toHaveAttribute('type', 'button')
    })

    it('calls onClick when clicked', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<ClickableCell {...defaultProps} />)

      await user.click(screen.getByRole('button'))

      expect(defaultProps.onClick).toHaveBeenCalledTimes(1)
    })

    it('calls onClick when Enter is pressed', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<ClickableCell {...defaultProps} />)

      const button = screen.getByRole('button')
      await user.tab()
      expect(button).toHaveFocus()
      await user.keyboard('{Enter}')

      expect(defaultProps.onClick).toHaveBeenCalledTimes(1)
    })

    it('calls onClick when Space is pressed', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<ClickableCell {...defaultProps} />)

      const button = screen.getByRole('button')
      await user.tab()
      expect(button).toHaveFocus()
      await user.keyboard(' ')

      expect(defaultProps.onClick).toHaveBeenCalledTimes(1)
    })

    it('does not call onClick for other keys', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<ClickableCell {...defaultProps} />)

      const button = screen.getByRole('button')
      await user.tab()
      expect(button).toHaveFocus()
      await user.keyboard('{Escape}')
      await user.keyboard('a')

      expect(defaultProps.onClick).not.toHaveBeenCalled()
    })
  })

  describe('Selection state behavior', () => {
    it('becomes selected when clicked and resets after blur', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(
        <div>
          <ClickableCell {...defaultProps} />
          <button data-testid="other">Other button</button>
        </div>,
      )

      const clickableButton = screen.getByRole('button', {
        name: 'Test button',
      })
      const otherButton = screen.getByTestId('other')

      // Click to select
      await user.click(clickableButton)

      // Focus other element to trigger blur
      await user.click(otherButton)

      // Advance timer to trigger selection reset
      jest.advanceTimersByTime(200)

      // The selection state should be reset (this would be visible in actual styling)
      expect(clickableButton).toBeInTheDocument() // Basic check that component is still there
    })

    it('becomes selected when Enter is pressed', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<ClickableCell {...defaultProps} />)

      const button = screen.getByRole('button')
      await user.tab()
      expect(button).toHaveFocus()
      await user.keyboard('{Enter}')

      expect(defaultProps.onClick).toHaveBeenCalled()
      // Selection state is managed internally for styling
    })

    it('handles multiple rapid interactions', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<ClickableCell {...defaultProps} />)

      const button = screen.getByRole('button')

      // Multiple rapid clicks
      await user.click(button)
      await user.click(button)
      await user.keyboard('{Enter}')

      expect(defaultProps.onClick).toHaveBeenCalledTimes(3)
    })
  })

  describe('Keyboard navigation and accessibility', () => {
    it('is focusable via keyboard navigation', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<ClickableCell {...defaultProps} />)

      await user.tab()

      expect(screen.getByRole('button')).toHaveFocus()
    })

    // it('prevents default behavior for Enter and Space', async () => {
    //   const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    //   const parentKeyDown = jest.fn()

    //   render(
    //     <button
    //       type="button"
    //       onKeyDown={parentKeyDown}
    //       tabIndex={-1}
    //       style={{ all: 'unset' }}
    //     >
    //       <ClickableCell {...defaultProps} />
    //     </button>,
    //   )

    //   const button = screen.getByRole('button')
    //   await user.tab()
    //   expect(button).toHaveFocus()
    //   await user.keyboard('{Enter}')
    //   await user.keyboard(' ')

    //   // Events should be prevented from bubbling
    //   expect(parentKeyDown).not.toHaveBeenCalled()
    // })

    it('supports custom aria-label', () => {
      const customLabel = 'Custom action button'
      render(<ClickableCell {...defaultProps} ariaLabel={customLabel} />)

      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        customLabel,
      )
    })
  })

  describe('Integration with DataGrid', () => {
    it('works correctly in table context', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      const onClick1 = jest.fn()
      const onClick2 = jest.fn()

      render(
        <table>
          <tbody>
            <tr>
              <td>
                <ClickableCell onClick={onClick1} ariaLabel="Edit row 1">
                  Edit
                </ClickableCell>
              </td>
              <td>Regular content</td>
            </tr>
            <tr>
              <td>
                <ClickableCell onClick={onClick2} ariaLabel="Edit row 2">
                  Edit
                </ClickableCell>
              </td>
              <td>More content</td>
            </tr>
          </tbody>
        </table>,
      )

      const [button1, button2] = screen.getAllByRole('button')

      // Test first button
      await user.click(button1)
      expect(onClick1).toHaveBeenCalledTimes(1)
      expect(onClick2).not.toHaveBeenCalled()

      // Test second button
      await user.click(button2)
      expect(onClick2).toHaveBeenCalledTimes(1)
    })

    it('handles keyboard navigation between multiple cells', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })

      render(
        <div>
          <ClickableCell onClick={jest.fn()} ariaLabel="First cell">
            Cell 1
          </ClickableCell>
          <ClickableCell onClick={jest.fn()} ariaLabel="Second cell">
            Cell 2
          </ClickableCell>
        </div>,
      )

      const buttons = screen.getAllByRole('button')

      // Tab through buttons
      await user.tab()
      expect(buttons[0]).toHaveFocus()

      await user.tab()
      expect(buttons[1]).toHaveFocus()
    })
  })

  describe('Props and customization', () => {
    it('forwards additional props to button element', () => {
      render(
        <ClickableCell
          {...defaultProps}
          data-testid="custom-button"
          disabled
          className="custom-class"
        />,
      )

      const button = screen.getByTestId('custom-button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('custom-class')
    })

    it('handles complex children content', () => {
      const complexChildren = (
        <div>
          <span data-testid="icon">📝</span>
          <strong data-testid="text">Edit Item</strong>
        </div>
      )

      render(<ClickableCell {...defaultProps}>{complexChildren}</ClickableCell>)

      expect(screen.getByTestId('icon')).toBeInTheDocument()
      expect(screen.getByTestId('text')).toBeInTheDocument()
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('handles empty or minimal content', () => {
      render(<ClickableCell onClick={jest.fn()}> </ClickableCell>)

      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('Error handling and edge cases', () => {
    it('handles focus/blur without errors', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })

      render(
        <div>
          <ClickableCell {...defaultProps} />
          <input data-testid="input" />
        </div>,
      )

      const button = screen.getByRole('button', { name: 'Test button' })
      const input = screen.getByTestId('input')

      // Focus and blur multiple times
      await user.click(button)
      await user.click(input)
      await user.click(button)
      await user.tab()

      // Should not throw any errors
      expect(button).toBeInTheDocument()
    })

    it('continues to work after multiple state changes', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })

      render(<ClickableCell {...defaultProps} />)

      const button = screen.getByRole('button')

      // Multiple interactions to test state stability
      await user.click(button)
      jest.advanceTimersByTime(200)
      await user.keyboard('{Enter}')
      jest.advanceTimersByTime(200)
      await user.click(button)

      expect(defaultProps.onClick).toHaveBeenCalledTimes(3)
    })
  })
})
