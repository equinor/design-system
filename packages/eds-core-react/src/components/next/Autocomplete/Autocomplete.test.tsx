import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { axe } from 'jest-axe'
import { Autocomplete } from '.'

// jsdom does not implement the Popover API — mock showPopover/hidePopover and
// fire a toggle event so React's onToggle handler updates isOpen state.
const showPopoverMock = jest.fn(function (this: HTMLElement) {
  if (this.hasAttribute('data-popover-open')) return
  this.setAttribute('data-popover-open', '')
  const event = Object.assign(new Event('toggle', { bubbles: false }), {
    newState: 'open',
    oldState: 'closed',
  })
  this.dispatchEvent(event)
})
const hidePopoverMock = jest.fn(function (this: HTMLElement) {
  if (!this.hasAttribute('data-popover-open')) return
  this.removeAttribute('data-popover-open')
  const event = Object.assign(new Event('toggle', { bubbles: false }), {
    newState: 'closed',
    oldState: 'open',
  })
  this.dispatchEvent(event)
})

// eslint-disable-next-line @typescript-eslint/unbound-method
const originalMatches = HTMLElement.prototype.matches

beforeAll(() => {
  HTMLElement.prototype.showPopover = showPopoverMock
  HTMLElement.prototype.hidePopover = hidePopoverMock
  HTMLElement.prototype.scrollIntoView = jest.fn()
  HTMLElement.prototype.matches = function (
    this: HTMLElement,
    selector: string,
  ) {
    if (selector === ':popover-open')
      return this.hasAttribute('data-popover-open')
    return Element.prototype.matches.call(this, selector)
  }
})

