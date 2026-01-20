import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Input } from './Input'
import { EdsProvider } from '../../EdsProvider'

const getInputWrapper = () => {
  // eslint-disable-next-line testing-library/no-node-access
  return screen.getByDisplayValue('').parentElement
}

describe('Input (Next EDS 2.0)', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(<Input value="input value" readOnly />)
    expect(asFragment()).toMatchSnapshot()
  })

  describe('Accessibility', () => {
    it('Should pass a11y test when using label', async () => {
      const { container } = render(
        <label htmlFor="test-input">
          Label text
          <Input id="test-input" />
        </label>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('Should pass a11y test when using aria-label', async () => {
      const { container } = render(<Input aria-label="description" />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('Basic functionality', () => {
    it('Renders with correct default value', () => {
      const value = 'Some value'
      render(<Input value={value} readOnly />)
      const inputElement = screen.getByDisplayValue(value)
      expect(inputElement).toHaveValue(value)
    })

    it('Renders with invalid state', () => {
      render(<Input aria-label="Invalid input" invalid />)
      const input = screen.getByRole('textbox', { name: 'Invalid input' })
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })

    it('Renders with specified type', () => {
      render(<Input aria-label="Password input" type="password" />)
      const input = screen.getByLabelText('Password input')
      expect(input).toHaveAttribute('type', 'password')
    })

    it('Can be extended with className', () => {
      render(<Input value="textfield" className="custom-class" readOnly />)
      const input = screen.getByDisplayValue('textfield')
      expect(input).toBeInTheDocument()
      // eslint-disable-next-line testing-library/no-node-access
      expect(input.parentElement).toHaveClass('custom-class')
    })

    it('Renders as textarea when as prop is textarea', () => {
      render(<Input as="textarea" value="multiline text" readOnly />)
      const textarea = screen.getByDisplayValue('multiline text')
      expect(textarea.tagName).toBe('TEXTAREA')
    })
  })

  describe('States', () => {
    it('Has disabled attribute when disabled', () => {
      const label = 'disabled input'
      render(
        <label>
          {label}
          <Input disabled />
        </label>,
      )
      const input = screen.getByLabelText(label)
      expect(input).toBeDisabled()
    })

    it('Has readonly attribute when readOnly', () => {
      const label = 'readonly input'
      render(
        <label>
          {label}
          <Input readOnly />
        </label>,
      )
      const input = screen.getByLabelText(label)
      expect(input).toHaveAttribute('readonly')
    })
  })

  describe('Adornments', () => {
    it('Renders left text', () => {
      render(<Input startText="$" value="100" readOnly />)
      expect(screen.getByText('$')).toBeInTheDocument()
    })

    it('Renders right text', () => {
      render(<Input endText="kg" value="50" readOnly />)
      expect(screen.getByText('kg')).toBeInTheDocument()
    })

    it('Renders left adornment', () => {
      render(
        <Input
          startAdornment={<span data-testid="left-adornment">icon</span>}
        />,
      )
      expect(screen.getByTestId('left-adornment')).toBeInTheDocument()
    })

    it('Renders right adornment', () => {
      render(
        <Input
          endAdornment={<span data-testid="right-adornment">icon</span>}
        />,
      )
      expect(screen.getByTestId('right-adornment')).toBeInTheDocument()
    })

    it('Text has text class', () => {
      const { container } = render(<Input startText="$" endText="kg" />)
      /* eslint-disable testing-library/no-container, testing-library/no-node-access */
      const startText = container.querySelector('.eds-adornment__text')
      const endText = container.querySelectorAll('.eds-adornment__text')[1]
      /* eslint-enable testing-library/no-container, testing-library/no-node-access */
      expect(startText).toBeInTheDocument()
      expect(endText).toBeInTheDocument()
    })

    it('Adornment has adornment class', () => {
      const { container } = render(
        <Input
          startAdornment={<span>icon</span>}
          endAdornment={<span>icon</span>}
        />,
      )
      /* eslint-disable testing-library/no-container, testing-library/no-node-access */
      const startAdornment = container.querySelector(
        '.eds-adornment__adornment',
      )
      const endAdornment = container.querySelectorAll(
        '.eds-adornment__adornment',
      )[1]
      /* eslint-enable testing-library/no-container, testing-library/no-node-access */
      expect(startAdornment).toBeInTheDocument()
      expect(endAdornment).toBeInTheDocument()
    })
  })

  describe('EDS 2.0 Token System', () => {
    describe('Color appearance', () => {
      it('Sets neutral appearance by default', () => {
        render(<Input />)
        const wrapper = getInputWrapper()
        expect(wrapper).toHaveAttribute('data-color-appearance', 'neutral')
      })

      it('Sets danger appearance when invalid', () => {
        render(<Input invalid />)
        const wrapper = getInputWrapper()
        expect(wrapper).toHaveAttribute('data-color-appearance', 'danger')
      })

      it('Sets neutral appearance when disabled regardless of invalid state', () => {
        render(<Input invalid disabled />)
        const wrapper = getInputWrapper()
        expect(wrapper).toHaveAttribute('data-color-appearance', 'neutral')
      })

      it('Input element has correct font styling attributes', () => {
        render(<Input invalid value="test" readOnly />)
        const input = screen.getByDisplayValue('test')
        expect(input).toHaveAttribute('data-font-family', 'ui')
        expect(input).toHaveAttribute('data-font-size', 'md')
      })
    })

    describe('Spacing attributes', () => {
      it('Sets data-selectable-space to xs', () => {
        render(<Input />)
        const wrapper = getInputWrapper()
        expect(wrapper).toHaveAttribute('data-selectable-space', 'xs')
      })

      it('Sets data-space-proportions to stretched', () => {
        render(<Input />)
        const wrapper = getInputWrapper()
        expect(wrapper).toHaveAttribute('data-space-proportions', 'stretched')
      })
    })

    describe('Density inheritance', () => {
      it('Does not set data-density attribute', () => {
        render(<Input />)
        const wrapper = getInputWrapper()
        expect(wrapper).not.toHaveAttribute('data-density')
      })

      it('Respects parent data-density attribute', () => {
        render(
          <div data-density="comfortable" data-testid="parent-wrapper">
            <Input />
          </div>,
        )
        const parent = screen.getByTestId('parent-wrapper')
        expect(parent).toHaveAttribute('data-density', 'comfortable')
      })

      it('Works with EdsProvider wrapping parent container', () => {
        render(
          <EdsProvider density="compact">
            <div data-density="comfortable" data-testid="parent-wrapper">
              <Input />
            </div>
          </EdsProvider>,
        )
        const parent = screen.getByTestId('parent-wrapper')
        expect(parent).toHaveAttribute('data-density', 'comfortable')
      })
    })

    describe('CSS classes', () => {
      it('Applies base class and custom className', () => {
        render(<Input className="test-class" />)
        const wrapper = getInputWrapper()
        expect(wrapper).toHaveClass('eds-input-container')
        expect(wrapper).toHaveClass('test-class')
      })

      it('Applies input class to input element', () => {
        render(<Input value="test" readOnly />)
        const input = screen.getByDisplayValue('test')
        expect(input).toHaveClass('eds-input')
      })

      it('Applies disabled data attribute when disabled', () => {
        render(<Input disabled />)
        const wrapper = getInputWrapper()
        expect(wrapper).toHaveAttribute('data-disabled', 'true')
      })

      it('Applies readonly data attribute when readOnly', () => {
        render(<Input readOnly />)
        const wrapper = getInputWrapper()
        expect(wrapper).toHaveAttribute('data-readonly', 'true')
      })

      it('Applies invalid data attribute when invalid', () => {
        render(<Input invalid />)
        const wrapper = getInputWrapper()
        expect(wrapper).toHaveAttribute('data-invalid', 'true')
      })
    })
  })
})
