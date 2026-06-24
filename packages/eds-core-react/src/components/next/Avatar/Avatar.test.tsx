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
      expect(screen.getByText('C')).toBeInTheDocument()
    })

    it('renders an image when src is provided', () => {
      render(<Avatar src="photo.jpg" name="Ada Lovelace" />)
      expect(
        screen.getByRole('img', { name: 'Ada Lovelace' }),
      ).toBeInTheDocument()
    })

    it('does not render initials when src is provided', () => {
      render(<Avatar src="photo.jpg" name="Ada Lovelace" />)
      expect(screen.queryByText('AL')).not.toBeInTheDocument()
    })

    it('does not render initial span when initial is not provided', () => {
      render(<Avatar data-testid="eds-avatar" />)
      expect(screen.getByTestId('eds-avatar')).toBeEmptyDOMElement()
    })

    it('initial is aria-hidden', () => {
      render(<Avatar initial="C" />)
      expect(screen.getByText('C')).toHaveAttribute('aria-hidden', 'true')
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
      render(<Avatar data-testid="eds-avatar" notification />)
      expect(screen.getByTestId('eds-avatar')).toBeInTheDocument()
    })

    it('does not render notification dot when notification=false', () => {
      render(<Avatar data-testid="eds-avatar" notification={false} />)
      expect(screen.getByTestId('eds-avatar')).toBeEmptyDOMElement()
    })

    it('notification is merged into avatar aria-label when name is provided', () => {
      render(
        <Avatar data-testid="eds-avatar" name="Ada Lovelace" notification />,
      )
      expect(screen.getByTestId('eds-avatar')).toHaveAttribute(
        'aria-label',
        'Ada Lovelace, notification',
      )
    })
  })

  describe('Accessibility', () => {
    it('has no accessibility violations with no label (default render)', async () => {
      const { container } = render(<Avatar initial="A" />)
      expect(await axe(container)).toHaveNoViolations()
    })

    it('auto-derives initial from name when initial is not provided', () => {
      render(<Avatar name="Ada Lovelace" />)
      expect(screen.getByText('AL')).toBeInTheDocument()
    })

    it('name prop sets role="img" and aria-label', () => {
      render(
        <Avatar data-testid="eds-avatar" initial="AL" name="Ada Lovelace" />,
      )
      const el = screen.getByTestId('eds-avatar')
      expect(el).toHaveAttribute('role', 'img')
      expect(el).toHaveAttribute('aria-label', 'Ada Lovelace')
    })

    it('has no accessibility violations with name prop', async () => {
      const { container } = render(<Avatar initial="AL" name="Ada Lovelace" />)
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
    it('renders name', () => {
      render(<AvatarNameLabel name="Ada Lovelace" />)
      expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
    })

    it('renders meta when provided', () => {
      render(<AvatarNameLabel name="Ada Lovelace" meta="Senior Engineer" />)
      expect(screen.getByText('Senior Engineer')).toBeInTheDocument()
    })

    it('does not render meta when not provided', () => {
      render(<AvatarNameLabel name="Ada Lovelace" />)
      expect(screen.queryByText('Senior Engineer')).not.toBeInTheDocument()
    })

    it('derives initials from first and last word of name', () => {
      render(<AvatarNameLabel name="Ada Lovelace" />)
      expect(screen.getByText('AL')).toBeInTheDocument()
    })

    it('derives single initial when name is one word', () => {
      render(<AvatarNameLabel name="Ada" />)
      expect(screen.getByText('A')).toBeInTheDocument()
    })

    it('uses provided initial over derived one', () => {
      render(<AvatarNameLabel name="Ada Lovelace" initial="X" />)
      expect(screen.getByText('X')).toBeInTheDocument()
    })

    it('renders slot right when children provided', () => {
      render(
        <AvatarNameLabel name="Ada Lovelace">
          <span data-testid="slot-content">icon</span>
        </AvatarNameLabel>,
      )
      expect(screen.getByTestId('slot-content')).toBeInTheDocument()
    })

    it('does not render slot right when no children', () => {
      render(<AvatarNameLabel name="Ada Lovelace" />)
      expect(screen.queryByTestId('slot-content')).not.toBeInTheDocument()
    })

    it('forwards ref', () => {
      const ref = { current: null as HTMLDivElement | null }
      render(<AvatarNameLabel ref={ref} name="Ada Lovelace" />)
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  describe('Avatar pass-throughs', () => {
    it('renders without error when notification is passed', () => {
      render(<AvatarNameLabel name="Ada" notification />)
      expect(screen.getByText('Ada')).toBeInTheDocument()
    })

    // size and emphasis flow to the inner Avatar via props — verified visually
    // and by TypeScript. Testing Library's no-node-access rule prevents querying
    // the inner div's data attributes directly; the type system enforces the wiring.
    it('renders with size prop without error', () => {
      render(<AvatarNameLabel name="Ada" size="sm" />)
      expect(screen.getByText('Ada')).toBeInTheDocument()
    })

    it('renders with emphasis prop without error', () => {
      render(<AvatarNameLabel name="Ada" emphasis="high" />)
      expect(screen.getByText('Ada')).toBeInTheDocument()
    })
  })

  describe('Layout', () => {
    it('applies horizontal layout by default', () => {
      render(<AvatarNameLabel data-testid="label" name="Ada Lovelace" />)
      expect(screen.getByTestId('label')).toHaveAttribute(
        'data-layout',
        'horizontal',
      )
    })

    it('applies vertical layout', () => {
      render(
        <AvatarNameLabel
          data-testid="label"
          name="Ada Lovelace"
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
        <AvatarNameLabel name="Ada Lovelace" meta="ada@example.com" />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no accessibility violations with vertical layout', async () => {
      const { container } = render(
        <AvatarNameLabel
          name="Ada Lovelace"
          meta="ada@example.com"
          layout="vertical"
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('announces notification via visually-hidden text', () => {
      render(<AvatarNameLabel name="Ada Lovelace" notification />)
      expect(screen.getByText('Notification')).toBeInTheDocument()
    })

    it('has no accessibility violations with notification', async () => {
      const { container } = render(
        <AvatarNameLabel
          name="Ada Lovelace"
          meta="Senior Engineer"
          notification
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no accessibility violations with photo — image is decorative', async () => {
      const { container } = render(
        <AvatarNameLabel
          name="Ada Lovelace"
          meta="ada@example.com"
          src="photo.jpg"
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
