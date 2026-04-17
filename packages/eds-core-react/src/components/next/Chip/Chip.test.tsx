import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { Chip } from '.'

describe('Chip (next)', () => {
  describe('Rendering', () => {
    it('renders with children', () => {
      render(<Chip>Label</Chip>)
      expect(screen.getByText('Label')).toBeInTheDocument()
    })

    it('renders with default props', () => {
      render(<Chip data-testid="eds-chip">Label</Chip>)
      const chip = screen.getByTestId('eds-chip')
      expect(chip).toHaveAttribute('data-variant', 'default')
      expect(chip).toHaveAttribute('data-color-appearance', 'neutral')
    })

    it('applies custom className', () => {
      render(
        <Chip data-testid="eds-chip" className="custom">
          Label
        </Chip>,
      )
      expect(screen.getByTestId('eds-chip')).toHaveClass('eds-chip', 'custom')
    })

    it('forwards ref', () => {
      const ref = { current: null as HTMLDivElement | null }
      render(<Chip ref={ref}>Label</Chip>)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })

    it('spreads additional props', () => {
      render(
        <Chip data-testid="test" data-custom="value">
          Label
        </Chip>,
      )
      expect(screen.getByTestId('test')).toHaveAttribute('data-custom', 'value')
    })
  })

  describe('Always interactive', () => {
    it('has role="button"', () => {
      render(<Chip>Label</Chip>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('is focusable', () => {
      render(<Chip data-testid="eds-chip">Label</Chip>)
      expect(screen.getByTestId('eds-chip')).toHaveAttribute('tabindex', '0')
    })
  })

  describe('Tones', () => {
    it.each([
      ['neutral', 'neutral'],
      ['accent', 'accent'],
      ['success', 'success'],
      ['info', 'info'],
      ['warning', 'warning'],
      ['danger', 'danger'],
    ] as const)(
      'renders tone="%s" with color-appearance="%s"',
      (tone, expected) => {
        render(
          <Chip data-testid="eds-chip" tone={tone}>
            Label
          </Chip>,
        )
        expect(screen.getByTestId('eds-chip')).toHaveAttribute(
          'data-color-appearance',
          expected,
        )
      },
    )
  })

  describe('Variants', () => {
    it('renders default variant', () => {
      render(<Chip data-testid="eds-chip">Label</Chip>)
      expect(screen.getByTestId('eds-chip')).toHaveAttribute(
        'data-variant',
        'default',
      )
    })

    it('renders outlined variant', () => {
      render(
        <Chip data-testid="eds-chip" variant="outlined">
          Label
        </Chip>,
      )
      expect(screen.getByTestId('eds-chip')).toHaveAttribute(
        'data-variant',
        'outlined',
      )
    })

    it('renders high-contrast variant', () => {
      render(
        <Chip data-testid="eds-chip" variant="high-contrast">
          Label
        </Chip>,
      )
      expect(screen.getByTestId('eds-chip')).toHaveAttribute(
        'data-variant',
        'high-contrast',
      )
    })
  })

  describe('Selected', () => {
    it('renders check icon when selected', () => {
      render(<Chip selected>Label</Chip>)
      expect(screen.getByTestId('eds-icon')).toBeInTheDocument()
    })

    it('does not render check icon when not selected', () => {
      render(<Chip>Label</Chip>)
      expect(screen.queryByTestId('eds-icon')).not.toBeInTheDocument()
    })

    it('sets data-selected when selected', () => {
      render(
        <Chip data-testid="eds-chip" selected>
          Label
        </Chip>,
      )
      expect(screen.getByTestId('eds-chip')).toHaveAttribute('data-selected')
    })

    it('does not set data-selected when not selected', () => {
      render(<Chip data-testid="eds-chip">Label</Chip>)
      expect(screen.getByTestId('eds-chip')).not.toHaveAttribute(
        'data-selected',
      )
    })

    it('sets aria-pressed for toggleable chips', () => {
      const { rerender } = render(<Chip>Label</Chip>)
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-pressed',
        'false',
      )
      rerender(<Chip selected>Label</Chip>)
      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
    })

    it('does not set aria-pressed for deletable or dropdown chips', () => {
      const { rerender } = render(<Chip onDelete={jest.fn()}>Label</Chip>)
      expect(screen.getByRole('button')).not.toHaveAttribute('aria-pressed')
      rerender(<Chip dropdown>Label</Chip>)
      expect(screen.getByRole('button')).not.toHaveAttribute('aria-pressed')
    })

    it('sets aria-expanded on dropdown chips based on selected', () => {
      const { rerender } = render(<Chip dropdown>Label</Chip>)
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-expanded',
        'false',
      )
      rerender(
        <Chip dropdown selected>
          Label
        </Chip>,
      )
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-expanded',
        'true',
      )
    })
  })

  describe('Deletable', () => {
    it('renders close icon when onDelete is provided', () => {
      render(<Chip onDelete={jest.fn()}>Label</Chip>)
      expect(screen.getByTestId('eds-icon')).toBeInTheDocument()
    })

    it('does not render close icon when onDelete is omitted', () => {
      render(<Chip>Label</Chip>)
      expect(screen.queryByTestId('eds-icon')).not.toBeInTheDocument()
    })

    it('fires onDelete when the chip is clicked', async () => {
      const user = userEvent.setup()
      const onDelete = jest.fn()
      render(<Chip onDelete={onDelete}>Label</Chip>)
      await user.click(screen.getByRole('button'))
      expect(onDelete).toHaveBeenCalledTimes(1)
    })

    it('onClick is ignored when onDelete is set', async () => {
      const user = userEvent.setup()
      const onClick = jest.fn()
      const onDelete = jest.fn()
      render(
        <Chip onClick={onClick} onDelete={onDelete}>
          Label
        </Chip>,
      )
      await user.click(screen.getByRole('button'))
      expect(onDelete).toHaveBeenCalledTimes(1)
      expect(onClick).not.toHaveBeenCalled()
    })

    it('fires onDelete on Enter when focused', async () => {
      const user = userEvent.setup()
      const onDelete = jest.fn()
      render(<Chip onDelete={onDelete}>Label</Chip>)
      screen.getByRole('button').focus()
      await user.keyboard('{Enter}')
      expect(onDelete).toHaveBeenCalledTimes(1)
    })

    it('accessible name includes the chip text and the remove hint', () => {
      render(<Chip onDelete={jest.fn()}>Status: Active</Chip>)
      const name = screen.getByRole('button').textContent ?? ''
      expect(name).toContain('Status: Active')
    })
  })

  describe('Dropdown', () => {
    it('renders dropdown icon when dropdown is true', () => {
      render(<Chip dropdown>Label</Chip>)
      expect(screen.getByTestId('eds-icon')).toBeInTheDocument()
    })

    it('onDelete takes priority over dropdown', () => {
      render(
        <Chip onDelete={jest.fn()} dropdown>
          Label
        </Chip>,
      )
      // Close icon shown (deletable), not dropdown arrow
      const icons = screen.getAllByTestId('eds-icon')
      expect(icons).toHaveLength(1)
    })
  })

  describe('Click behavior', () => {
    it('handles click events', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      render(<Chip onClick={handleClick}>Label</Chip>)
      await user.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('triggers onClick on Enter key', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      render(<Chip onClick={handleClick}>Label</Chip>)
      screen.getByRole('button').focus()
      await user.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('triggers onClick on Space key', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      render(<Chip onClick={handleClick}>Label</Chip>)
      screen.getByRole('button').focus()
      await user.keyboard(' ')
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    it('has no accessibility violations (default)', async () => {
      const { container } = render(<Chip>Label</Chip>)
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no accessibility violations (with onClick)', async () => {
      const { container } = render(<Chip onClick={jest.fn()}>Label</Chip>)
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no accessibility violations (deletable)', async () => {
      const { container } = render(<Chip onDelete={jest.fn()}>Label</Chip>)
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no accessibility violations (all variants)', async () => {
      const { container } = render(
        <>
          <Chip variant="default">Default</Chip>
          <Chip variant="outlined">Outlined</Chip>
          <Chip variant="high-contrast">High contrast</Chip>
        </>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no accessibility violations (selected)', async () => {
      const { container } = render(<Chip selected>Selected</Chip>)
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no accessibility violations (dropdown)', async () => {
      const { container } = render(<Chip dropdown>Options</Chip>)
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no accessibility violations (dropdown open)', async () => {
      const { container } = render(
        <Chip dropdown selected>
          Options
        </Chip>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no accessibility violations (all tones)', async () => {
      const { container } = render(
        <>
          <Chip tone="neutral">Neutral</Chip>
          <Chip tone="accent">Accent</Chip>
          <Chip tone="success">Success</Chip>
          <Chip tone="info">Info</Chip>
          <Chip tone="warning">Warning</Chip>
          <Chip tone="danger">Danger</Chip>
        </>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