afterAll(() => {
  HTMLElement.prototype.matches = originalMatches
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

    it('shows all options when reopened after selection', async () => {
      const user = userEvent.setup()
      render(<Autocomplete label="Fruit" options={options} />)
      await user.click(screen.getByRole('combobox'))
      await user.click(
        screen.getByRole('option', { name: 'Apple', hidden: true }),
      )
      // Reopen
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

    it('shows noOptionsText when no options match', async () => {
      const user = userEvent.setup()
      render(
        <Autocomplete
          label="Fruit"
          options={options}
          noOptionsText="Nothing found"
        />,
      )
      await user.type(screen.getByRole('combobox'), 'zzz')
      expect(screen.getByText('Nothing found')).toBeInTheDocument()
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

  describe('Keyboard navigation', () => {
    it('ArrowDown opens listbox and activates first option', async () => {
      const user = userEvent.setup()
      render(<Autocomplete label="Fruit" options={options} />)
      await user.click(screen.getByRole('combobox'))
      await user.keyboard('{ArrowDown}')
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-activedescendant',
        expect.stringContaining('option-0'),
      )
    })

    it('ArrowDown moves to next option', async () => {
      const user = userEvent.setup()
      render(<Autocomplete label="Fruit" options={options} />)
      await user.click(screen.getByRole('combobox'))
      await user.keyboard('{ArrowDown}{ArrowDown}')
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-activedescendant',
        expect.stringContaining('option-1'),
      )
    })

    it('ArrowUp opens listbox and activates last option', async () => {
      const user = userEvent.setup()
      render(<Autocomplete label="Fruit" options={options} />)
      await user.click(screen.getByRole('combobox'))
      await user.keyboard('{ArrowUp}')
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-activedescendant',
        expect.stringContaining(`option-${options.length - 1}`),
      )
    })

    it('Escape closes the listbox', async () => {
      const user = userEvent.setup()
      render(<Autocomplete label="Fruit" options={options} />)
      await user.click(screen.getByRole('combobox'))
      await user.keyboard('{Escape}')
      expect(hidePopoverMock).toHaveBeenCalled()
    })

    it('Enter selects the active option', async () => {
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
      await user.keyboard('{ArrowDown}{Enter}')
      expect(onOptionSelect).toHaveBeenCalledWith('Apple')
    })

    it('ArrowDown starts at previously selected option on reopen', async () => {
      const user = userEvent.setup()
      render(<Autocomplete label="Fruit" options={options} />)
      // Select "Banana" (index 1)
      await user.click(screen.getByRole('combobox'))
      await user.keyboard('{ArrowDown}{ArrowDown}{Enter}')
      expect(screen.getByRole('combobox')).toHaveValue('Banana')
      // Reopen and press ArrowDown — should start at Banana (index 1)
      await user.click(screen.getByRole('combobox'))
      await user.keyboard('{ArrowDown}')
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-activedescendant',
        expect.stringContaining('option-1'),
      )
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

  describe('Clear button', () => {
    it('shows clear button when input has a value', async () => {
      const user = userEvent.setup()
      render(<Autocomplete label="Fruit" options={options} />)
      await user.type(screen.getByRole('combobox'), 'Apple')
      expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument()
    })

    it('hides clear button when input is empty', () => {
      render(<Autocomplete label="Fruit" options={options} />)
      expect(
        screen.queryByRole('button', { name: 'Clear' }),
      ).not.toBeInTheDocument()
    })

    it('clears the input value when clear button is clicked', async () => {
      const user = userEvent.setup()
      render(<Autocomplete label="Fruit" options={options} />)
      await user.type(screen.getByRole('combobox'), 'Apple')
      await user.click(screen.getByRole('button', { name: 'Clear' }))
      expect(screen.getByRole('combobox')).toHaveValue('')
    })

    it('calls onClear when clear button is clicked', async () => {
      const onClear = jest.fn()
      const user = userEvent.setup()
      render(<Autocomplete label="Fruit" options={options} onClear={onClear} />)
      await user.type(screen.getByRole('combobox'), 'Apple')
      await user.click(screen.getByRole('button', { name: 'Clear' }))
      expect(onClear).toHaveBeenCalled()
    })

    it('hides clear button when disabled', () => {
      render(
        <Autocomplete
          label="Fruit"
          options={options}
          defaultValue="Apple"
          disabled
        />,
      )
      expect(
        screen.queryByRole('button', { name: 'Clear' }),
      ).not.toBeInTheDocument()
    })

    it('uses custom clearLabel for accessibility', async () => {
      const user = userEvent.setup()
      render(
        <Autocomplete label="Fruit" options={options} clearLabel="Tøm felt" />,
      )
      await user.type(screen.getByRole('combobox'), 'Apple')
      expect(
        screen.getByRole('button', { name: 'Tøm felt' }),
      ).toBeInTheDocument()
    })
  })

  describe('allowCustomValue', () => {
    it('shows Add option when typing a value not in the list', async () => {
      const user = userEvent.setup()
      render(<Autocomplete label="Fruit" options={options} allowCustomValue />)
      await user.type(screen.getByRole('combobox'), 'Mango')
      expect(screen.getByRole('option', { name: /Mango/ })).toBeInTheDocument()
    })

    it('shows placeholder text when allowCustomValue and no custom value typed', () => {
      render(<Autocomplete label="Fruit" options={options} allowCustomValue />)
      expect(screen.getByText('Type to add new option')).toBeInTheDocument()
    })

    it('shows disabled Add option when typed value matches an existing option', async () => {
      const user = userEvent.setup()
      render(<Autocomplete label="Fruit" options={options} allowCustomValue />)
      await user.type(screen.getByRole('combobox'), 'Apple')
      const addOption = screen.getByRole('option', {
        name: 'Type to add new option',
      })
      expect(addOption).toHaveAttribute('aria-disabled', 'true')
    })

    it('does not show Add option without allowCustomValue prop', async () => {
      const user = userEvent.setup()
      render(<Autocomplete label="Fruit" options={options} />)
      await user.type(screen.getByRole('combobox'), 'Mango')
      expect(
        screen.queryByText('Type to add new option'),
      ).not.toBeInTheDocument()
    })

    it('calls onOptionSelect with typed value when Add option is selected via Enter', async () => {
      const onOptionSelect = jest.fn()
      const user = userEvent.setup()
      render(
        <Autocomplete
          label="Fruit"
          options={options}
          allowCustomValue
          onOptionSelect={onOptionSelect}
        />,
      )
      // 'Mango' matches nothing — Add option is the only item (index 0)
      await user.type(screen.getByRole('combobox'), 'Mango')
      await user.keyboard('{ArrowDown}{Enter}')
      expect(onOptionSelect).toHaveBeenCalledWith('Mango')
    })

    it('sets input value to typed value when Add option is selected via click', async () => {
      const user = userEvent.setup()
      render(<Autocomplete label="Fruit" options={options} allowCustomValue />)
      await user.type(screen.getByRole('combobox'), 'Mango')
      await user.click(screen.getByRole('option', { name: /Mango/ }))
      expect(screen.getByRole('combobox')).toHaveValue('Mango')
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
      expect(screen.getByRole('listbox', { hidden: true })).toHaveAttribute(
        'id',
        listboxId,
      )
    })

    it('input has aria-expanded false when closed', () => {
      render(<Autocomplete label="Fruit" options={options} />)
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-expanded',
        'false',
      )
    })

    it('input has aria-expanded true when open', async () => {
      const user = userEvent.setup()
      render(<Autocomplete label="Fruit" options={options} />)
      await user.click(screen.getByRole('combobox'))
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-expanded',
        'true',
      )
    })

    it('sets aria-activedescendant when option is keyboard-focused', async () => {
      const user = userEvent.setup()
      render(<Autocomplete label="Fruit" options={options} />)
      await user.click(screen.getByRole('combobox'))
      await user.keyboard('{ArrowDown}')
      expect(
        screen.getByRole('combobox').getAttribute('aria-activedescendant'),
      ).toBeTruthy()
    })

    it('clears aria-activedescendant when listbox closes', async () => {
      const user = userEvent.setup()
      render(<Autocomplete label="Fruit" options={options} />)
      await user.click(screen.getByRole('combobox'))
      await user.keyboard('{ArrowDown}{Escape}')
      expect(
        screen.queryByRole('combobox').getAttribute('aria-activedescendant'),
      ).toBeFalsy()
    })

    it('clears aria-activedescendant when tabbing away', async () => {
      const user = userEvent.setup()
      render(<Autocomplete label="Fruit" options={options} />)
      await user.tab()
      await user.keyboard('{ArrowDown}')
      expect(
        screen.getByRole('combobox').getAttribute('aria-activedescendant'),
      ).toBeTruthy()
      await user.tab()
      expect(
        screen.queryByRole('combobox').getAttribute('aria-activedescendant'),
      ).toBeFalsy()
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

    it('has a live region for announcing result count', async () => {
      const user = userEvent.setup()
      render(<Autocomplete label="Fruit" options={options} />)
      await user.click(screen.getByRole('combobox'))
      expect(screen.getByRole('status')).toBeInTheDocument()
    })
  })
})
