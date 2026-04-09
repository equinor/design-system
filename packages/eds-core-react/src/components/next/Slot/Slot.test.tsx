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

    it('returns null for invalid children', () => {
      const { container } = render(<Slot>plain text</Slot>)
      expect(container.innerHTML).toBe('')
    })

    it('returns null when children is null', () => {
      const { container } = render(<Slot>{null}</Slot>)
      expect(container.innerHTML).toBe('')
    })

    it('warns in development for invalid children', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementation()
      render(<Slot>plain text</Slot>)
      expect(spy).toHaveBeenCalledWith(
        'Slot: asChild requires a single valid React element as a child.',
      )
      spy.mockRestore()
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
