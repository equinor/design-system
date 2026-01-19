import { render, screen } from '@testing-library/react'
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
      const label = container.querySelector('.eds-label')
      expect(label).toHaveClass('eds-label', 'custom-class')
    })

    test('Forwards ref to label element', () => {
      const ref = { current: null } as React.RefObject<HTMLLabelElement>
      render(<Label label="Test" ref={ref} htmlFor="test" />)
      expect(ref.current).toBeInstanceOf(HTMLLabelElement)
    })
  })
})
