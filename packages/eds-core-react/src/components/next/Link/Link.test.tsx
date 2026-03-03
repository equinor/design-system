import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { axe } from 'jest-axe'
import { Link } from '.'

describe('Link (next)', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Link href="#">Click me</Link>)
      expect(screen.getByRole('link')).toBeInTheDocument()
      expect(screen.getByRole('link')).toHaveTextContent('Click me')
    })

    it('renders inline variant by default', () => {
      render(
        <Link href="#" data-testid="eds-link">
          Link
        </Link>,
      )
      expect(screen.getByTestId('eds-link')).toHaveAttribute(
        'data-variant',
        'inline',
      )
    })

    it('renders standalone variant', () => {
      render(
        <Link href="#" variant="standalone" data-testid="eds-link">
          Link
        </Link>,
      )
      expect(screen.getByTestId('eds-link')).toHaveAttribute(
        'data-variant',
        'standalone',
      )
    })

    it('renders children as composition', () => {
      render(
        <Link href="#" variant="standalone">
          <span data-testid="icon">icon</span>
          Link text
        </Link>,
      )
      expect(screen.getByTestId('icon')).toBeInTheDocument()
      expect(screen.getByRole('link')).toHaveTextContent('Link text')
    })

    it('applies custom className', () => {
      render(
        <Link href="#" data-testid="eds-link" className="custom">
          Link
        </Link>,
      )
      expect(screen.getByTestId('eds-link')).toHaveClass('eds-link', 'custom')
    })

    it('forwards ref', () => {
      const ref = { current: null as HTMLAnchorElement | null }
      render(
        <Link ref={ref} href="#">
          Link
        </Link>,
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    })

    it('spreads additional props', () => {
      render(
        <Link href="#" data-testid="test" data-custom="value">
          Link
        </Link>,
      )
      expect(screen.getByTestId('test')).toHaveAttribute('data-custom', 'value')
    })

    it('sets href attribute', () => {
      render(<Link href="https://example.com">Link</Link>)
      expect(screen.getByRole('link')).toHaveAttribute(
        'href',
        'https://example.com',
      )
    })
  })

  describe('Accessibility', () => {
    it('has no accessibility violations (inline)', async () => {
      const { container } = render(<Link href="#">Link</Link>)
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no accessibility violations (standalone)', async () => {
      const { container } = render(
        <Link href="#" variant="standalone">
          Link
        </Link>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('supports aria attributes', () => {
      render(
        <Link href="#" aria-label="Custom label">
          Link
        </Link>,
      )
      expect(screen.getByRole('link')).toHaveAttribute(
        'aria-label',
        'Custom label',
      )
    })
  })
})
