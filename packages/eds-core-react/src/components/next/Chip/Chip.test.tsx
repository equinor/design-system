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
  })

  describe('Deletable', () => {
    it('renders close icon when deletable', () => {
      render(<Chip deletable>Label</Chip>)
      expect(screen.getByTestId('eds-icon')).toBeInTheDocument()
    })

    it('does not render close icon when not deletable', () => {
      render(<Chip>Label</Chip>)
      expect(screen.queryByTestId('eds-icon')).not.toBeInTheDocument()
    })
  })

  describe('Dropdown', () => {
    it('renders dropdown icon when dropdown is true', () => {
      render(<Chip dropdown>Label</Chip>)
      expect(screen.getByTestId('eds-icon')).toBeInTheDocument()
    })

    it('deletable takes priority over dropdown', () => {
      render(
        <Chip deletable dropdown>
          Label
        </Chip>,
      )
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
      const { container } = render(<Chip deletable>Label</Chip>)
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
  })
})
