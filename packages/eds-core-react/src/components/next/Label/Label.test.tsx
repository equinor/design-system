import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { Label } from './Label'

describe('Label', () => {
  describe('Accessibility', () => {
    test('Should pass a11y test', async () => {
      const { container } = render(
        <Label label="Username" htmlFor="username" />,
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    test('Should pass a11y test with info tooltip', async () => {
      const { container } = render(
        <Label label="Email" htmlFor="email" info="Enter your work email" />,
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  describe('Rendering', () => {
    test('Renders label text', () => {
      render(<Label label="Username" htmlFor="username" />)
      expect(screen.getByText('Username')).toBeInTheDocument()
    })

    test('Renders optional indicator', () => {
      render(<Label label="Bio" optional htmlFor="bio" />)
      expect(screen.getByText('(Optional)')).toBeInTheDocument()
    })

    test('Renders required indicator', () => {
      render(<Label label="Email" required htmlFor="email" />)
      expect(screen.getByText('(Required)')).toBeInTheDocument()
    })

    test('Required takes precedence over optional', () => {
      render(<Label label="Name" required optional htmlFor="name" />)
      expect(screen.getByText('(Required)')).toBeInTheDocument()
      expect(screen.queryByText('(Optional)')).not.toBeInTheDocument()
    })

    test('Renders info button when info prop is provided', () => {
      render(
        <Label
          label="Password"
          info="Must be at least 8 characters"
          htmlFor="password"
        />,
      )
      expect(
        screen.getByRole('button', { name: 'More information' }),
      ).toBeInTheDocument()
    })

    test('Does not render info button when info is not provided', () => {
      render(<Label label="Username" htmlFor="username" />)
      expect(
        screen.queryByRole('button', { name: 'More information' }),
      ).not.toBeInTheDocument()
    })
  })

  describe('Tooltip interaction', () => {
    test('Shows tooltip content on hover', async () => {
      const user = userEvent.setup()
      render(
        <Label
          label="Email"
          info="Your primary contact email"
          htmlFor="email"
        />,
      )

      const infoButton = screen.getByRole('button', {
        name: 'More information',
      })
      await user.hover(infoButton)

      expect(await screen.findByRole('tooltip')).toBeInTheDocument()
      expect(screen.getByText('Your primary contact email')).toBeInTheDocument()
    })

    test('Shows tooltip content on focus', async () => {
      const user = userEvent.setup()
      render(<Label label="Name" info="Enter your full name" htmlFor="name" />)

      const infoButton = screen.getByRole('button', {
        name: 'More information',
      })
      await user.tab()

      // The button should receive focus
      expect(infoButton).toHaveFocus()
      expect(await screen.findByRole('tooltip')).toBeInTheDocument()
    })
  })

  describe('Props', () => {
    test('Applies htmlFor attribute', () => {
      render(<Label label="Username" htmlFor="username-field" />)
      expect(screen.getByText('Username')).toHaveAttribute(
        'for',
        'username-field',
      )
    })

    test('Applies custom className', () => {
      const { container } = render(
        <Label label="Test" className="custom-class" htmlFor="test" />,
      )
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      const wrapper = container.querySelector('.eds-label')
      expect(wrapper).toHaveClass('eds-label', 'custom-class')
    })

    test('Forwards ref to label element', () => {
      const ref = { current: null } as React.RefObject<HTMLLabelElement>
      render(<Label label="Test" ref={ref} htmlFor="test" />)
      expect(ref.current).toBeInstanceOf(HTMLLabelElement)
    })
  })
})
