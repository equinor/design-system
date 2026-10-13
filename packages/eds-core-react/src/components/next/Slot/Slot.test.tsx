import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { Slot } from '.'

describe('Slot (next)', () => {
  describe('Rendering', () => {
    it('renders child element', () => {
      render(
        <Slot>
          <button type="button">Click</button>
        </Slot>,
      )
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    describe('Invalid children', () => {
      let consoleError: jest.SpyInstance

      beforeEach(() => {
        consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
      })

      afterEach(() => {
        consoleError.mockRestore()
      })

      it.each([
        ['null', null],
        ['undefined', undefined],
        ['false', false],
        ['an empty string', ''],
      ])('renders nothing without an error when children is %s', (_, value) => {
        const { container } = render(<Slot>{value}</Slot>)
        expect(container.innerHTML).toBe('')
        expect(consoleError).not.toHaveBeenCalled()
      })

      it('logs an error naming Slot for a text child', () => {
        const { container } = render(<Slot>plain text</Slot>)
        expect(container.innerHTML).toBe('')
        expect(consoleError).toHaveBeenCalledWith(
          expect.stringMatching(/^Slot: .*got text/),
        )
      })

      it('logs an error for 0, which React would render as text', () => {
        render(<Slot>{0}</Slot>)
        expect(consoleError).toHaveBeenCalledWith(
          expect.stringMatching(/^Slot: .*got text/),
        )
      })

      it('logs an error for multiple children', () => {
        render(
          <Slot>
            <span>One</span>
            <span>Two</span>
          </Slot>,
        )
        expect(consoleError).toHaveBeenCalledWith(
          expect.stringMatching(/^Slot: .*got multiple children/),
        )
      })

      it('logs an error for a Fragment child instead of cloning onto it', () => {
        const { container } = render(
          <Slot className="slot-class">
            <>
              <span>One</span>
            </>
          </Slot>,
        )
        expect(container.innerHTML).toBe('')
        expect(consoleError).toHaveBeenCalledWith(
          expect.stringMatching(/^Slot: .*got a Fragment/),
        )
      })

      it('does not throw for invalid children', () => {
        expect(() => render(<Slot>plain text</Slot>)).not.toThrow()
      })
    })
  })

  describe('Prop merging', () => {
    it('concatenates className from slot and child', () => {
      render(
        <Slot className="slot-class">
          <div data-testid="child" className="child-class">
            content
          </div>
        </Slot>,
      )
      expect(screen.getByTestId('child')).toHaveClass(
        'slot-class',
        'child-class',
      )
    })

    it('shallow-merges style with child winning on conflicts', () => {
      render(
        <Slot style={{ color: 'red', fontSize: '14px' }}>
          <div data-testid="child" style={{ color: 'blue', margin: '8px' }}>
            content
          </div>
        </Slot>,
      )
      const el = screen.getByTestId('child')
      expect(el).toHaveStyle({
        color: 'rgb(0, 0, 255)',
        fontSize: '14px',
        margin: '8px',
      })
    })

    it('composes event handlers — child called first, then slot', async () => {
      const user = userEvent.setup()
      const callOrder: string[] = []
      const slotClick = () => callOrder.push('slot')
      const childClick = () => callOrder.push('child')

      render(
        <Slot onClick={slotClick}>
          <button type="button" onClick={childClick}>
            Click
          </button>
        </Slot>,
      )

      await user.click(screen.getByRole('button'))
      expect(callOrder).toEqual(['child', 'slot'])
    })

    it('skips the slot handler when the child handler calls preventDefault', async () => {
      const user = userEvent.setup()
      const slotClick = jest.fn()

      render(
        <Slot onClick={slotClick}>
          <button type="button" onClick={(event) => event.preventDefault()}>
            Click
          </button>
        </Slot>,
      )

      await user.click(screen.getByRole('button'))
      expect(slotClick).not.toHaveBeenCalled()
    })

    it('still calls the slot handler when the event was prevented before the child handler', async () => {
      const user = userEvent.setup()
      const slotClick = jest.fn()

      render(
        <Slot onClick={slotClick}>
          <button
            type="button"
            onClickCapture={(event) => event.preventDefault()}
            onClick={() => {}}
          >
            Click
          </button>
        </Slot>,
      )

      await user.click(screen.getByRole('button'))
      expect(slotClick).toHaveBeenCalledTimes(1)
    })

    it('slot prop wins for non-special props', () => {
      render(
        <Slot data-variant="from-slot">
          <div data-testid="child" data-variant="from-child">
            content
          </div>
        </Slot>,
      )
      expect(screen.getByTestId('child')).toHaveAttribute(
        'data-variant',
        'from-slot',
      )
    })

    it('preserves child props not present on slot', () => {
      render(
        <Slot className="slot">
          <div data-testid="child" data-custom="preserved">
            content
          </div>
        </Slot>,
      )
      expect(screen.getByTestId('child')).toHaveAttribute(
        'data-custom',
        'preserved',
      )
    })

    it('does not override child prop when slot value is undefined', () => {
      render(
        <Slot data-value={undefined}>
          <div data-testid="child" data-value="kept">
            content
          </div>
        </Slot>,
      )
      expect(screen.getByTestId('child')).toHaveAttribute('data-value', 'kept')
    })
  })

  describe('Ref forwarding', () => {
    it('forwards ref to child element', () => {
      const ref = { current: null as HTMLButtonElement | null }
      render(
        <Slot ref={ref}>
          <button type="button">Click</button>
        </Slot>,
      )
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })

    it('keeps the child ref when the slot also has one', () => {
      const slotRef = { current: null as HTMLElement | null }
      const childRef = { current: null as HTMLButtonElement | null }
      render(
        <Slot ref={slotRef}>
          <button type="button" ref={childRef}>
            Click
          </button>
        </Slot>,
      )
      expect(slotRef.current).toBeInstanceOf(HTMLButtonElement)
      expect(childRef.current).toBe(slotRef.current)
    })

    it('calls a callback ref on the child', () => {
      const childRef = jest.fn()
      render(
        <Slot>
          <button type="button" ref={childRef}>
            Click
          </button>
        </Slot>,
      )
      expect(childRef).toHaveBeenCalledWith(expect.any(HTMLButtonElement))
    })

    it('runs callback ref cleanups when both refs are set', () => {
      const slotCleanup = jest.fn()
      const childCleanup = jest.fn()
      const { unmount } = render(
        <Slot ref={() => slotCleanup}>
          <button type="button" ref={() => childCleanup}>
            Click
          </button>
        </Slot>,
      )
      unmount()
      expect(slotCleanup).toHaveBeenCalledTimes(1)
      expect(childCleanup).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    it('preserves aria attributes from both slot and child', () => {
      render(
        <Slot aria-label="slot-label">
          <button type="button" aria-describedby="desc">
            Click
          </button>
        </Slot>,
      )
      const btn = screen.getByRole('button')
      expect(btn).toHaveAttribute('aria-label', 'slot-label')
      expect(btn).toHaveAttribute('aria-describedby', 'desc')
    })
  })
})
