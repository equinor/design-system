import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { axe } from 'jest-axe'
import { Autocomplete } from '.'

// jsdom does not implement the Popover API
const showPopoverMock = jest.fn(function (this: HTMLElement) {
  this.setAttribute('data-popover-open', '')
})
const hidePopoverMock = jest.fn(function (this: HTMLElement) {
  this.removeAttribute('data-popover-open')
})

beforeAll(() => {
  HTMLElement.prototype.showPopover = showPopoverMock
  HTMLElement.prototype.hidePopover = hidePopoverMock
  HTMLElement.prototype.matches = function (
    this: HTMLElement,
    selector: string,
  ) {
    if (selector === ':popover-open')
      return this.hasAttribute('data-popover-open')
    return Element.prototype.matches.call(this, selector)
  }
})

afterEach(() => jest.clearAllMocks())

const options = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry']

describe('Autocomplete (next)', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Autocomplete label="Fruit" options={options} />)
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('renders label', () => {
      render(<Autocomplete label="Fruit" options={options} />)
      expect(screen.getByText('Fruit')).toBeInTheDocument()
    })

    it('renders placeholder', () => {
      render(
        <Autocomplete
          label="Fruit"
          options={options}
          placeholder="Search..."
        />,
      )
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
    })

    it('renders helper message', () => {
      render(
        <Autocomplete
          label="Fruit"
          options={options}
          helperMessage="Select a fruit"
        />,
      )
      expect(screen.getByText('Select a fruit')).toBeInTheDocument()
    })

    it('listbox has popover="auto" attribute', () => {
      render(<Autocomplete label="Fruit" options={options} />)
      expect(screen.getByRole('listbox', { hidden: true })).toHaveAttribute(
        'popover',
        'auto',
      )
    })

    it('forwards ref to input element', () => {
      const ref = { current: null as HTMLInputElement | null }
      render(<Autocomplete ref={ref} label="Fruit" options={options} />)
      expect(ref.current).toBeInstanceOf(HTMLInputElement)
    })
  })

  describe('Dropdown behavior', () => {
    it('calls showPopover on focus', async () => {
      const user = userEvent.setup()
      render(<Autocomplete label="Fruit" options={options} />)
      await user.click(screen.getByRole('combobox'))
      expect(showPopoverMock).toHaveBeenCalled()
    })

    it('shows all options when opened', async () => {
      const user = userEvent.setup()
      render(<Autocomplete label="Fruit" options={options} />)
      await user.click(screen.getByRole('combobox'))
      expect(screen.getAllByRole('option', { hidden: true })).toHaveLength(
        options.length,
      )
    })

    it('filters options based on input value', async () => {
      const user = userEvent.setup()
      render(<Autocomplete label="Fruit" options={options} />)
      await user.type(screen.getByRole('combobox'), 'an')
      expect(
        screen.getByRole('option', { name: 'Banana', hidden: true }),
      ).toBeInTheDocument()
      expect(
        screen.queryByRole('option', { name: 'Apple', hidden: true }),
      ).not.toBeInTheDocument()
    })

    it('calls hidePopover when option is selected', async () => {
      const user = userEvent.setup()
      render(<Autocomplete label="Fruit" options={options} />)
      await user.click(screen.getByRole('combobox'))
      await user.click(
        screen.getByRole('option', { name: 'Apple', hidden: true }),
      )
      expect(hidePopoverMock).toHaveBeenCalled()
    })

    it('calls onOptionSelect with selected option', async () => {
      const onOptionSelect = jest.fn()
      const user = userEvent.setup()
      render(
        <Autocomplete
          label="Fruit"
          options={options}
          onOptionSelect={onOptionSelect}
        />,
      )
      await user.click(screen.getByRole('combobox'))
      await user.click(
        screen.getByRole('option', { name: 'Apple', hidden: true }),
      )
      expect(onOptionSelect).toHaveBeenCalledWith('Apple')
    })

    it('sets input value to selected option', async () => {
      const user = userEvent.setup()
      render(<Autocomplete label="Fruit" options={options} />)
      await user.click(screen.getByRole('combobox'))
      await user.click(
        screen.getByRole('option', { name: 'Apple', hidden: true }),
      )
      expect(screen.getByRole('combobox')).toHaveValue('Apple')
    })
  })

  describe('States', () => {
    it('is disabled when disabled prop is true', () => {
      render(<Autocomplete label="Fruit" options={options} disabled />)
      expect(screen.getByRole('combobox')).toBeDisabled()
    })

    it('does not call showPopover when disabled', async () => {
      const user = userEvent.setup()
      render(<Autocomplete label="Fruit" options={options} disabled />)
      await user.click(screen.getByRole('combobox'))
      expect(showPopoverMock).not.toHaveBeenCalled()
    })

    it('is readonly when readOnly prop is true', () => {
      render(<Autocomplete label="Fruit" options={options} readOnly />)
      expect(screen.getByRole('combobox')).toHaveAttribute('readonly')
    })

    it('shows invalid state', () => {
      render(
        <Autocomplete
          label="Fruit"
          options={options}
          invalid
          helperMessage="Required"
        />,
      )
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-invalid',
        'true',
      )
    })
  })

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <Autocomplete label="Fruit" options={options} />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no accessibility violations in error state', async () => {
      const { container } = render(
        <Autocomplete
          label="Fruit"
          options={options}
          invalid
          helperMessage="This field is required"
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no accessibility violations when disabled', async () => {
      const { container } = render(
        <Autocomplete label="Fruit" options={options} disabled />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('input has aria-controls pointing to listbox', () => {
      render(<Autocomplete label="Fruit" options={options} />)
      const input = screen.getByRole('combobox')
      const listboxId = input.getAttribute('aria-controls')
      expect(listboxId).toBeTruthy()
      expect(document.getElementById(listboxId)).toBeInTheDocument()
    })

    it('marks selected option with aria-selected', async () => {
      const user = userEvent.setup()
      render(
        <Autocomplete label="Fruit" options={options} selectedOption="Apple" />,
      )
      await user.click(screen.getByRole('combobox'))
      expect(
        screen.getByRole('option', { name: 'Apple', hidden: true }),
      ).toHaveAttribute('aria-selected', 'true')
    })
  })
})
