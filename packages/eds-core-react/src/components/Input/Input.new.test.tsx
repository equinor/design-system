import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Input } from './Input.new'
import { EdsProvider } from '../EdsProvider'

describe('Input (New)', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(<Input value="input value" readOnly />)
    expect(asFragment()).toMatchSnapshot()
  })

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

  it('Has correct default value', () => {
    const value = 'Some value'
    render(<Input id="test-value" value={value} readOnly />)
    const inputElement = screen.getByDisplayValue(value)
    expect(inputElement).toHaveValue(value)
  })

  it('Renders input with invalid state', () => {
    render(<Input aria-label="Invalid input" invalid />)
    const input = screen.getByRole('textbox', { name: 'Invalid input' })
    expect(input).toBeInTheDocument()
  })

  it('Can extend the css of the component with className and style', () => {
    render(
      <Input
        id="test-css-extend"
        invalid
        value="textfield"
        className="custom-class"
        style={{ marginTop: '48px' }}
        readOnly
      />,
    )
    const input = screen.getByDisplayValue('textfield')
    expect(input).toBeInTheDocument()
  })

  it('Renders left adornments', () => {
    render(
      <Input
        id="test-left-adornment"
        leftAdornments={<span>$</span>}
        value="100"
        readOnly
      />,
    )
    expect(screen.getByText('$')).toBeInTheDocument()
  })

  it('Renders right adornments', () => {
    render(
      <Input
        id="test-right-adornment"
        rightAdornments={<span>kg</span>}
        value="50"
        readOnly
      />,
    )
    expect(screen.getByText('kg')).toBeInTheDocument()
  })

  it('Renders as textarea when as prop is textarea', () => {
    render(<Input as="textarea" value="multiline text" readOnly />)
    const textarea = screen.getByDisplayValue('multiline text')
    expect(textarea.tagName).toBe('TEXTAREA')
  })

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

  describe('EDS 2.0 Token System', () => {
    describe('Invalid state mapping to color appearance', () => {
      it('Sets neutral appearance by default when not invalid', () => {
        render(<Input id="test-default" />)
        // eslint-disable-next-line testing-library/no-node-access
        const wrapper = screen.getByDisplayValue('').parentElement
        expect(wrapper).toHaveAttribute('data-color-appearance', 'neutral')
      })

      it('Maps invalid state to danger appearance', () => {
        render(<Input invalid />)
        // eslint-disable-next-line testing-library/no-node-access
        const wrapper = screen.getByDisplayValue('').parentElement
        expect(wrapper).toHaveAttribute('data-color-appearance', 'danger')
      })
    })

    describe('Fixed EDS 2.0 spacing (internal)', () => {
      it('Always sets data-selectable-space to xs', () => {
        render(<Input />)
        // eslint-disable-next-line testing-library/no-node-access
        const wrapper = screen.getByDisplayValue('').parentElement
        expect(wrapper).toHaveAttribute('data-selectable-space', 'xs')
      })

      it('Always sets data-space-proportions to stretched', () => {
        render(<Input />)
        // eslint-disable-next-line testing-library/no-node-access
        const wrapper = screen.getByDisplayValue('').parentElement
        expect(wrapper).toHaveAttribute('data-space-proportions', 'stretched')
      })
    })

    describe('Density (data-density)', () => {
      it('Does not set data-density attribute (controlled by parent)', () => {
        render(<Input />)
        // eslint-disable-next-line testing-library/no-node-access
        const wrapper = screen.getByDisplayValue('').parentElement
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

    describe('CSS classes and styling', () => {
      it('Applies correct CSS classes for styling hooks', () => {
        render(<Input className="test-class" />)
        // eslint-disable-next-line testing-library/no-node-access
        const wrapper = screen.getByDisplayValue('').parentElement
        expect(wrapper).toHaveClass('eds-input')
        expect(wrapper).toHaveClass('test-class')
      })

      it('Sets field class for token-based styling', () => {
        render(<Input value="test" readOnly />)
        const field = screen.getByDisplayValue('test')
        expect(field).toHaveClass('eds-field')
      })
    })

    describe('Adornment width props', () => {
      it('Accepts leftAdornmentsWidth prop for manual width override', () => {
        render(
          <Input
            leftAdornments={<span>Icon</span>}
            leftAdornmentsWidth={32}
            placeholder="test"
          />,
        )
        const input = screen.getByPlaceholderText('test')
        expect(input).toHaveStyle({
          paddingLeft: 'calc(var(--eds-selectable-spacing-inline) + 32px)',
        })
      })

      it('Accepts rightAdornmentsWidth prop for manual width override', () => {
        render(
          <Input
            rightAdornments={<span>Icon</span>}
            rightAdornmentsWidth={48}
            placeholder="test"
          />,
        )
        const input = screen.getByPlaceholderText('test')
        expect(input).toHaveStyle({
          paddingRight: 'calc(var(--eds-selectable-spacing-inline) + 48px)',
        })
      })

      it('Uses manual widths over auto-measured widths when both present', () => {
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
          paddingLeft: 'calc(var(--eds-selectable-spacing-inline) + 24px)',
          paddingRight: 'calc(var(--eds-selectable-spacing-inline) + 24px)',
        })
      })
    })
  })
})
