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

    it('sets data-font-size for standalone variant', () => {
      render(
        <Link href="#" variant="standalone">
          Link
        </Link>,
      )
      expect(screen.getByRole('link')).toHaveAttribute('data-font-size', 'md')
    })

    it('does not set data-font-size for inline variant', () => {
      render(<Link href="#">Link</Link>)
      expect(screen.getByRole('link')).not.toHaveAttribute('data-font-size')
    })

    it('sets data-font-family for standalone variant', () => {
      render(
        <Link href="#" variant="standalone">
          Link
        </Link>,
      )
      expect(screen.getByRole('link')).toHaveAttribute('data-font-family', 'ui')
    })

    it('does not set data-font-family for inline variant', () => {
      render(<Link href="#">Link</Link>)
      expect(screen.getByRole('link')).not.toHaveAttribute('data-font-family')
    })

    it('sets data-line-height for standalone variant', () => {
      render(
        <Link href="#" variant="standalone">
          Link
        </Link>,
      )
      expect(screen.getByRole('link')).toHaveAttribute(
        'data-line-height',
        'squished',
      )
    })

    it('does not set data-line-height for inline variant', () => {
      render(<Link href="#">Link</Link>)
      expect(screen.getByRole('link')).not.toHaveAttribute('data-line-height')
    })
  })

  describe('asChild', () => {
    it('renders child element instead of <a>', () => {
      render(
        <Link asChild>
          <button type="button">Link as button</button>
        </Link>,
      )
      expect(screen.getByRole('button')).toBeInTheDocument()
      expect(screen.getByRole('button')).toHaveTextContent('Link as button')
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })

    it('merges className onto child', () => {
      render(
        <Link asChild className="custom">
          <button type="button" className="child-class">
            Link
          </button>
        </Link>,
      )
      expect(screen.getByRole('button')).toHaveClass(
        'eds-link',
        'custom',
        'child-class',
      )
    })

    it('merges data attributes onto child', () => {
      render(
        <Link asChild variant="standalone">
          <a href="/page">Link</a>
        </Link>,
      )
      expect(screen.getByRole('link')).toHaveAttribute(
        'data-variant',
        'standalone',
      )
    })

    it('preserves child href', () => {
      render(
        <Link asChild>
          <a href="/my-route">Router link</a>
        </Link>,
      )
      expect(screen.getByRole('link')).toHaveAttribute('href', '/my-route')
    })

    it('slot href wins over child href when both are set', () => {
      render(
        <Link asChild href="/from-link">
          <a href="/from-child">Link</a>
        </Link>,
      )
      expect(screen.getByRole('link')).toHaveAttribute('href', '/from-link')
    })

    it('forwards ref to child element', () => {
      const ref = { current: null as HTMLAnchorElement | null }
      render(
        <Link asChild ref={ref}>
          <a href="/">Link</a>
        </Link>,
      )
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
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
