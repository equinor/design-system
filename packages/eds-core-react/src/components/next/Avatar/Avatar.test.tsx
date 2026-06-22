import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Avatar } from './Avatar'
import { AvatarNameLabel } from './AvatarNameLabel'

describe('Avatar (next)', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Avatar data-testid="eds-avatar" />)
      expect(screen.getByTestId('eds-avatar')).toBeInTheDocument()
    })

    it('renders the initial letter', () => {
      render(<Avatar initial="C" />)
      expect(screen.getByTestId('eds-avatar-initial')).toHaveTextContent('C')
    })

    it('does not render initial span when initial is not provided', () => {
      render(<Avatar />)
      expect(screen.queryByTestId('eds-avatar-initial')).not.toBeInTheDocument()
    })

    it('initial is aria-hidden', () => {
      render(<Avatar initial="C" />)
      expect(screen.getByTestId('eds-avatar-initial')).toHaveAttribute(
        'aria-hidden',
        'true',
      )
    })

    it('applies custom className', () => {
      render(<Avatar data-testid="eds-avatar" className="custom" />)
      expect(screen.getByTestId('eds-avatar')).toHaveClass(
        'eds-avatar',
        'custom',
      )
    })

    it('forwards ref', () => {
      const ref = { current: null as HTMLDivElement | null }
      render(<Avatar ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })

    it('spreads additional props', () => {
      render(<Avatar data-testid="test" data-custom="value" />)
      expect(screen.getByTestId('test')).toHaveAttribute('data-custom', 'value')
    })
  })

  describe('Variants', () => {
    it('applies size attribute', () => {
      render(<Avatar data-testid="eds-avatar" size="sm" />)
      expect(screen.getByTestId('eds-avatar')).toHaveAttribute(
        'data-size',
        'sm',
      )
    })

    it('applies emphasis attribute', () => {
      render(<Avatar data-testid="eds-avatar" emphasis="high" />)
      expect(screen.getByTestId('eds-avatar')).toHaveAttribute(
        'data-emphasis',
        'high',
      )
    })

    it('always sets data-color-appearance to accent', () => {
      render(<Avatar data-testid="eds-avatar" />)
      expect(screen.getByTestId('eds-avatar')).toHaveAttribute(
        'data-color-appearance',
        'accent',
      )
    })
  })

  describe('Notification', () => {
    it('renders notification dot when notification=true', () => {
      render(<Avatar notification />)
      expect(screen.getByTestId('eds-avatar-notification')).toBeInTheDocument()
    })

    it('does not render notification dot when notification=false', () => {
      render(<Avatar notification={false} />)
      expect(
        screen.queryByTestId('eds-avatar-notification'),
      ).not.toBeInTheDocument()
    })

    it('notification dot is aria-hidden', () => {
      render(<Avatar notification />)
      expect(screen.getByTestId('eds-avatar-notification')).toHaveAttribute(
        'aria-hidden',
        'true',
      )
    })
  })

  describe('Accessibility', () => {
    it('has no accessibility violations with no label (default render)', async () => {
      const { container } = render(<Avatar initial="A" />)
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no accessibility violations with role="img" and aria-label', async () => {
      // Standalone Avatar used as a meaningful image needs role="img" + aria-label
      const { container } = render(
        <Avatar initial="A" role="img" aria-label="Ada Lovelace" />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no accessibility violations with notification', async () => {
      const { container } = render(<Avatar initial="A" notification />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})

describe('AvatarNameLabel (next)', () => {
  describe('Rendering', () => {
    it('renders full name', () => {
      render(<AvatarNameLabel fullName="Ada Lovelace" />)
      expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
    })

    it('renders email when provided', () => {
      render(
        <AvatarNameLabel fullName="Ada Lovelace" email="ada@example.com" />,
      )
      expect(screen.getByText('ada@example.com')).toBeInTheDocument()
    })

    it('does not render email element when email is not provided', () => {
      render(<AvatarNameLabel fullName="Ada Lovelace" />)
      expect(screen.queryByTestId('eds-avatar-email')).not.toBeInTheDocument()
    })

    it('derives initial from first letter of fullName', () => {
      render(<AvatarNameLabel fullName="Ada Lovelace" />)
      expect(screen.getByTestId('eds-avatar-initial')).toHaveTextContent('A')
    })

    it('uses provided initial over derived one', () => {
      render(<AvatarNameLabel fullName="Ada Lovelace" initial="X" />)
      expect(screen.getByTestId('eds-avatar-initial')).toHaveTextContent('X')
    })

    it('renders slot right when children provided', () => {
      render(
        <AvatarNameLabel fullName="Ada Lovelace">
          <span data-testid="slot-content">icon</span>
        </AvatarNameLabel>,
      )
      expect(screen.getByTestId('slot-content')).toBeInTheDocument()
    })

    it('does not render slot right when no children', () => {
      render(<AvatarNameLabel fullName="Ada Lovelace" />)
      expect(
        screen.queryByTestId('eds-avatar-slot-right'),
      ).not.toBeInTheDocument()
    })

    it('forwards ref', () => {
      const ref = { current: null as HTMLDivElement | null }
      render(<AvatarNameLabel ref={ref} fullName="Ada Lovelace" />)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('Avatar pass-throughs', () => {
    it('passes notification to inner Avatar', () => {
      render(<AvatarNameLabel fullName="Ada" notification />)
      expect(screen.getByTestId('eds-avatar-notification')).toBeInTheDocument()
    })

    it('does not show notification dot when notification=false', () => {
      render(<AvatarNameLabel fullName="Ada" notification={false} />)
      expect(
        screen.queryByTestId('eds-avatar-notification'),
      ).not.toBeInTheDocument()
    })
  })

  describe('Layout', () => {
    it('applies horizontal layout by default', () => {
      render(<AvatarNameLabel data-testid="label" fullName="Ada Lovelace" />)
      expect(screen.getByTestId('label')).toHaveAttribute(
        'data-layout',
        'horizontal',
      )
    })

    it('applies vertical layout', () => {
      render(
        <AvatarNameLabel
          data-testid="label"
          fullName="Ada Lovelace"
          layout="vertical"
        />,
      )
      expect(screen.getByTestId('label')).toHaveAttribute(
        'data-layout',
        'vertical',
      )
    })
  })

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <AvatarNameLabel fullName="Ada Lovelace" email="ada@example.com" />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no accessibility violations with vertical layout', async () => {
      const { container } = render(
        <AvatarNameLabel
          fullName="Ada Lovelace"
          email="ada@example.com"
          layout="vertical"
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
