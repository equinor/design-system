import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { axe } from 'jest-axe'
import { save, add, warning_filled } from '@equinor/eds-icons'
import type { IconData } from '@equinor/eds-icons'
import { Icon } from '.'

const customIconWithMultiplePaths: IconData = {
  svgPathData: [
    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z',
    'M13 17h-2v-6h2v6zm0-8h-2V7h2v2z',
  ],
  name: 'custom-icon',
  prefix: 'custom',
  height: '24',
  width: '24',
}

describe('Icon (next)', () => {
  describe('Rendering', () => {
    it('renders with data prop', () => {
      render(<Icon data={save} />)
      expect(screen.getByTestId('eds-icon')).toBeInTheDocument()
    })

    it('renders with correct viewBox from icon data', () => {
      render(<Icon data={save} />)
      const svg = screen.getByTestId('eds-icon')
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
    })

    it('supports icons with multiple paths', () => {
      render(<Icon data={customIconWithMultiplePaths} title="Custom icon" />)
      expect(screen.getByLabelText('Custom icon')).toBeInTheDocument()
    })

    it('returns null and logs error when data is missing', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      render(<Icon data={undefined as never} />)
      expect(screen.queryByTestId('eds-icon')).not.toBeInTheDocument()
      expect(consoleSpy).toHaveBeenCalledWith('Icon: data prop is required')
      consoleSpy.mockRestore()
    })
  })

  describe('Sizing', () => {
    it('has icon class for CSS styling', () => {
      render(<Icon data={save} />)
      expect(screen.getByTestId('eds-icon')).toHaveClass('icon')
    })

    it('sets data-icon-size attribute when size prop is provided', () => {
      render(<Icon data={save} size="lg" />)
      expect(screen.getByTestId('eds-icon')).toHaveAttribute(
        'data-icon-size',
        'lg',
      )
    })

    it('does not set data-icon-size when size prop is not provided', () => {
      render(<Icon data={save} />)
      expect(screen.getByTestId('eds-icon')).not.toHaveAttribute(
        'data-icon-size',
      )
    })

    it.each([
      'xs',
      'sm',
      'md',
      'lg',
      'xl',
      '2xl',
      '3xl',
      '4xl',
      '5xl',
      '6xl',
    ] as const)('accepts size prop value: %s', (size) => {
      render(<Icon data={save} size={size} />)
      expect(screen.getByTestId('eds-icon')).toHaveAttribute(
        'data-icon-size',
        size,
      )
    })
  })

  describe('Color', () => {
    it('uses currentColor by default', () => {
      render(<Icon data={save} />)
      expect(screen.getByTestId('eds-icon')).toHaveAttribute(
        'fill',
        'currentColor',
      )
    })

    it('accepts custom color prop', () => {
      render(<Icon data={save} color="red" />)
      expect(screen.getByTestId('eds-icon')).toHaveAttribute('fill', 'red')
    })
  })

  describe('Accessibility', () => {
    it('is decorative (aria-hidden) when no title is provided', () => {
      render(<Icon data={save} />)
      const svg = screen.getByTestId('eds-icon')
      expect(svg).toHaveAttribute('aria-hidden', 'true')
      expect(svg).not.toHaveAttribute('role')
    })

    it('is semantic (role="img") when title is provided', () => {
      render(<Icon data={save} title="Save document" />)
      const svg = screen.getByLabelText('Save document')
      expect(svg).toHaveAttribute('role', 'img')
      expect(svg).toHaveAttribute('aria-labelledby')
      expect(svg).not.toHaveAttribute('aria-hidden')
    })

    it('renders title element when title prop is provided', () => {
      render(<Icon data={save} title="Save document" />)
      expect(screen.getByTitle('Save document')).toBeInTheDocument()
    })

    it('passes axe accessibility test (decorative)', async () => {
      const { container } = render(<Icon data={save} />)
      expect(await axe(container)).toHaveNoViolations()
    })

    it('passes axe accessibility test (semantic)', async () => {
      const { container } = render(<Icon data={save} title="Save document" />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('HTML attributes', () => {
    it('forwards ref to SVG element', () => {
      const ref = jest.fn()
      render(<Icon data={save} ref={ref} />)
      expect(ref).toHaveBeenCalledWith(expect.any(SVGSVGElement))
    })

    it('accepts additional className', () => {
      render(<Icon data={save} className="custom-class" />)
      const svg = screen.getByTestId('eds-icon')
      expect(svg).toHaveClass('icon', 'custom-class')
    })

    it('spreads additional props to SVG element', () => {
      render(<Icon data={save} data-custom="value" />)
      expect(screen.getByTestId('eds-icon')).toHaveAttribute(
        'data-custom',
        'value',
      )
    })

    it('has correct viewBox from icon data', () => {
      render(<Icon data={save} />)
      expect(screen.getByTestId('eds-icon')).toHaveAttribute(
        'viewBox',
        '0 0 24 24',
      )
    })

    it('handles custom viewBox dimensions', () => {
      const customIcon: IconData = {
        svgPathData: 'M0 0h48v48H0z',
        name: 'custom',
        prefix: 'custom',
        height: '48',
        width: '48',
      }
      render(<Icon data={customIcon} />)
      expect(screen.getByTestId('eds-icon')).toHaveAttribute(
        'viewBox',
        '0 0 48 48',
      )
    })
  })

  describe('Usage patterns', () => {
    it('renders inline with text', () => {
      render(
        <p>
          Click <Icon data={save} title="save" /> to save
        </p>,
      )
      expect(screen.getByLabelText('save')).toBeInTheDocument()
      expect(screen.getByText(/Click/)).toBeInTheDocument()
      expect(screen.getByText(/to save/)).toBeInTheDocument()
    })

    it('renders multiple icons without conflict', () => {
      render(
        <div>
          <Icon data={save} title="save" />
          <Icon data={add} title="add" />
          <Icon data={warning_filled} title="warning" />
        </div>,
      )
      const icons = screen.getAllByTestId('eds-icon')
      expect(icons).toHaveLength(3)
    })

    it('renders inside Typography-like context (data-font-size)', () => {
      render(
        <div data-font-size="md">
          <Icon data={warning_filled} title="warning" /> Alert message
        </div>,
      )
      expect(screen.getByLabelText('warning')).toBeInTheDocument()
    })

    it('renders inside density context (data-density)', () => {
      render(
        <div data-density="comfortable">
          <Icon data={save} size="md" title="save" />
        </div>,
      )
      expect(screen.getByLabelText('save')).toBeInTheDocument()
    })

    it('renders in flex container with explicit size', () => {
      render(
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon data={add} size="md" title="add" />
          <span>Add new item</span>
        </div>,
      )
      expect(screen.getByLabelText('add')).toBeInTheDocument()
      expect(screen.getByText('Add new item')).toBeInTheDocument()
    })

    it('can mix sized and auto-sized icons', () => {
      render(
        <div>
          <Icon data={save} size="lg" />
          <Icon data={add} />
        </div>,
      )
      const icons = screen.getAllByTestId('eds-icon')
      expect(icons[0]).toHaveAttribute('data-icon-size', 'lg')
      expect(icons[1]).not.toHaveAttribute('data-icon-size')
    })
  })
})
