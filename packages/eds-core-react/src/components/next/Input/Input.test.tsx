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
    })

    it('Can be extended with className and style', () => {
      render(
        <Input
          value="textfield"
          className="custom-class"
          style={{ marginTop: '48px' }}
          readOnly
        />,
      )
      const input = screen.getByDisplayValue('textfield')
      expect(input).toBeInTheDocument()
      // eslint-disable-next-line testing-library/no-node-access
      expect(input.parentElement).toHaveClass('custom-class')
      // eslint-disable-next-line testing-library/no-node-access
      expect(input.parentElement).toHaveStyle({ marginTop: '48px' })
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
    it('Renders left adornments', () => {
      render(<Input leftAdornments={<span>$</span>} value="100" readOnly />)
      expect(screen.getByText('$')).toBeInTheDocument()
    })

    it('Renders right adornments', () => {
      render(<Input rightAdornments={<span>kg</span>} value="50" readOnly />)
      expect(screen.getByText('kg')).toBeInTheDocument()
    })

    it('Applies leftAdornmentsWidth for manual padding override', () => {
      render(
        <Input
          leftAdornments={<span>Icon</span>}
          leftAdornmentsWidth={32}
          placeholder="test"
        />,
      )
      const input = screen.getByPlaceholderText('test')
      expect(input).toHaveStyle({
        paddingLeft: 'calc(var(--eds-selectable-space-horizontal) + 32px)',
      })
    })

    it('Applies rightAdornmentsWidth for manual padding override', () => {
      render(
        <Input
          rightAdornments={<span>Icon</span>}
          rightAdornmentsWidth={48}
          placeholder="test"
        />,
      )
      const input = screen.getByPlaceholderText('test')
      expect(input).toHaveStyle({
        paddingRight: 'calc(var(--eds-selectable-space-horizontal) + 48px)',
      })
    })

    it('Uses manual widths when both adornments are present', () => {
      render(
        <Input
          leftAdornments={<span>Left</span>}
          rightAdornments={<span>Right</span>}
          leftAdornmentsWidth={24}
          rightAdornmentsWidth={24}
          placeholder="test"
        />,
      )
      const input = screen.getByPlaceholderText('test')
      expect(input).toHaveStyle({
        paddingLeft: 'calc(var(--eds-selectable-space-horizontal) + 24px)',
        paddingRight: 'calc(var(--eds-selectable-space-horizontal) + 24px)',
      })
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

      it('Applies disabled modifier class when disabled', () => {
        render(<Input disabled />)
        const wrapper = getInputWrapper()
        expect(wrapper).toHaveClass('eds-input-container--disabled')
      })

      it('Applies readonly modifier class when readOnly', () => {
        render(<Input readOnly />)
        const wrapper = getInputWrapper()
        expect(wrapper).toHaveClass('eds-input-container--readonly')
      })

      it('Applies invalid modifier class when invalid', () => {
        render(<Input invalid />)
        const wrapper = getInputWrapper()
        expect(wrapper).toHaveClass('eds-input-container--invalid')
      })
    })
  })
})
