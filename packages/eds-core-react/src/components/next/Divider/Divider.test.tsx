import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Divider } from '.'

describe('Divider (next)', () => {
  describe('Rendering', () => {
    it('renders an hr with the eds-divider class', () => {
      render(<Divider />)
      const divider = screen.getByRole('separator')
      expect(divider.tagName).toBe('HR')
      expect(divider).toHaveClass('eds-divider')
    })

    it('applies custom className', () => {
      render(<Divider className="custom" />)
      expect(screen.getByRole('separator')).toHaveClass('eds-divider', 'custom')
    })

    it('forwards ref', () => {
      const ref = createRef<HTMLHRElement>()
      render(<Divider ref={ref} />)
      expect(ref.current).toBeInstanceOf(HTMLHRElement)
    })

    it('spreads additional props', () => {
      render(<Divider data-testid="my-divider" data-custom="value" />)
      expect(screen.getByTestId('my-divider')).toHaveAttribute(
        'data-custom',
        'value',
      )
    })
  })

  describe('Accessibility', () => {
    it('has the separator role by default (native <hr>)', () => {
      render(<Divider />)
      expect(screen.getByRole('separator')).toBeInTheDocument()
    })

    it('has no accessibility violations', async () => {
      const { container } = render(
        <>
          <p>Some text</p>
          <Divider />
          <p>More text</p>
        </>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
