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

    it('renders a hidden disabled placeholder option when placeholder is provided', () => {
      render(
        <Select
          label="Element"
          options={elements}
          placeholder="Select an element…"
        />,
      )
      const [placeholder] = screen.getAllByRole('option', { hidden: true })
      expect(placeholder).toBeDisabled()
      expect(placeholder).not.toBeVisible()
    })

    it('shows placeholder as selected value when no defaultValue is provided', () => {
      render(
        <Select
          label="Element"
          options={elements}
          placeholder="Select an element…"
        />,
      )
      expect(screen.getByRole('combobox')).toHaveValue('')
    })

    it('renders grouped options as optgroups', () => {
      render(
        <Select
          label="Element"
          options={[
            { label: 'Metals', options: ['Aluminium', 'Copper'] },
            { label: 'Other', options: ['Hydrogen', 'Oxygen'] },
          ]}
        />,
      )
      expect(
        screen.getByRole('option', { name: 'Aluminium' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('option', { name: 'Hydrogen' }),
      ).toBeInTheDocument()
      expect(screen.getAllByRole('option')).toHaveLength(4)
      expect(screen.getByRole('group', { name: 'Metals' })).toBeInTheDocument()
      expect(screen.getByRole('group', { name: 'Other' })).toBeInTheDocument()
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

    it('does not disable the select when readOnly (keeps it in tab order / readable by screen readers)', () => {
      render(<Select label="Element" options={elements} readOnly />)
      expect(screen.getByRole('combobox')).not.toBeDisabled()
    })

    it('sets aria-readonly when readOnly', () => {
      render(<Select label="Element" options={elements} readOnly />)
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-readonly',
        'true',
      )
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
    it('includes the value in FormData when readOnly', () => {
      render(
        <form aria-label="test">
          <Select
            label="Element"
            options={elements}
            name="element"
            defaultValue="Copper"
            readOnly
          />
        </form>,
      )
      const form = screen.getByRole('form', { name: 'test' }) as HTMLFormElement
      expect(new FormData(form).get('element')).toBe('Copper')
    })

    it('excludes the value from FormData when disabled', () => {
      render(
        <form aria-label="test">
          <Select
            label="Element"
            options={elements}
            name="element"
            defaultValue="Copper"
            disabled
          />
        </form>,
      )
      const form = screen.getByRole('form', { name: 'test' }) as HTMLFormElement
      expect(new FormData(form).get('element')).toBeNull()
    })

    it('excludes the value from FormData when readOnly but no name is set', () => {
      render(
        <form aria-label="test">
          <Select
            label="Element"
            options={elements}
            defaultValue="Copper"
            readOnly
          />
        </form>,
      )
      const form = screen.getByRole('form', { name: 'test' }) as HTMLFormElement
      expect(new FormData(form).get('element')).toBeNull()
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
