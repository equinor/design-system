import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { axe } from 'jest-axe'
import { Autocomplete } from '.'

const options = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry']

describe('Autocomplete (next)', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(
        <Autocomplete
          label="Fruit"
          options={options}
          data-testid="eds-autocomplete"
        />,
      )
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

    it('forwards ref to input element', () => {
      const ref = { current: null as HTMLInputElement | null }
      render(<Autocomplete ref={ref} label="Fruit" options={options} />)
      expect(ref.current).toBeInstanceOf(HTMLInputElement)
    })
  })

  describe('Dropdown behavior', () => {
    it('opens dropdown on focus', async () => {
      const user = userEvent.setup()
      render(<Autocomplete label="Fruit" options={options} />)
      const input = screen.getByRole('combobox')
      await user.click(input)
      expect(input).toHaveAttribute('aria-expanded', 'true')
    })

    it('shows all options on focus with empty input', async () => {
      const user = userEvent.setup()
      render(<Autocomplete label="Fruit" options={options} />)
      await user.click(screen.getByRole('combobox'))
      expect(screen.getAllByRole('option')).toHaveLength(options.length)
    })

    it('filters options based on input value', async () => {
      const user = userEvent.setup()
      render(<Autocomplete label="Fruit" options={options} />)
      const input = screen.getByRole('combobox')
      await user.type(input, 'an')
      const visibleOptions = screen.getAllByRole('option')
      expect(visibleOptions).toHaveLength(1)
      expect(screen.getByRole('option', { name: 'Banana' })).toBeInTheDocument()
    })

    it('selects an option on click', async () => {
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
      await user.click(screen.getByRole('option', { name: 'Apple' }))
      expect(onOptionSelect).toHaveBeenCalledWith('Apple')
    })

    it('sets input value to selected option', async () => {
      const user = userEvent.setup()
      render(<Autocomplete label="Fruit" options={options} />)
      await user.click(screen.getByRole('combobox'))
      await user.click(screen.getByRole('option', { name: 'Apple' }))
      expect(screen.getByRole('combobox')).toHaveValue('Apple')
    })
  })

  describe('States', () => {
    it('is disabled when disabled prop is true', () => {
      render(<Autocomplete label="Fruit" options={options} disabled />)
      expect(screen.getByRole('combobox')).toBeDisabled()
    })

    it('does not open dropdown when disabled', async () => {
      const user = userEvent.setup()
      render(<Autocomplete label="Fruit" options={options} disabled />)
      await user.click(screen.getByRole('combobox'))
      expect(screen.queryByRole('option')).not.toBeInTheDocument()
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
      expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute(
        'aria-selected',
        'true',
      )
    })
  })
})
