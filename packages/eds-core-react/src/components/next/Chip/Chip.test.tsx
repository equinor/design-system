import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { save } from '@equinor/eds-icons'
import { Chip } from '.'

describe('Chip (next)', () => {
  describe('Rendering', () => {
    it('renders with text children', () => {
      render(<Chip onClick={jest.fn()}>Filter</Chip>)
      expect(screen.getByText('Filter')).toBeInTheDocument()
    })

    it('forwards ref to the root element', () => {
      const ref = createRef<HTMLDivElement>()
      render(
        <Chip ref={ref} onClick={jest.fn()}>
          Ref chip
        </Chip>,
      )
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })

    it('applies custom className', () => {
      render(
        <Chip className="custom-class" onClick={jest.fn()}>
          Styled
        </Chip>,
      )
      expect(screen.getByText('Styled')).toHaveClass('eds-chip', 'custom-class')
    })

    it('spreads additional props to root element', () => {
      render(
        <Chip data-testid="my-chip" onClick={jest.fn()}>
          Props
        </Chip>,
      )
      expect(screen.getByTestId('my-chip')).toBeInTheDocument()
    })

    it('renders close button when onDelete is provided', () => {
      render(<Chip onDelete={jest.fn()}>Deletable</Chip>)
      expect(
        screen.getByRole('button', { name: /remove/i }),
      ).toBeInTheDocument()
    })

    it('does not render close button when onDelete is not provided', () => {
      render(<Chip onClick={jest.fn()}>Plain</Chip>)
      expect(
        screen.queryByRole('button', { name: /remove/i }),
      ).not.toBeInTheDocument()
    })

    it('sets data-deletable when onDelete is provided', () => {
      render(<Chip onDelete={jest.fn()}>Deletable</Chip>)
      expect(screen.getByText('Deletable')).toHaveAttribute('data-deletable')
    })

    it('renders leading icon when icon prop is provided', () => {
      render(
        <Chip onClick={jest.fn()} icon={save}>
          With icon
        </Chip>,
      )
      expect(screen.getByText('With icon')).toHaveAttribute('data-has-icon')
    })

    it('sets data-has-icon when icon prop is provided', () => {
      render(
        <Chip onClick={jest.fn()} icon={save}>
          With icon
        </Chip>,
      )
      expect(screen.getByText('With icon')).toHaveAttribute('data-has-icon')
    })

    it('does not set data-has-icon when no icon or selected', () => {
      render(<Chip onClick={jest.fn()}>No icon</Chip>)
      expect(screen.getByText('No icon')).not.toHaveAttribute('data-has-icon')
    })
  })

  describe('Selected state', () => {
    it('sets data-selected when selected', () => {
      render(
        <Chip onClick={jest.fn()} selected>
          Selected
        </Chip>,
      )
      expect(screen.getByText('Selected')).toHaveAttribute('data-selected')
    })

    it('does not set data-selected when not selected', () => {
      render(<Chip onClick={jest.fn()}>Unselected</Chip>)
      expect(screen.getByText('Unselected')).not.toHaveAttribute(
        'data-selected',
      )
    })

    it('sets aria-pressed on clickable chips', () => {
      const { rerender } = render(
        <Chip onClick={jest.fn()} selected>
          Pressed
        </Chip>,
      )
      expect(screen.getByRole('button', { name: /pressed/i })).toHaveAttribute(
        'aria-pressed',
        'true',
      )

      rerender(<Chip onClick={jest.fn()}>Pressed</Chip>)
      expect(screen.getByRole('button', { name: /pressed/i })).toHaveAttribute(
        'aria-pressed',
        'false',
      )
    })

    it('does not set aria-pressed on non-clickable chips', () => {
      render(
        <Chip onDelete={jest.fn()} selected>
          Delete only
        </Chip>,
      )
      expect(screen.getByText('Delete only')).not.toHaveAttribute(
        'aria-pressed',
      )
    })

    it('shows checkmark icon when selected (replaces custom icon)', () => {
      render(
        <Chip onClick={jest.fn()} icon={save} selected>
          Selected
        </Chip>,
      )
      // Should have data-has-icon (checkmark replaces the save icon)
      expect(screen.getByText('Selected')).toHaveAttribute('data-has-icon')
    })

    it('shows checkmark icon when selected even without icon prop', () => {
      render(
        <Chip onClick={jest.fn()} selected>
          Selected
        </Chip>,
      )
      expect(screen.getByText('Selected')).toHaveAttribute('data-has-icon')
    })
  })

  describe('Dropdown', () => {
    it('sets data-dropdown when dropdown is true', () => {
      render(
        <Chip onClick={jest.fn()} dropdown>
          Dropdown
        </Chip>,
      )
      expect(screen.getByText('Dropdown')).toHaveAttribute('data-dropdown')
    })

    it('does not set data-dropdown when dropdown is false', () => {
      render(<Chip onClick={jest.fn()}>Plain</Chip>)
      expect(screen.getByText('Plain')).not.toHaveAttribute('data-dropdown')
    })

    it('sets aria-haspopup="menu" when dropdown is true', () => {
      render(
        <Chip onClick={jest.fn()} dropdown>
          Dropdown
        </Chip>,
      )
      expect(screen.getByText('Dropdown')).toHaveAttribute(
        'aria-haspopup',
        'menu',
      )
    })

    it('does not set aria-haspopup when dropdown is false', () => {
      render(<Chip onClick={jest.fn()}>No dropdown</Chip>)
      expect(screen.getByText('No dropdown')).not.toHaveAttribute(
        'aria-haspopup',
      )
    })

    it('onDelete takes precedence over dropdown', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation()
      render(
        <Chip onDelete={jest.fn()} dropdown>
          Both
        </Chip>,
      )
      const chip = screen.getByText('Both')
      // onDelete wins: deletable shown, dropdown suppressed
      expect(chip).toHaveAttribute('data-deletable')
      expect(chip).not.toHaveAttribute('data-dropdown')
      expect(chip).not.toHaveAttribute('aria-haspopup')
      expect(
        screen.getByRole('button', { name: /remove/i }),
      ).toBeInTheDocument()
      warnSpy.mockRestore()
    })

    it('renders dropdown arrow icon (not present without dropdown)', () => {
      const { rerender } = render(<Chip onClick={jest.fn()}>No dropdown</Chip>)
      const chipWithout = screen.getByText('No dropdown')
      expect(chipWithout).not.toHaveAttribute('data-dropdown')

      rerender(
        <Chip onClick={jest.fn()} dropdown>
          Has dropdown
        </Chip>,
      )
      const chipWith = screen.getByText('Has dropdown')
      expect(chipWith).toHaveAttribute('data-dropdown')
    })

    it('passes axe when dropdown', async () => {
      const { container } = render(
        <Chip onClick={jest.fn()} dropdown>
          Dropdown
        </Chip>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('States', () => {
    it('sets aria-disabled when disabled', () => {
      render(
        <Chip onClick={jest.fn()} disabled>
          Disabled
        </Chip>,
      )
      expect(screen.getByText('Disabled')).toHaveAttribute(
        'aria-disabled',
        'true',
      )
    })

    it('sets role="button" when onClick is provided', () => {
      render(<Chip onClick={jest.fn()}>Clickable</Chip>)
      expect(
        screen.getByRole('button', { name: /clickable/i }),
      ).toBeInTheDocument()
    })

    it('does not set role="button" when only onDelete is provided', () => {
      render(<Chip onDelete={jest.fn()}>Delete only</Chip>)
      expect(
        screen.queryByRole('button', { name: /delete only/i }),
      ).not.toBeInTheDocument()
    })

    it('always sets tabIndex=0', () => {
      render(<Chip onClick={jest.fn()}>Focusable</Chip>)
      expect(screen.getByText('Focusable')).toHaveAttribute('tabindex', '0')
    })

    it('disables the delete button when chip is disabled', () => {
      render(
        <Chip onDelete={jest.fn()} disabled>
          Disabled deletable
        </Chip>,
      )
      expect(screen.getByRole('button', { name: /remove/i })).toBeDisabled()
    })

    it('shows selected appearance when disabled and selected', () => {
      render(
        <Chip onClick={jest.fn()} disabled selected>
          Disabled selected
        </Chip>,
      )
      const chip = screen.getByText('Disabled selected')
      expect(chip).toHaveAttribute('data-selected')
      expect(chip).toHaveAttribute('aria-disabled', 'true')
    })
  })

  describe('Behavior', () => {
    it('fires onClick when clicked', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      render(<Chip onClick={handleClick}>Clickable</Chip>)
      await user.click(screen.getByRole('button', { name: /clickable/i }))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not fire onClick when disabled', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      render(
        <Chip onClick={handleClick} disabled>
          Disabled
        </Chip>,
      )
      await user.click(screen.getByText('Disabled'))
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('fires onDelete when close button is clicked', async () => {
      const user = userEvent.setup()
      const handleDelete = jest.fn()
      render(<Chip onDelete={handleDelete}>Deletable</Chip>)
      await user.click(screen.getByRole('button', { name: /remove/i }))
      expect(handleDelete).toHaveBeenCalledTimes(1)
    })

    it('does not fire onDelete when disabled', async () => {
      const user = userEvent.setup()
      const handleDelete = jest.fn()
      render(
        <Chip onDelete={handleDelete} disabled>
          Disabled
        </Chip>,
      )
      await user.click(screen.getByRole('button', { name: /remove/i }))
      expect(handleDelete).not.toHaveBeenCalled()
    })

    it('fires onDelete on Enter key when deletable', async () => {
      const user = userEvent.setup()
      const handleDelete = jest.fn()
      render(<Chip onDelete={handleDelete}>Deletable</Chip>)
      const chip = screen.getByText('Deletable')
      chip.focus()
      await user.keyboard('{Enter}')
      expect(handleDelete).toHaveBeenCalledTimes(1)
    })

    it('fires onClick on Enter key when clickable (not deletable)', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      render(<Chip onClick={handleClick}>Clickable</Chip>)
      const chip = screen.getByRole('button', { name: /clickable/i })
      chip.focus()
      await user.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('delete takes precedence over click on Enter key', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      const handleDelete = jest.fn()
      render(
        <Chip onClick={handleClick} onDelete={handleDelete}>
          Both
        </Chip>,
      )
      const chip = screen.getByText('Both')
      chip.focus()
      await user.keyboard('{Enter}')
      expect(handleDelete).toHaveBeenCalledTimes(1)
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('stops propagation when delete button is clicked', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      const handleDelete = jest.fn()
      render(
        <Chip onClick={handleClick} onDelete={handleDelete}>
          Both
        </Chip>,
      )
      await user.click(screen.getByRole('button', { name: /remove/i }))
      expect(handleDelete).toHaveBeenCalledTimes(1)
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Warnings', () => {
    it('warns when neither onClick nor onDelete is provided', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation()
      render(<Chip>No handler</Chip>)
      expect(warnSpy).toHaveBeenCalledWith(
        'Chip: A chip must have at least one of `onClick` or `onDelete`.',
      )
      warnSpy.mockRestore()
    })

    it('does not warn when onClick is provided', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation()
      render(<Chip onClick={jest.fn()}>Has click</Chip>)
      expect(warnSpy).not.toHaveBeenCalled()
      warnSpy.mockRestore()
    })

    it('does not warn when onDelete is provided', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation()
      render(<Chip onDelete={jest.fn()}>Has delete</Chip>)
      expect(warnSpy).not.toHaveBeenCalled()
      warnSpy.mockRestore()
    })

    it('warns when both dropdown and onDelete are provided', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation()
      render(
        <Chip onDelete={jest.fn()} dropdown>
          Both
        </Chip>,
      )
      expect(warnSpy).toHaveBeenCalledWith(
        'Chip: `dropdown` and `onDelete` cannot be used together. `onDelete` takes precedence.',
      )
      warnSpy.mockRestore()
    })
  })

  describe('Accessibility', () => {
    it('passes axe accessibility test (clickable)', async () => {
      const { container } = render(
        <Chip onClick={jest.fn()}>Accessible chip</Chip>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('passes axe when selected', async () => {
      const { container } = render(
        <Chip onClick={jest.fn()} selected>
          Selected
        </Chip>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('passes axe when deletable', async () => {
      const { container } = render(<Chip onDelete={jest.fn()}>Deletable</Chip>)
      expect(await axe(container)).toHaveNoViolations()
    })

    it('passes axe when disabled', async () => {
      const { container } = render(
        <Chip onClick={jest.fn()} disabled>
          Disabled
        </Chip>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('close button has accessible label', () => {
      render(<Chip onDelete={jest.fn()}>Deletable</Chip>)
      expect(
        screen.getByRole('button', { name: /remove/i }),
      ).toBeInTheDocument()
    })
  })
})
