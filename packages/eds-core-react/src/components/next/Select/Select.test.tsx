import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Select } from '.'

const elements = ['Aluminium', 'Copper', 'Iron', 'Lead']

describe('Select (next)', () => {
  describe('Rendering', () => {
    it('renders a select element', () => {
      render(<Select label="Element" options={elements} />)
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('renders all options', () => {
      render(<Select label="Element" options={elements} />)
      expect(screen.getAllByRole('option')).toHaveLength(elements.length)
    })

    it('renders option labels for object options', () => {
      type Well = { id: string; name: string }
      const wells: Well[] = [
        { id: 'w1', name: 'Gullfaks A' },
        { id: 'w2', name: 'Statfjord B' },
      ]
      render(
        <Select
          label="Well"
          options={wells}
          getOptionLabel={(o) => o.name}
          getOptionValue={(o) => o.id}
        />,
      )
      expect(
        screen.getByRole('option', { name: 'Gullfaks A' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('option', { name: 'Statfjord B' }),
      ).toBeInTheDocument()
    })

    it('renders label', () => {
      render(<Select label="Element" options={elements} />)
      expect(screen.getByLabelText('Element')).toBeInTheDocument()
    })

    it('renders helper message', () => {
      render(
        <Select label="Element" options={elements} helperMessage="Pick one" />,
      )
      expect(screen.getByText('Pick one')).toBeInTheDocument()
    })

    it('pre-selects the option matching defaultValue', () => {
      render(<Select label="Element" options={elements} defaultValue="Iron" />)
      expect(screen.getByRole('combobox')).toHaveValue('Iron')
    })

    it('renders a disabled hidden placeholder option when placeholder is provided', () => {
      const { container } = render(
        <Select
          label="Element"
          options={elements}
          placeholder="Select an element…"
        />,
      )
      // <option hidden> is excluded from the a11y tree — query the DOM directly
      const placeholder = container.querySelector('option[value=""]')
      expect(placeholder).toBeInTheDocument()
      expect(placeholder).toHaveTextContent('Select an element…')
      expect(placeholder).toBeDisabled()
    })

    it('disables specific options via optionDisabled', () => {
      render(
        <Select
          label="Element"
          options={elements}
          optionDisabled={(o) => o === 'Lead'}
        />,
      )
      expect(screen.getByRole('option', { name: 'Lead' })).toBeDisabled()
      expect(screen.getByRole('option', { name: 'Copper' })).not.toBeDisabled()
    })
  })

  describe('States', () => {
    it('disables the select when disabled', () => {
      render(<Select label="Element" options={elements} disabled />)
      expect(screen.getByRole('combobox')).toBeDisabled()
    })

    it('disables the select interaction when readOnly', () => {
      render(<Select label="Element" options={elements} readOnly />)
      expect(screen.getByRole('combobox')).toBeDisabled()
    })

    it('does not set aria-readonly (contradicts disabled; data-readonly on container carries the distinction)', () => {
      render(<Select label="Element" options={elements} readOnly />)
      expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-readonly')
    })

    it('marks the select as invalid', () => {
      render(<Select label="Element" options={elements} invalid />)
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-invalid',
        'true',
      )
    })

    it('calls onChange when the value changes', () => {
      const handleChange = jest.fn()
      render(
        <Select label="Element" options={elements} onChange={handleChange} />,
      )
      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'Iron' },
      })
      expect(handleChange).toHaveBeenCalledTimes(1)
    })
  })

  describe('Form', () => {
    it('renders a hidden input to preserve the value when readOnly', () => {
      const { container } = render(
        <Select
          label="Element"
          options={elements}
          name="element"
          defaultValue="Copper"
          readOnly
        />,
      )
      const hidden = container.querySelector('input[type="hidden"]')
      expect(hidden).toBeInTheDocument()
      expect(hidden).toHaveAttribute('name', 'element')
      expect(hidden).toHaveAttribute('value', 'Copper')
    })

    it('does not render a hidden input when disabled (value intentionally excluded)', () => {
      const { container } = render(
        <Select
          label="Element"
          options={elements}
          name="element"
          defaultValue="Copper"
          disabled
        />,
      )
      expect(
        container.querySelector('input[type="hidden"]'),
      ).not.toBeInTheDocument()
    })

    it('does not render a hidden input when readOnly but no name is set', () => {
      const { container } = render(
        <Select
          label="Element"
          options={elements}
          defaultValue="Copper"
          readOnly
        />,
      )
      expect(
        container.querySelector('input[type="hidden"]'),
      ).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('associates description and helperMessage via aria-describedby', () => {
      render(
        <Select
          id="select-1"
          label="Element"
          options={elements}
          description="Extra context"
          helperMessage="Helper text"
        />,
      )
      const select = screen.getByRole('combobox')
      const describedBy = select.getAttribute('aria-describedby') ?? ''
      expect(describedBy).toContain(screen.getByText('Extra context').id)
      expect(describedBy).toContain(screen.getByText('Helper text').id)
    })

    it('passes axe', async () => {
      const { container } = render(
        <Select label="Element" options={elements} />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('passes axe in invalid state', async () => {
      const { container } = render(
        <Select
          label="Element"
          options={elements}
          invalid
          helperMessage="Required"
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('passes axe in disabled state', async () => {
      const { container } = render(
        <Select label="Element" options={elements} disabled />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('passes axe in readOnly state', async () => {
      const { container } = render(
        <Select label="Element" options={elements} readOnly />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('passes axe with placeholder', async () => {
      const { container } = render(
        <Select
          label="Element"
          options={elements}
          placeholder="Select an element…"
        />,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
